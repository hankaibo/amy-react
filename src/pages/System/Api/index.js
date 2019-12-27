import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import { getValue } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import ResourceForm from './components/ResourceForm';
import styles from '../System.less';

const { DirectoryTree } = Tree;

const Api = connect(({ systemApi: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.systemApi,
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的菜单】
  const [api, setApi] = useState(null);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemApi/fetch',
    });
    return function cleanup() {
      dispatch({
        type: 'systemApi/clearTree',
      });
      dispatch({
        type: 'systemApi/clearList',
      });
    };
  }, [dispatch]);

  // 【获取子菜单数据】
  const handleSelect = (selectedKeys, info) => {
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    if (info.node.isLeaf()) {
      dispatch({
        type: 'systemApi/fetchChildrenById',
        payload: {
          id,
        },
        callback: () => {
          setApi(info.node.props);
        },
      });
    } else {
      dispatch({
        type: 'systemApi/clearList',
      });
    }
  };

  // 【启用禁用按钮】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemApi/update',
      payload: { ...record, status: checked },
    });
  };

  // 【移动按钮】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemApi/move',
      payload: {
        ...record,
        sourceId: record.id,
        targetId,
      },
    });
  };

  // 【删除】
  const deleteItem = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemApi/delete',
      payload: {
        id,
        parentId,
      },
      callback: () => {
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
    });
  };

  // 【过滤按钮】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = api;

    const params = {
      id,
      ...filters,
    };

    dispatch({
      type: 'systemApi/fetchChildrenById',
      payload: params,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'title',
      render: (text, record) => record.name || record.title,
    },
    {
      title: '接口url',
      dataIndex: 'uri',
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
      title: '接口状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:api:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={checked => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:api:move" noMatch={null}>
          <a
            onClick={() => handleMove(record, index - 1)}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a>
            <Icon type="arrow-down" title="向下" onClick={() => handleMove(record, index + 1)} />
          </a>
        </Authorized>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system:api:update" noMatch={null}>
            <ResourceForm isEdit api={record} parent={api}>
              <IconFont type="icon-edit" title="编辑" className="icon" />
            </ResourceForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:api:delete" noMatch={null}>
            <IconFont
              type="icon-delete"
              title="删除"
              className="icon"
              onClick={() => handleDelete(record)}
            />
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="菜单树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <DirectoryTree treeData={tree} onSelect={handleSelect} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={api ? `[${api.title}]的接口` : '接口列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:api:add" noMatch={null}>
                  <ResourceForm parent={api}>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
                    </Button>
                  </ResourceForm>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={false}
                onChange={handleTableChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Api, areEqual);
