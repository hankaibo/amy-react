import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tree, Table, Switch, Button, Popconfirm, Divider, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue, isArray, isEmpty } from '@/utils/utils';
import RoleForm from './components/RoleForm';
import RoleResourceForm from './components/RoleResourceForm';

const Role = connect(({ systemRole: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemRole/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的角色】
  const [currentRole, setCurrentRole] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({ id: null, status: null });
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【初始化后，加载左侧角色树数据】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetch',
    });
    return () => {
      dispatch({
        type: 'systemRole/clearTree',
      });
    };
  }, [dispatch]);

  // 【默认子角色数据、当前角色】
  useEffect(() => {
    if (first && isArray(tree) && !isEmpty(tree)) {
      setParams({ ...params, id: tree[0].id });
      setCurrentRole({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree, params]);

  // 【查询角色列表】
  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch({
        type: 'systemRole/fetchChildrenById',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemRole/clearList',
      });
    };
  }, [params, dispatch]);

  // 【选择角色并获取其子角色数据】
  const handleSelect = (selectedKeys, { selectedNodes }) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setCurrentRole(selectedNodes[0]);
      setParams({ ...params, id });
    }
  };

  // 【启用禁用角色】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemRole/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【移动角色】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemRole/move',
      payload: {
        sourceId: record.id,
        targetId,
      },
      callback: () => {
        message.success('移动角色成功。');
      },
    });
  };

  // 【删除角色】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemRole/delete',
      payload: {
        id,
      },
      callback: () => {
        message.success('删除角色成功。');
      },
    });
  };

  // 【过滤角色】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    setParams({
      ...params,
      ...filters,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:role:status" noMatch={NoMatch(!!text)}>
          <Switch checked={!!text} onClick={(checked) => toggleStatus(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:role:move" noMatch="--">
          <ArrowUpOutlined className="icon" title="向上" onClick={() => handleMove(record, index - 1)} />
          <Divider type="vertical" />
          <ArrowDownOutlined
            className="icon"
            type="arrow-downy"
            title="向下"
            onClick={() => handleMove(record, index + 1)}
          />
        </Authorized>
      ),
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      render: (text, record) => (
        <>
          <Authorized authority="system:role:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <RoleForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:role:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该角色吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:role:grant" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <KeyOutlined title="分配资源" className="icon" disabled={!record.status} onClick={showModalHandler} />
                  <Modal title="分配资源">
                    <RoleResourceForm id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card title="角色树" bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
            {isArray(tree) && !isEmpty(tree) && (
              <Tree
                showLine
                defaultExpandedKeys={[tree[0].key]}
                defaultSelectedKeys={[tree[0].key]}
                onSelect={handleSelect}
                treeData={tree}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={currentRole && `【${currentRole.title}】的子角色`}
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <div className="tableList">
              <div className="tableListOperator">
                <Authorized authority="system:role:add" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button type="primary" title="新增" onClick={showModalHandler}>
                          <PlusOutlined />
                        </Button>
                        <Modal title="新增">
                          <RoleForm id={currentRole && currentRole.id} />
                        </Modal>
                      </>
                    )}
                  </RenderPropsModal>
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
                onChange={handleTableChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
});

export default Role;
