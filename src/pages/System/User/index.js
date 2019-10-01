import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Tree,
  Card,
  Button,
  Input,
  Switch,
  Divider,
  Modal,
  message,
  Icon,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import IconFont from '@/components/IconFont';
import UserForm from './components/UserForm';
import UserRoleForm from './components/UserRoleForm';
import styles from '../System.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const User = props => {
  const { loading, tree, list, pagination, dispatch } = props;

  // 【复选框状态属性与函数】
  const [selectedRows, setSelectedRows] = useState([]);
  const [department, setDepartment] = useState(null);

  // 【首次请求加载部门树与用户列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemUser/fetchTree',
    });
  }, []);

  // 【获取部门用户数据】
  const handleSelect = (selectedKeys, info) => {
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys[0];
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        departmentId: id,
        current: 1,
        pageSize: 10,
      },
      callback: () => {
        setDepartment(info.node.props);
      },
    });
  };
  // 【启用禁用】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    const { id: departmentId } = department;
    dispatch({
      type: 'systemUser/enable',
      payload: {
        id,
        status: checked,
        departmentId,
      },
    });
  };

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('正在开发中');
  };

  // 【批量删除】
  const deleteBatchItem = () => {
    if (selectedRows.length === 0) return;
    const { id: departmentId } = department;
    dispatch({
      type: 'systemUser/deleteBatch',
      payload: {
        ids: selectedRows,
        departmentId,
      },
      callback: () => {
        setSelectedRows([]);
      },
    });
  };
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除',
      content: '您确定批量删除这些用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteBatchItem(),
    });
  };

  // 【删除】
  const deleteItem = record => {
    const { id } = record;
    const { id: departmentId } = department;
    dispatch({
      type: 'systemUser/delete',
      payload: {
        id,
        departmentId,
      },
      callback: () => {
        setSelectedRows([]);
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
    });
  };

  // 【分页、过滤】
  const handleTableChange = (page, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id: departmentId } = department;
    const { current, pageSize } = page;

    const params = {
      departmentId,
      current,
      pageSize,
      ...filters,
    };

    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  // 【全页搜索框】
  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入用户名称或者手机号码"
        enterButton
        size="large"
        onSearch={handleFormSubmit}
        style={{ maxWidth: 522, width: '100%' }}
      />
    </div>
  );

  // 【复选框相关操作】
  const rowSelection = {
    selectedRows,
    onChange: setSelectedRows,
  };

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
    // TODO 考虑获取字典数据
    {
      title: '性别',
      dataIndex: 'sex',
      filters: [
        { text: '男', value: '1' },
        { text: '女', value: '2' },
        { text: '保密', value: '3' },
        { text: '中性', value: '4' },
      ],
      filterMultiple: false,
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      filters: [{ text: '禁用', value: 0 }, { text: '启用', value: 1 }],
      filterMultiple: false,
      render: (text, record) => {
        return <Switch checked={text} onClick={checked => toggleStatus(checked, record)} />;
      },
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
      render: (text, record) => (
        <>
          {/* Note: system.user.xxx为【资源保护】菜单中用户管理修改接口(system.user.update)的编码名称。必须两者一致才能动态隐藏显示按钮。 */}
          <Authorized authority="system.user.update" noMatch={null}>
            <UserForm isEdit user={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
            </UserForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.user.delete" noMatch={null}>
            <a onClick={() => handleDelete(record)}>
              <IconFont type="icon-delete" title="删除" />
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.user.role.grant" noMatch={null}>
            <UserRoleForm user={record}>
              <a>
                <IconFont type="icon-role" title="分配角色" />
              </a>
            </UserRoleForm>
            <Divider type="vertical" />
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content={mainSearch}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="部门树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Tree
              showLine
              switcherIcon={<IconFont type="icon-department" />}
              onSelect={handleSelect}
              treeData={tree}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={department ? `【${department.title}】的用户` : '用户列表'}
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system.user.add" noMatch={null}>
                  <UserForm user={department ? { departmentId: department.id } : null}>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
                    </Button>
                  </UserForm>
                </Authorized>
                <Authorized authority="system.user.batchDelete" noMatch={null}>
                  <Button
                    type="danger"
                    disabled={selectedRows.length <= 0}
                    title="删除"
                    onClick={handleBatchDelete}
                  >
                    <IconFont type="icon-delete" />
                  </Button>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={pagination}
                rowSelection={rowSelection}
                onChange={handleTableChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(({ systemUser: { tree, list, pagination }, loading }) => ({
  tree,
  list,
  pagination,
  loading: loading.models.systemUser,
}))(User);
