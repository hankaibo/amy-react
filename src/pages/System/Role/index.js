import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import IconFont from '@/components/IconFont';
import RoleForm from './components/RoleForm';
import RoleResourceForm from './components/RoleResourceForm';
import styles from '../System.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const Role = props => {
  const { loading, list, pagination, dispatch } = props;

  // 【复选框状态属性与函数】
  const [selectedRows, setSelectedRows] = useState([]);

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
  }, []);

  // 【启用禁用】
  const toggleStatus = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemRole/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【搜索】
  const handleFormSubmit = () => {
    message.info('正在开发中');
  };

  // 【批量删除】
  const deleteBatchItem = () => {
    if (selectedRows.length === 0) return;
    dispatch({
      type: 'systemRole/deleteBatch',
      payload: {
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
      content: '您确定批量删除这些角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteBatchItem(),
    });
  };

  // 【删除】
  const deleteItem = id => {
    dispatch({
      type: 'systemRole/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRows([]);
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    const { id } = record;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(id),
    });
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
      type: 'systemRole/fetch',
      payload: params,
    });
  };

  // 【全页搜索框】
  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入角色名称"
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
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      filters: [{ text: '禁用', value: 0 }, { text: '启用', value: 1 }],
      render: (text, record) => {
        return <Switch checked={text} onClick={checked => toggleStatus(checked, record)} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system.role.update" noMatch={null}>
            <RoleForm isEdit role={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
            </RoleForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.role.delete" noMatch={null}>
            <a onClick={() => handleDelete(record)}>
              <IconFont type="icon-delete" title="删除" />
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.role.resource.grant" noMatch={null}>
            <RoleResourceForm role={record}>
              <a>
                <IconFont type="icon-permission" title="分配资源" />
              </a>
            </RoleResourceForm>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content={mainSearch}>
      <Card style={{ marginTop: 10 }} bordered={false} bodyStyle={{ padding: '15px' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Authorized authority="system.role.add" noMatch={null}>
              <RoleForm>
                <Button type="primary" title="新增">
                  <Icon type="plus" />
                </Button>
              </RoleForm>
            </Authorized>
            <Authorized authority="system.role.batchDelete" noMatch={null}>
              <Button
                type="danger"
                disabled={selectedRows.length <= 0}
                title="删除"
                onClick={handleBatchDelete}
              >
                <IconFont type="icon-delete" />
              </Button>
            </Authorized>
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

export default connect(({ systemRole: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.models.systemRole,
}))(Role);
