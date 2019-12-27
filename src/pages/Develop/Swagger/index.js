import { Button, Card, Col, Icon, Input, Row, Table, Tree, Upload, message } from 'antd';
import React, { memo, useEffect, useState } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import Authorized from '@/utils/Authorized';
import Ellipsis from '@/components/Ellipsis';
import SwaggerImportForm from './components/SwaggerImportForm';
import styles from '../../System/System.less';

const { TreeNode } = Tree;
const { Search } = Input;
const { Dragger } = Upload;

const Swagger = connect(({ developSwagger: { tree, list, selectedRowKeys }, loading }) => ({
  tree,
  list,
  selectedRowKeys,
  loading: loading.models.developSwagger,
}))(({ loading, tree, list, selectedRowKeys, dispatch }) => {
  const [title, setTitle] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // 【清空上传的swagger文件数据】
  useEffect(
    () => () => {
      dispatch({
        type: 'developSwagger/clearFile',
      });
    },
    [dispatch],
  );

  // 【获取子接口数据】
  const handleSelect = (selectedKeys, info) => {
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'developSwagger/fetch',
      payload: {
        id,
      },
    });
    setTitle(selectedKeys);
  };

  // 【搜索高亮部门】
  const handleChange = e => {
    const { value } = e.target;
    setSearchValue(value);
  };

  // 【构造树结构，添加高亮支持】
  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const highTitle =
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
          <TreeNode key={item.key} title={highTitle}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      // 因为返回的是树，为了避免在models里循环就在这里直接使用status了。
      return <TreeNode key={item.key} title={highTitle} />;
    });

  // 【上传】
  const props = {
    name: 'swagger',
    accept: '.json',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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
            type: 'developSwagger/uploadFile',
            payload: {
              fileContent,
            },
          });
        };
      } else if (status === 'error') {
        message.error(`${file.name} 文件上传失败。`);
      }
    },
    onRemove() {
      dispatch({
        type: 'developSwagger/clearFile',
      });
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
    dispatch({
      type: 'developSwagger/saveSelected',
      payload: {
        rowKeys,
      },
    });
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
      render: text => (
        <Ellipsis tooltip={text} length={15}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '接口url',
      dataIndex: 'uri',
      render: text => (
        <Ellipsis tooltip={text} length={40}>
          {text}
        </Ellipsis>
      ),
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
        <Authorized authority="develop:swagger:import" noMatch={null}>
          <SwaggerImportForm swagger={[record.id]}>
            <Icon type="import" className="icon" />
          </SwaggerImportForm>
        </Authorized>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false} content={mainUpload}>
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
            title={title ? `【${title}】` : '【接口列表】'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="develop:swagger:batchImport" noMatch={null}>
                  <SwaggerImportForm swagger={selectedRowKeys}>
                    <Button type="primary" disabled={selectedRowKeys.length <= 0} title="导入">
                      <Icon type="import" />
                    </Button>
                  </SwaggerImportForm>
                </Authorized>
              </div>
              <Table
                bordered
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

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Swagger, areEqual);
