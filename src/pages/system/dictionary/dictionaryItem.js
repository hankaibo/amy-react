import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, message, Popconfirm, Switch, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DeleteOutlined, EditOutlined, PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue } from '@/utils/utils';
import DictionaryItemForm from './components/DictionaryItemForm';

const DictionaryItem = connect(({ systemDictionaryItem: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.effects['systemDictionaryItem/fetch'],
}))(({ loading, list, pagination, dispatch }) => {
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
    dictionaryId: history.location.query.id,
  });

  // 【查询字典项列表】
  useEffect(() => {
    dispatch({
      type: 'systemDictionaryItem/fetch',
      payload: {
        ...params,
      },
    });
    return () => {
      dispatch({
        type: 'systemDictionaryItem/clearList',
      });
    };
  }, [params, dispatch]);

  // 【启用禁用字典项】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemDictionaryItem/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【批量删除字典项】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemDictionaryItem/deleteBatch',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('批量删除字典项成功。');
      },
    });
  };

  // 【删除字典项】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemDictionaryItem/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除字典项成功。');
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

  // 【分页、过滤字典项】
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
        placeholder="请输入字典项名称或者手机号码。"
        enterButton
        size="large"
        style={{ maxWidth: 522, width: '100%' }}
      />
    </div>
  );

  // 【表格列】
  const columns = [
    {
      title: '字典项名称',
      dataIndex: 'name',
    },
    {
      title: '字典项值',
      dataIndex: 'value',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '字典项状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
      ],
      filterMultiple: false,
      width: 110,
      render: (text, record) => (
        <Authorized authority="system:dictionaryItem:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={(checked) => toggleStatus(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <>
          <Authorized authority="system:dictionaryItem:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <DictionaryItemForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:dictionaryItem:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该字典项吗？"
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
    <PageContainer title={false} content={mainSearch}>
      <Card bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
        <div className="tableList">
          <div className="tableListOperator">
            <Authorized authority="system:dictionaryItem:add" noMatch={null}>
              <RenderPropsModal>
                {({ showModalHandler, Modal }) => (
                  <>
                    <Button type="primary" title="新增" onClick={showModalHandler}>
                      <PlusOutlined />
                    </Button>
                    <Modal title="新增">
                      <DictionaryItemForm />
                    </Modal>
                  </>
                )}
              </RenderPropsModal>
            </Authorized>
            <Authorized authority="system:dictionaryItem:batchDelete" noMatch={null}>
              <Popconfirm
                title="您确定要删除这些字典项吗？"
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
            <Button type="primary" title="返回" style={{ float: 'right' }} onClick={() => history.goBack()}>
              <RollbackOutlined /> 返回上级
            </Button>
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
    </PageContainer>
  );
});

export default DictionaryItem;
