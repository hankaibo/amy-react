import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { Form, Card, Button, Input, Divider, Modal, message, Icon, Switch, Table } from 'antd';
import IconFont from '@/components/IconFont';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DictionaryForm from './ModalForm';
import styles from '../System.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const status = ['禁用', '启用'];

@connect(({ systemDictionary, loading }) => ({
  systemDictionary,
  loading: loading.models.systemDictionary,
}))
@Form.create({})
class Dictionary extends Component {
  state = {
    current: 1,
    pageSize: 10,
    selectedRows: [],
    visible: false,
  };

  columns = [
    {
      title: '字典类型',
      dataIndex: 'name',
      render: (text, record) =>
        // 非子节点可以跳转
        record.parentId === -1 ? (
          <Link to={`/system/dictionaries/${record.id}?name=${text}`}>{text}</Link>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '字典编码',
      dataIndex: 'code',
    },
    {
      title: '字典描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
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
        return <Switch checked={text} onClick={checked => this.toggleState(checked, record)} />;
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      sorter: true,
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '修改人',
      dataIndex: 'modifyUser',
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
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { pageSize, current } = this.state;
    const {
      params: { id },
    } = match;

    dispatch({
      type: 'systemDictionary/fetch',
      payload: {
        parentId: id || -1,
        pageSize,
        current,
      },
    });
  }

  openModal = id => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'systemDictionary/fetchById',
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
      type: 'systemDictionary/clearSelected',
    });
    this.setState({
      visible: false,
    });
  };

  // 【开启禁用字典状态】
  toggleState = (checked, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemDictionary/update',
      payload: { ...record, state: checked },
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
      content: '您确定批量删除这些列表数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteBatchItem(),
    });
  };

  deleteBatchItem = () => {
    const { dispatch, match } = this.props;
    const { selectedRows } = this.state;
    const {
      params: { id: parentId },
    } = match;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'systemDictionary/deleteBatch',
      ids: selectedRows,
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'systemDictionary/fetch',
          payload: {
            parentId,
          },
        });
      },
    });
  };

  // 【删除】
  handleDelete = id => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该列表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(id),
    });
  };

  deleteItem = id => {
    const { dispatch, match } = this.props;
    const {
      params: { id: parentId },
    } = match;
    dispatch({
      type: 'systemDictionary/delete',
      id,
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'systemDictionary/fetch',
          payload: {
            parentId,
          },
        });
        message.success('删除成功');
      },
    });
  };

  // 【返回】
  handleBack = () => {
    router.goBack();
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
      type: 'systemDictionary/fetch',
      payload: params,
    });
  };

  render() {
    const {
      systemDictionary: { list, pagination },
      loading,
      match,
    } = this.props;
    const { selectedRows, visible } = this.state;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入查询条件"
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

    const { params: id } = match;

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
                onClick={() => this.handleBatchDelete()}
              >
                <IconFont type="icon-delete" />
              </Button>
              {Object.keys(id).length > 0 && (
                <Button title="返回" onClick={() => this.handleBack()}>
                  <Icon type="rollback" />
                </Button>
              )}
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
        <DictionaryForm {...this.props} visible={visible} handleCancel={this.closeModal} />
      </PageHeaderWrapper>
    );
  }
}

export default Dictionary;
