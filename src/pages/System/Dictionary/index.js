import React, { useState, useEffect, memo } from 'react';
import { Card, Button, Input, Divider, message, Switch, Table, Popconfirm } from 'antd';
import { isEqual, isEmpty } from 'lodash';
import { Link, history, connect } from 'umi';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { RollbackOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Authorized from '@/utils/Authorized';
import { getValue } from '@/utils/utils';
import DictionaryForm from './components/DictionaryForm';
import styles from '../System.less';

const Dictionary = connect(({ systemDictionary: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.effects['systemDictionary/fetch'],
}))(({ loading, list, pagination, dispatch, match, location }) => {
  const {
    params: { id: parentDictId },
  } = match;

  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
    parentId: parentDictId,
  });

  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemDictionary/fetch',
      payload: params,
    });
    return () => {
      dispatch({
        type: 'systemDictionary/clearList',
      });
    };
  }, [parentDictId, dispatch]);

  // 【开启禁用字典状态】
  const toggleState = (checked, record) => {
    // 传递parentId方便刷新
    const { id, parentId } = record;
    dispatch({
      type: 'systemDictionary/enable',
      payload: {
        id,
        status: checked,
        parentId,
      },
    });
  };

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('演示环境，暂未开放。');
  };

  // 【批量删除】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemDictionary/deleteBatch',
      payload: {
        parentId: parentDictId,
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('批量删除字典成功。');
      },
    });
  };

  // 【删除字典】
  const handleDelete = (record) => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemDictionary/delete',
      payload: {
        id,
        parentId,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除字典成功。');
      },
    });
  };

  // 【返回】
  const handleBack = () => {
    history.goBack();
  };

  // 【复选框相关操作】
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys) => {
      setSelectedRowKeys(rowKeys);
    },
  };

  // 【分页、过滤】
  const handleTableChange = (page, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { current, pageSize } = page;
    setParams({
      current,
      pageSize,
      ...filters,
    });
  };

  // 【全页搜索框】
  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入查询条件。"
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
      title: '字典类型',
      dataIndex: 'name',
      render: (text, record) =>
        // 非子节点可以跳转
        !record.parentId ? (
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
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:dictionary:status" noMatch="--">
          <Switch checked={text} onClick={(checked) => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system:dictionary:update" noMatch={null}>
            <DictionaryForm isEdit id={record.id} match={match} location={location}>
              <EditOutlined title="编辑" className="icon" />
            </DictionaryForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:dictionary:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该字典吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined title="删除" className="icon" />
            </Popconfirm>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false} content={mainSearch}>
      <Card style={{ marginTop: 10 }} bordered={false} bodyStyle={{ padding: '15px' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Authorized authority="system:dictionary:add" noMatch={null}>
              <DictionaryForm match={match} location={location}>
                <Button type="primary" title="新增">
                  <PlusOutlined />
                </Button>
              </DictionaryForm>
            </Authorized>
            <Authorized authority="system:dictionary:batchDelete" noMatch={null}>
              <Popconfirm
                title="您确定要删除这些字典吗？"
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
            {!isEmpty(parentDictId) && (
              <Button title="返回" onClick={handleBack}>
                <RollbackOutlined />
              </Button>
            )}
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
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Dictionary, areEqual);
