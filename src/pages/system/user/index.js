import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tree, Table, Input, Switch, Button, Popconfirm, Divider, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserSwitchOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue, isArray, isEmpty } from '@/utils/utils';
import UserForm from './components/UserForm';
import UserRoleForm from './components/UserRoleForm';
import UserPasswordForm from './components/UserPasswordForm';

const sexText = {
  1: '男',
  2: '女',
  3: '保密',
};

const User = connect(({ systemUser: { tree, list, pagination }, loading }) => ({
  tree,
  list,
  pagination,
  loading: loading.effects['systemUser/fetch'],
}))(({ loading, tree, list, pagination, dispatch }) => {
  // 【当前点击的部门】
  const [currentDepartment, setCurrentDepartment] = useState(null);
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
    departmentId: null,
    sex: null,
    status: null,
  });
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【初始化后，加载左侧部门树数据】
  useEffect(() => {
    // 用户页面默认只查询可用状态的部门。
    dispatch({
      type: 'systemUser/fetchTree',
      payload: {
        status: 'ENABLED',
      },
    });
    return () => {
      dispatch({
        type: 'systemUser/clearTree',
      });
    };
  }, [dispatch]);

  // 【默认部门的用户数据、当前部门】
  useEffect(() => {
    if (first && isArray(tree) && !isEmpty(tree)) {
      setParams({ ...params, departmentId: tree[0].id });
      setCurrentDepartment({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree, params]);

  // 【查询用户列表】
  useEffect(() => {
    const { departmentId } = params;
    if (departmentId) {
      dispatch({
        type: 'systemUser/fetch',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemUser/clearList',
      });
    };
  }, [params, dispatch]);

  // 【选择部门并获取其用户数据】
  const handleSelect = (selectedKeys, { selectedNodes }) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setCurrentDepartment(selectedNodes[0]);
      setParams({ ...params, departmentId: id });
      setSelectedRowKeys([]);
    }
  };

  // 【启用禁用用户】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemUser/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('暂未开放。');
  };

  // 【批量删除用户】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemUser/deleteBatch',
      payload: {
        userIds: selectedRowKeys,
        // 多部门用户，所以带上部门id
        departmentId: params.departmentId,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('批量删除用户成功。');
      },
    });
  };

  // 【删除用户】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemUser/delete',
      payload: {
        id,
        // 多部门用户，所以带上部门id
        departmentId: params.departmentId,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除用户成功。');
      },
    });
  };

  // 【复选框相关操作】
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  // 【分页、过滤用户】
  const handleTableChange = (page, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { current, pageSize } = page;
    setParams({
      ...params,
      current,
      pageSize,
      ...filters,
    });
  };

  // 【全页搜索框】
  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入用户名称或者手机号码。"
        enterButton
        size="large"
        onSearch={handleFormSubmit}
        style={{ maxWidth: 522, width: '100%' }}
      />
    </div>
  );

  // 【表格列】
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: [
        { text: '男', value: 1 },
        { text: '女', value: 2 },
        { text: '保密', value: 3 },
      ],
      filterMultiple: false,
      render: (text) => sexText[text],
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
      ],
      filterMultiple: false,
      width: 110,
      render: (text, record) => (
        <Authorized authority="system:user:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={(checked) => toggleStatus(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '电话',
      colSpan: 2,
      dataIndex: 'phone',
    },
    {
      title: '手机',
      colSpan: 0,
      dataIndex: 'mobile',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <>
          {/* Note: system:user:xxx为【资源保护】菜单中用户管理修改接口(system:user:update)的编码名称。必须两者一致才能动态隐藏显示按钮。 */}
          <Authorized authority="system:user:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <UserForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该用户吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:grant" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <UserSwitchOutlined
                    title="分配角色"
                    className="icon"
                    disabled={!record.status}
                    onClick={showModalHandler}
                  />
                  <Modal title="分配角色">
                    <UserRoleForm id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:pwd:reset" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <ReloadOutlined title="重置密码" className="icon" onClick={showModalHandler} />
                  <Modal title={`您确定要重置 ${record.username} 的密码吗？`}>
                    <UserPasswordForm id={record.id} />
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
    <PageContainer title={false} content={mainSearch}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card title="组织" bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
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
            title={currentDepartment && `【${currentDepartment.title}】的用户`}
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <div className="tableList">
              <div className="tableListOperator">
                <Authorized authority="system:user:add" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button type="primary" title="新增" onClick={showModalHandler}>
                          <PlusOutlined />
                        </Button>
                        <Modal title="新增">
                          <UserForm departmentId={currentDepartment ? currentDepartment.id : null} />
                        </Modal>
                      </>
                    )}
                  </RenderPropsModal>
                </Authorized>
                <Authorized authority="system:user:batchDelete" noMatch={null}>
                  <Popconfirm
                    title="您确定要删除这些用户吗？"
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                    disabled={selectedRowKeys.length <= 0}
                  >
                    <Button type="danger" disabled={selectedRowKeys.length <= 0} title="删除">
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={pagination}
                rowSelection={rowSelection}
                onChange={handleTableChange}
                scroll={{ x: true }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
});

export default User;
