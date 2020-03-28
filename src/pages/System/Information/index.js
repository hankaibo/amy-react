import React, { useState, useEffect, memo } from 'react';
import { connect } from 'umi';
import { Card, Button, Input, Tag, Divider, message, Table, Popconfirm } from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Authorized from '@/utils/Authorized';
import { getValue } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import InformationForm from './components/InformationForm';
import styles from '../System.less';

const getText = (value) => {
  switch (value) {
    case 1:
      return <Tag color="#2db7f5">通知</Tag>;
    case 2:
      return <Tag color="#87d068">消息</Tag>;
    case 3:
      return <Tag color="#108ee9">事件</Tag>;
    default:
      return '--';
  }
};

const Information = connect(({ systemInformation: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.effects['systemInformation/fetch'],
}))(({ loading, list, pagination, dispatch }) => {
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
  });

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemInformation/fetch',
      payload: params,
    });
    return () => {
      dispatch({
        type: 'systemInformation/clearList',
      });
    };
  }, [dispatch]);

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('演示环境，暂未开放。');
  };

  // 【批量删除】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemInformation/deleteBatch',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('批量删除信息成功。');
      },
    });
  };

  // 【删除】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemInformation/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除信息成功。');
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

  // 【分页、过滤】
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
        placeholder="请输入信息标题"
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
      title: '信息标题',
      dataIndex: 'title',
    },
    {
      title: '信息描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '信息类型',
      dataIndex: 'type',
      filters: [
        { text: '通知', value: 1 },
        { text: '消息', value: 2 },
        { text: '事件', value: 3 },
      ],
      filterMultiple: false,
      render: (text) => getText(text),
    },
    {
      title: '信息范围',
      dataIndex: 'type',
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system:information:update" noMatch={null}>
            <InformationForm isEdit id={record.id}>
              <EditOutlined title="编辑" className="icon" />
            </InformationForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:information:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该信息吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:information:publish" noMatch={null}>
            <IconFont
              type="icon-publish"
              title="发布"
              className="icon"
              onClick={() => handleDelete(record)}
            />
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
            <Authorized authority="system:user:add" noMatch={null}>
              <InformationForm>
                <Button type="primary" title="新增">
                  <PlusOutlined />
                </Button>
              </InformationForm>
            </Authorized>
            <Authorized authority="system:information:batchDelete" noMatch={null}>
              <Popconfirm
                title="您确定要删除这些信息吗？"
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
          />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Information, areEqual);
