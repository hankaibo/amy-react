import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import IconFont from '@/components/IconFont';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserForm from './UserForm';
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
  state = {
    current: 1,
    pageSize: 10,
    selectedRows: [],
    visible: false,
  };

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
      dataIndex: 'state',
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
        return (
          <Switch checked={Boolean(text)} onClick={checked => this.toggleState(checked, record)} />
        );
      },
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.openModal(record.id)}>
            <IconFont type="icon-edit" title="编辑" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record.id)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.openModal(record)}>
            <Icon type="play-circle" title="分配角色" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.openModal(record)}>
            <IconFont type="icon-daochu" title="分配部门" />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, current } = this.state;
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageSize,
        current,
      },
    });
  }

  openModal = id => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'systemUser/fetchById',
        id,
        callback: () => {
          this.setState({
            visible: true,
          });
        },
      });
    }
    this.setState({
      visible: true,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/clearSelected',
    });
    this.setState({
      visible: false,
    });
  };

  toggleState = (checked, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/update',
      payload: { ...record, state: checked ? 1 : 0 },
    });
  };

  // 【搜索】
  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
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
      ids: selectedRows,
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'systemUser/fetch',
          payload: {},
        });
      },
    });
  };

  // 【删除】
  handleDelete = id => {
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
      id,
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'systemUser/fetch',
          payload: {},
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
    this.setState({
      current,
      pageSize,
    });

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
    const { selectedRows, visible } = this.state;

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
              <Button type="primary" title="新增" onClick={() => this.openModal()}>
                <Icon type="plus" />
              </Button>
              <Button
                type="danger"
                disabled={selectedRows.length <= 0}
                title="删除"
                onClick={this.handleBatchDelete}
              >
                <IconFont type="icon-delete" />
              </Button>
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
        <UserForm {...this.props} visible={visible} handleCancel={this.closeModal} />
      </PageHeaderWrapper>
    );
  }
}

export default User;
