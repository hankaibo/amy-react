import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Button,
  Switch,
  Divider,
  Popconfirm,
  message,
  Icon,
  Tree,
  Table,
} from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
  loading: loading.effects['systemRole/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的角色】
  const [currentRole, setCurrentRole] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({});

  // 【首次请求加载列表数据】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetch',
    });
    return () => {
      dispatch({
        type: 'systemRole/clearTree',
      });
    };
  }, [dispatch]);

  // 【查询列表】
  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch({
        type: 'systemRole/fetchChildrenById',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemRole/clearList',
      });
    };
  }, [params, dispatch]);

  // 【获取子角色数据】
  const handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setParams({ ...params, id });
      setCurrentRole(info.node.props);
    }
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

  // 【移动】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemRole/move',
      payload: {
        ...record,
        sourceId: record.id,
        targetId,
      },
    });
  };

  // 【删除】
  const handleDelete = record => {
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

  // 【过滤】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = currentRole;

    setParams({
      ...params,
      id,
      ...filters,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '角色名称',
      render: (text, record) => record.name || record.title,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:role:status" noMatch="--">
          <Switch checked={!!text} onClick={checked => toggleStatus(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:role:move" noMatch="--">
          <Icon
            className="icon"
            type="arrow-up"
            title="向上"
            onClick={() => handleMove(record, index - 1)}
          />
          <Divider type="vertical" />
          <Icon
            className="icon"
            type="arrow-down"
            title="向下"
            onClick={() => handleMove(record, index + 1)}
          />
        </Authorized>
      ),
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      render: text => (
        <Ellipsis tooltip={text} length={20}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system:role:update" noMatch={null}>
            <RoleForm isEdit id={record.id}>
              <IconFont type="icon-edit" title="编辑" className="icon" />
            </RoleForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:role:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该角色吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <IconFont type="icon-delete" title="删除" className="icon" />
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:role:grant" noMatch={null}>
            <RoleResourceForm id={record.id}>
              <IconFont type="icon-permission" title="分配资源" className="icon" />
            </RoleResourceForm>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
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
            title={currentRole ? `【${currentRole.title}】的子角色` : '角色列表'}
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:role:add" noMatch={null}>
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
                dataSource={list.length === 0 && currentRole === null ? tree : list}
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

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Role, areEqual);
