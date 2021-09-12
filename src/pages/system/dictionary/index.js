import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, message, Popconfirm, Switch, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue } from '@/utils/utils';
import DictionaryForm from './components/DictionaryForm';

const Dictionary = connect(({ systemDictionary: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.effects['systemDictionary/fetch'],
}))(({ loading, list, pagination, dispatch }) => {
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 列表参数
  const [params, setParams] = useState({
    current: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
  });

  // 【查询字典列表】
  useEffect(() => {
    dispatch({
      type: 'systemDictionary/fetch',
      payload: {
        ...params,
      },
    });
    return () => {
      dispatch({
        type: 'systemDictionary/clearList',
      });
    };
  }, [params, dispatch]);

  // 【启用禁用字典】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemDictionary/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【批量删除字典】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemDictionary/deleteBatch',
      payload: {
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
    const { id } = record;
    dispatch({
      type: 'systemDictionary/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除字典成功。');
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

  // 【分页、过滤字典】
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
        placeholder="请输入字典名称或者手机号码。"
        enterButton
        size="large"
        style={{ maxWidth: 522, width: '100%' }}
      />
    </div>
  );

  const handleItem = (record) => {
    const { id, name } = record;
    history.push({
      pathname: '/system/dictionaries/item',
      query: {
        id,
        name,
      },
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" onClick={() => handleItem(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '字典编码',
      dataIndex: 'code',
    },
    {
      title: '字典状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
      ],
      filterMultiple: false,
      width: 110,
      render: (text, record) => (
        <Authorized authority="system:dictionary:status" noMatch={NoMatch(text)}>
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
          <Authorized authority="system:dictionary:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <DictionaryForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
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
    <PageContainer title={false} content={mainSearch}>
      <Card bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
        <div className="tableList">
          <div className="tableListOperator">
            <Authorized authority="system:dictionary:add" noMatch={null}>
              <RenderPropsModal>
                {({ showModalHandler, Modal }) => (
                  <>
                    <Button type="primary" title="新增" onClick={showModalHandler}>
                      <PlusOutlined />
                    </Button>
                    <Modal title="新增">
                      <DictionaryForm />
                    </Modal>
                  </>
                )}
              </RenderPropsModal>
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

export default Dictionary;
