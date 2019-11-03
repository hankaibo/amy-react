import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import { isEqual } from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import { getValue } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import Ellipsis from '@/components/Ellipsis';
import RoleForm from './components/RoleForm';
import RoleResourceForm from './components/RoleResourceForm';
import styles from '../System.less';

const Role = connect(({ systemRole: { list, pagination }, loading }) => ({
  list,
  pagination,
  loading: loading.models.systemRole,
}))(({ loading, list, pagination, dispatch }) => {
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetch',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
    return () => {
      dispatch({
        type: 'systemRole/clearList',
      });
    };
  }, [dispatch]);

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
    message.info('演示环境，暂未开放。');
  };

  // 【批量删除】
  const deleteBatchItem = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'systemRole/deleteBatch',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
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
  const deleteItem = record => {
    const { id } = record;
    dispatch({
      type: 'systemRole/delete',
      payload: {
        id,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
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
  const handleRowSelectChange = rowKeys => {
    setSelectedRowKeys(rowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectChange,
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
      filterMultiple: false,
      render: (text, record) => {
        return (
          <Authorized authority="system.role.status" noMatch="--">
            <Switch checked={text} onClick={checked => toggleStatus(checked, record)} />
          </Authorized>
        );
      },
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      render: text => {
        return (
          <Ellipsis tooltip={text} length={20}>
            {text}
          </Ellipsis>
        );
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
          <Authorized authority="system.role.grant" noMatch={null}>
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
                disabled={selectedRowKeys.length <= 0}
                title="删除"
                onClick={handleBatchDelete}
              >
                <IconFont type="icon-delete" />
              </Button>
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

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default memo(Role, areEqual);
