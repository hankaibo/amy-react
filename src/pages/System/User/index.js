import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Tree,
  Card,
  Button,
  Input,
  Popconfirm,
  Switch,
  Divider,
  Modal,
  message,
  Icon,
  Table,
} from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import IconFont from '@/components/IconFont';
import { getValue } from '@/utils/utils';
import UserForm from './components/UserForm';
import UserRoleForm from './components/UserRoleForm';
import UserPasswordForm from './components/UserPasswordForm';
import styles from '../System.less';

const sexText = {
  1: '男',
  2: '女',
  3: '保密',
  4: '中性',
};

const User = connect(({ systemUser: { tree, list, pagination }, loading }) => ({
  tree,
  list,
  pagination,
  loading: loading.models.systemUser,
}))(({ loading, tree, list, pagination, dispatch }) => {
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [department, setDepartment] = useState(null);

  // 【首次请求加载部门树与用户列表数据】
  useEffect(() => {
    // 用户页面默认只查询可用状态的部门。
    dispatch({
      type: 'systemUser/fetchTree',
      payload: {
        status: 1,
      },
    });
    return () => {
      dispatch({
        type: 'systemUser/clearTree',
      });
      dispatch({
        type: 'systemUser/clearList',
      });
    };
  }, [dispatch]);

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
        setSelectedRowKeys([]);
      },
    });
  };

  // 【启用禁用用户】
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
    message.info('演示环境，暂未开放。');
  };

  // 【批量删除】
  const deleteBatchItem = () => {
    if (selectedRowKeys.length === 0) return;
    const { id: departmentId } = department;
    dispatch({
      type: 'systemUser/deleteBatch',
      payload: {
        ids: selectedRowKeys,
        departmentId,
      },
      callback: () => {
        setSelectedRowKeys([]);
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
        setSelectedRowKeys([]);
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
        { text: '男', value: 1 },
        { text: '女', value: 2 },
        { text: '保密', value: 3 },
        { text: '中性', value: 4 },
      ],
      filterMultiple: false,
      render: text => sexText[text],
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:user:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={checked => toggleStatus(checked, record)} />
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
      render: (text, record) => (
        <>
          {/* Note: system:user:xxx为【资源保护】菜单中用户管理修改接口(system:user:update)的编码名称。必须两者一致才能动态隐藏显示按钮。 */}
          <Authorized authority="system:user:update" noMatch={null}>
            <UserForm isEdit user={record}>
              <IconFont type="icon-edit" title="编辑" className="icon" />
            </UserForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该用户吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <IconFont type="icon-delete" title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:grant" noMatch={null}>
            <UserRoleForm user={record}>
              <IconFont type="icon-role" title="分配角色" className="icon" />
            </UserRoleForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:password:reset" noMatch={null}>
            <UserPasswordForm user={record}>
              <IconFont type="icon-reset" title="重置密码" className="icon" />
            </UserPasswordForm>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false} content={mainSearch}>
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
              switcherIcon={<Icon type="down" />}
              onSelect={handleSelect}
              treeData={tree}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={department ? `【${department.title}】的用户` : '用户列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:user:add" noMatch={null}>
                  <UserForm user={department ? { departmentId: department.id } : null}>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
                    </Button>
                  </UserForm>
                </Authorized>
                <Authorized authority="system:user:batchDelete" noMatch={null}>
                  <Popconfirm
                    title="您确定要删除该列表吗？"
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                    disabled={selectedRowKeys.length <= 0}
                  >
                    <Button type="danger" disabled={selectedRowKeys.length <= 0} title="删除">
                      <IconFont type="icon-delete" />
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
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(User, areEqual);
