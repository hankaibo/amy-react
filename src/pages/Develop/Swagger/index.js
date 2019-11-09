import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Modal, Icon, Table, Input, Upload, message } from 'antd';
import { isEqual } from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import Authorized from '@/utils/Authorized';
import styles from '../../System/System.less';

const { TreeNode } = Tree;
const { Search } = Input;
const { Dragger } = Upload;
const { confirm } = Modal;

const Swagger = connect(({ developSwagger: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.developSwagger,
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的部门】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [swagger, setSwagger] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // 【首次请求加载树数据】
  useEffect(() => {
    return () => {
      dispatch({
        type: 'developSwagger/clear',
      });
    };
  }, [dispatch]);

  // 【获取子部门数据】
  const handleSelect = (selectedKeys, info) => {
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'developSwagger/fetchChildrenById',
      payload: {
        id,
      },
      callback: () => {
        setSwagger(info.node.props);
      },
    });
  };

  // 【批量导入】
  const importBatchItem = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemUser/deleteBatch',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const handleBatchImport = () => {
    Modal.confirm({
      title: '批量导入',
      content: '您确定批量导入这些接口吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => importBatchItem(),
    });
  };

  // 【导入】
  const importItem = record => {
    const { id } = record;
    dispatch({
      type: 'systemUser/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('导入成功');
      },
    });
  };
  const handleImport = record => {
    Modal.confirm({
      title: '导入',
      content: '您确定要导入该接口吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => importItem(record),
    });
  };

  // 【搜索高亮部门】
  const handleChange = e => {
    const { value } = e.target;
    setSearchValue(value);
  };

  // 【构造树结构，添加高亮支持】
  const loop = data =>
    data.map(item => {
      const it = { ...item };
      it.titleValue = it.title;
      delete it.title;
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title} {...it}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      // 因为返回的是树，为了避免在models里循环就在这里直接使用status了。
      return <TreeNode key={item.key} title={title} {...it} />;
    });

  // 【上传】
  const props = {
    name: 'swagger',
    accept: 'application/json,.json',
    action: 'tmp/',
    beforeUpload() {
      if (tree.length) {
        confirm({
          title: '你确认要覆盖原内容吗?',
          content: '请注意，上传文件会覆盖已有的内容。',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'developSwagger/clear',
            });
            return true;
          },
          onCancel() {
            return false;
          },
        });
      }
      return true;
    },
    // 此file非File对象实例，是包装之后的，请注意。
    onChange({ file }) {
      const { status, originFileObj } = file;
      if (status === 'done') {
        message.success(`${file.name} 文件上传成功。`);
        const reader = new FileReader();
        reader.readAsText(originFileObj);
        // reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          const fileContent = JSON.parse(reader.result);
          dispatch({
            type: 'developSwagger/save',
            payload: {
              fileContent,
            },
          });
        };
      } else if (status === 'error') {
        message.error(`${file.name} 文件上传失败。`);
      }
    },
  };
  const mainUpload = (
    <div style={{ textAlign: 'center' }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或者拖拽swagger json文件至此上传</p>
      </Dragger>
    </div>
  );

  // 【复选框相关操作】
  const handleRowSelectChange = rowKeys => {
    setSelectedRowKeys(rowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectChange,
  };

  // 【表格列】
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      render: text => {
        return (
          <Ellipsis tooltip={text} length={15}>
            {text}
          </Ellipsis>
        );
      },
    },
    {
      title: '接口url',
      dataIndex: 'url',
      render: text => {
        return (
          <Ellipsis tooltip={text} length={40}>
            {text}
          </Ellipsis>
        );
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Authorized authority="develop.swagger.import" noMatch={null}>
          <a onClick={() => handleImport(record)}>
            <Icon type="import" />
          </a>
        </Authorized>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content={mainUpload}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="接口分类"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleChange} />
            <Tree showLine switcherIcon={<Icon type="down" />} onSelect={handleSelect}>
              {loop(tree)}
            </Tree>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={swagger ? `【${swagger.titleValue}】的接口` : '接口列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="develop.swagger.batchImport" noMatch={null}>
                  <Button
                    type="primary"
                    disabled={selectedRowKeys.length <= 0}
                    title="导入"
                    onClick={handleBatchImport}
                  >
                    <Icon type="import" />
                  </Button>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                childrenColumnName="child"
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={false}
                rowSelection={rowSelection}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default memo(Swagger, areEqual);
