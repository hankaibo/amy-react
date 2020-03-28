import React, { useState, useEffect, memo } from 'react';
import { connect } from 'umi';
import { Row, Col, Card, Tree, Button, Switch, Divider, Table, Popconfirm, message } from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import { getValue } from '@/utils/utils';
import MenuForm from './components/MenuForm';
import styles from '../System.less';

const { DirectoryTree } = Tree;

const Menu = connect(({ systemMenu: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemMenu/fetch'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的菜单】
  const [currentMenu, setCurrentMenu] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({});
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemMenu/fetch',
    });
    return () => {
      dispatch({
        type: 'systemMenu/clearTree',
      });
    };
  }, [dispatch]);

  // 【查询菜单列表】
  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch({
        type: 'systemMenu/fetchChildrenById',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemMenu/clearList',
      });
    };
  }, [params, dispatch]);

  // 【默认选中、展开、子菜单数据、当前角色】
  useEffect(() => {
    if (first && Array.isArray(tree) && tree.length) {
      setParams({ ...params, id: tree[0].id });
      setCurrentMenu({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree]);

  // 【选择菜单并获取其子菜单数据】
  const handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setParams({ ...params, id });
      setCurrentMenu(info.node.props);
    }
  };

  // 【启用禁用菜单】
  const toggleState = (checked, record) => {
    const { id } = record;
    const { id: menuId } = currentMenu;
    dispatch({
      type: 'systemMenu/update',
      payload: {
        id,
        status: checked,
        menuId,
      },
    });
  };

  // 【移动菜单】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemMenu/move',
      payload: {
        ...record,
        sourceId: record.id,
        targetId,
      },
    });
  };

  // 【删除菜单】
  const handleDelete = (record) => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemMenu/delete',
      payload: {
        id,
        parentId,
      },
      callback: () => {
        message.success('删除菜单成功。');
      },
    });
  };

  // 【过滤菜单】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = currentMenu;

    setParams({
      ...params,
      id,
      ...filters,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
    },
    {
      title: '菜单状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:menu:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={(checked) => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:menu:move" noMatch="--">
          <ArrowUpOutlined
            className="icon"
            title="向上"
            onClick={() => handleMove(record, index - 1)}
          />
          <Divider type="vertical" />
          <ArrowDownOutlined
            className="icon"
            type="arrow-downy"
            title="向下"
            onClick={() => handleMove(record, index + 1)}
          />
        </Authorized>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system:menu:update" noMatch={null}>
            <MenuForm isEdit id={record.id}>
              <EditOutlined title="编辑" className="icon" />
            </MenuForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:menu:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该菜单吗？"
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
    <PageHeaderWrapper title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="菜单树"
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            {Array.isArray(tree) && tree.length > 0 && (
              <DirectoryTree
                defaultExpandedKeys={[tree[0].key]}
                defaultSelectedKeys={[tree[0].key]}
                treeData={tree}
                onSelect={handleSelect}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={currentMenu && `【${currentMenu.title}】的子菜单`}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:menu:add" noMatch={null}>
                  <MenuForm id={currentMenu && currentMenu.id.toString()}>
                    <Button type="primary" title="新增">
                      <PlusOutlined />
                    </Button>
                  </MenuForm>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                loading={loading}
                columns={columns}
                dataSource={list}
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

export default memo(Menu, areEqual);
