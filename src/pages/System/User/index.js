import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tree,
  Table,
  Button,
  Input,
  Switch,
  Popconfirm,
  Divider,
  message,
} from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
};

const User = connect(({ systemUser: { tree, list, pagination }, loading }) => ({
  tree,
  list,
  pagination,
  loading: loading.effects['systemUser/fetch'],
}))(({ loading, tree, list, pagination, dispatch }) => {
  // 【当前点击的部门】
  const [department, setDepartment] = useState(null);
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
  });
  //
  const [first, setFirst] = useState(true);

  // 【首次请求加载部门树】
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
    };
  }, [dispatch]);

  // 【查询列表】
  useEffect(() => {
    const { departmentId } = params;
    if (departmentId) {
      dispatch({
        type: 'systemUser/fetch',
        payload: {
          ...params,
          departmentId,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemUser/clearList',
      });
    };
  }, [params, dispatch]);

  // 【默认选中、展开、子部门数据、当前部门】
  useEffect(() => {
    if (first && Array.isArray(tree) && tree.length) {
      setParams({ ...params, departmentId: tree[0].id });
      setDepartment({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree]);

  // 【选择部门并获取其用户数据】
  const handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setParams({ ...params, departmentId: id });
      setDepartment(info.node.props);
      setSelectedRowKeys([]);
    }
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

  // 【批量删除用户】
  const handleBatchDelete = () => {
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
        message.success('批量删除用户成功。');
      },
    });
  };

  // 【删除】
  const handleDelete = record => {
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
        message.success('删除用户成功。');
      },
    });
  };

  // 【复选框相关操作】
  const rowSelection = {
    selectedRowKeys,
    onChange: keys => {
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

    const { id: departmentId } = department;
    const { current, pageSize } = page;
    setParams({
      ...params,
      ...filters,
      departmentId,
      current,
      pageSize,
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
    // TODO 考虑获取字典数据
    {
      title: '性别',
      dataIndex: 'sex',
      filters: [
        { text: '男', value: 1 },
        { text: '女', value: 2 },
        { text: '保密', value: 3 },
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
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <>
          {/* Note: system:user:xxx为【资源保护】菜单中用户管理修改接口(system:user:update)的编码名称。必须两者一致才能动态隐藏显示按钮。 */}
          <Authorized authority="system:user:update" noMatch={null}>
            <UserForm isEdit id={record.id}>
              <EditOutlined title="编辑" className="icon" />
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
              <DeleteOutlined title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:grant" noMatch={null}>
            <UserRoleForm userId={record.id}>
              <IconFont type="icon-role" title="分配角色" className="icon" />
            </UserRoleForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:user:password:reset" noMatch={null}>
            <UserPasswordForm userId={record.id} username={record.username}>
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
            title="组织"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            {Array.isArray(tree) && tree.length > 0 && (
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
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
            title={department && `【${department.title}】的用户`}
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:user:add" noMatch={null}>
                  <UserForm departmentId={department ? department.id.toString() : null}>
                    <Button type="primary" title="新增">
                      <PlusOutlined />
                    </Button>
                  </UserForm>
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
                scroll={{ x: 1500 }}
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
