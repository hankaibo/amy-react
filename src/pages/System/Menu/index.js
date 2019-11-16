import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import { isEqual } from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import { getValue } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import MenuForm from './components/MenuForm';
import styles from '../System.less';

const { DirectoryTree } = Tree;

const Menu = connect(({ systemMenu: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.systemMenu,
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的菜单】
  const [menu, setMenu] = useState(null);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemMenu/fetch',
    });
    return () => {
      dispatch({
        type: 'systemMenu/clearTree',
      });
      dispatch({
        type: 'systemMenu/clearList',
      });
    };
  }, [dispatch]);

  // 【获取子菜单数据】
  const handleSelect = (selectedKeys, info) => {
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'systemMenu/fetchChildrenById',
      payload: {
        id,
      },
      callback: () => {
        setMenu(info.node.props);
      },
    });
  };

  // 【启用禁用菜单】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemMenu/update',
      payload: { ...record, status: checked },
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

  // 【删除】
  const deleteItem = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemMenu/delete',
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
      content: '您确定要删除该菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
    });
  };

  // 【过滤菜单】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = menu;

    const params = {
      id,
      ...filters,
    };

    dispatch({
      type: 'systemMenu/fetchChildrenById',
      payload: params,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
    },
    {
      title: '菜单状态',
      dataIndex: 'status',
      filters: [{ text: '禁用', value: 0 }, { text: '启用', value: 1 }],
      filterMultiple: false,
      render: (text, record) => {
        return (
          <Authorized authority="system.menu.status" noMatch={NoMatch(text)}>
            <Switch checked={text} onClick={checked => toggleState(checked, record)} />
          </Authorized>
        );
      },
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system.menu.move" noMatch="--">
          <a
            onClick={() => handleMove(record, index - 1)}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => handleMove(record, index + 1)}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </Authorized>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <Authorized authority="system.menu.update" noMatch={null}>
            <MenuForm isEdit menu={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
            </MenuForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system.menu.delete" noMatch={null}>
            <a onClick={() => handleDelete(record)}>
              <IconFont type="icon-delete" title="删除" />
            </a>
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
            title="菜单树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <DirectoryTree treeData={tree} onSelect={handleSelect} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={menu ? `[${menu.title}]的子菜单` : '菜单列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system.menu.add" noMatch={null}>
                  <MenuForm menu={menu}>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
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

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default memo(Menu, areEqual);
