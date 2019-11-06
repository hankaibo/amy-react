import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Switch, Divider, Modal, message, Icon, Tree, Table } from 'antd';
import { isEqual } from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import { getValue } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import Ellipsis from '@/components/Ellipsis';
import RoleForm from './components/RoleForm';
import RoleResourceForm from './components/RoleResourceForm';
import styles from '../System.less';

const Role = connect(({ systemRole: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.systemRole,
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的角色】
  const [role, setRole] = useState(null);

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetch',
    });
    return () => {
      dispatch({
        type: 'systemRole/clearTree',
      });
      dispatch({
        type: 'systemRole/clearList',
      });
    };
  }, [dispatch]);

  // 【获取子角色数据】
  const handleSelect = (selectedKeys, info) => {
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'systemRole/fetchChildrenById',
      payload: {
        id,
      },
      callback: () => {
        setRole(info.node.props);
      },
    });
  };

  // 【启用禁用】
  const toggleStatus = (checked, record) => {
    dispatch({
      type: 'systemRole/enable',
      payload: {
        ...record,
        status: checked,
      },
    });
  };

  // 【删除】
  const deleteItem = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemRole/delete',
      payload: {
        id,
        parentId,
      },
      callback: () => {
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

  // 【过滤】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = role;

    const params = {
      id,
      ...filters,
    };

    dispatch({
      type: 'systemRole/fetchChildrenById',
      payload: params,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '角色名称',
      render: (text, record) => {
        return record.name || record.title;
      },
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
            <Switch checked={!!text} onClick={checked => toggleStatus(checked, record)} />
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
    <PageHeaderWrapper>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="角色树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Tree
              showLine
              switcherIcon={<Icon type="down" />}
              onSelect={handleSelect}
              treeData={tree}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={role ? `【${role.title}】的角色` : '角色列表'}
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system.role.add" noMatch={null}>
                  <RoleForm>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
                    </Button>
                  </RoleForm>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                childrenColumnName="child"
                loading={loading}
                columns={columns}
                dataSource={list.length === 0 && role === null ? tree : list}
                pagination={false}
                onChange={handleTableChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default memo(Role, areEqual);
