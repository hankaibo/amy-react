import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import IconFont from '@/components/IconFont';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import UserForm from './components/UserForm';
import UserRoleForm from './components/UserRoleForm';
import styles from '../System.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const status = ['禁用', '启用'];

@connect(({ systemUser, loading }) => ({
  systemUser,
  loading: loading.models.systemUser,
}))
class User extends Component {
  columns = [
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render: (text, record) => {
        return <Switch checked={text} onClick={checked => this.toggleStatus(checked, record)} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system.user.update" noMatch={null}>
            <UserForm isEdit user={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
            </UserForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.user.delete" noMatch={null}>
            <a onClick={() => this.handleDelete(record)}>
              <IconFont type="icon-delete" title="删除" />
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.user.role.give" noMatch={null}>
            <UserRoleForm user={record}>
              <a>
                <IconFont type="icon-role" title="分配角色" />
              </a>
            </UserRoleForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized>
            <a onClick={() => message.info('正在开发中……')}>
              <IconFont type="icon-department" title="分配部门" />
            </a>
          </Authorized>
        </>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
  }

  toggleStatus = (checked, record) => {
    const { dispatch } = this.props;
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
  handleFormSubmit = () => {
    message.info('正在开发中');
  };

  // 【批量删除】
  handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除',
      content: '您确定批量删除这些用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteBatchItem(),
    });
  };

  deleteBatchItem = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'systemUser/deleteBatch',
      payload: {
        ids: selectedRows,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  // 【删除】
  handleDelete = record => {
    const { id } = record;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(id),
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/delete',
      payload: id,
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        message.success('删除成功');
      },
    });
  };

  // 【选择表格行】
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 【分页、排序、过滤】
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { current, pageSize } = pagination;

    const params = {
      current,
      pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  render() {
    const {
      systemUser: { list, pagination },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入用户名称或者手机号码"
          enterButton
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ maxWidth: 522, width: '100%' }}
        />
      </div>
    );

    const rowSelection = {
      selectedRows,
      onChange: this.handleSelectRows,
    };

    return (
      <PageHeaderWrapper content={mainSearch}>
        <Card style={{ marginTop: 10 }} bordered={false} bodyStyle={{ padding: '15px' }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Authorized authority="system.user.add" noMatch={null}>
                <UserForm>
                  <Button type="primary" title="新增" onClick={this.openModal}>
                    <Icon type="plus" />
                  </Button>
                </UserForm>
              </Authorized>
              <Authorized authority="system.user.batchDelete" noMatch={null}>
                <Button type="danger" disabled={selectedRows.length <= 0} title="删除" onClick={this.handleBatchDelete}>
                  <IconFont type="icon-delete" />
                </Button>
              </Authorized>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={list}
              pagination={pagination}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default User;
