import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Divider, Modal, message, Icon, Switch, Table } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import IconFont from '@/components/IconFont';
import DictionaryForm from './components/DictionaryForm';
import styles from '../System.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const Dictionary = props => {
  const { loading, list, pagination, dispatch, match, location } = props;
  const {
    params: { id: parentDictId },
  } = match;

  // 【复选框状态属性与函数】
  const [selectedRows, setSelectedRows] = useState([]);

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemDictionary/fetch',
      payload: {
        parentId: parentDictId || 0,
        current: 1,
        pageSize: 10,
      },
    });
  }, [parentDictId]);

  // 【开启禁用字典状态】
  const toggleState = (checked, record) => {
    // 传递parentId方便刷新
    const { id, parentId } = record;
    dispatch({
      type: 'systemDictionary/enable',
      payload: {
        id,
        parentId,
        status: checked,
      },
    });
  };

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('正在开发中……');
  };

  // 【批量删除】
  const deleteBatchItem = () => {
    if (selectedRows.length === 0) return;
    dispatch({
      type: 'systemDictionary/deleteBatch',
      payload: {
        parentId: parentDictId || 0,
        ids: selectedRows,
      },
      callback: () => {
        setSelectedRows([]);
      },
    });
  };
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除',
      content: '您确定批量删除这些列表数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteBatchItem(),
    });
  };

  // 【删除】
  const deleteItem = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemDictionary/delete',
      payload: {
        id,
        parentId,
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
      content: '您确定要删除该列表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
    });
  };

  // 【返回】
  const handleBack = () => {
    router.goBack();
  };

  // 【分页、过滤】
  const handleTableChange = (page, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { current, pageSize } = page;
    const params = {
      current,
      pageSize,
      ...filters,
    };

    dispatch({
      type: 'systemDictionary/fetch',
      payload: params,
    });
  };

  // 【全页搜索框】
  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入查询条件"
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
      title: '字典类型',
      dataIndex: 'name',
      render: (text, record) =>
        // 非子节点可以跳转
        record.parentId === 0 ? (
          <Link to={`/dashboard/system/dictionaries/${record.id}?name=${text}`}>{text}</Link>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '字典编码',
      dataIndex: 'code',
    },
    {
      title: '字典值',
      dataIndex: 'value',
    },
    {
      title: '字典描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [{ text: '禁用', value: 0 }, { text: '启用', value: 1 }],
      filterMultiple: false,
      render: (text, record) => {
        return <Switch checked={text} onClick={checked => toggleState(checked, record)} />;
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system.dictionary.update" noMatch={null}>
            <DictionaryForm isEdit dictionary={record} match={match} location={location}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
              <Divider type="vertical" />
            </DictionaryForm>
          </Authorized>
          <a onClick={() => handleDelete(record)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content={mainSearch}>
      <Card style={{ marginTop: 10 }} bordered={false} bodyStyle={{ padding: '15px' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <DictionaryForm match={match} location={location}>
              <Button type="primary" title="新增">
                <Icon type="plus" />
              </Button>
            </DictionaryForm>
            <Button
              type="danger"
              disabled={selectedRows.length <= 0}
              title="删除"
              onClick={handleBatchDelete}
            >
              <IconFont type="icon-delete" />
            </Button>
            {parentDictId && Object.keys(parentDictId).length > 0 && (
              <Button title="返回" onClick={handleBack}>
                <Icon type="rollback" />
              </Button>
            )}
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
    </PageHeaderWrapper>
  );
};

export default connect(({ systemDictionary: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.models.systemDictionary,
}))(Dictionary);
