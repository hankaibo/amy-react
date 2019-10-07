import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import IconFont from '@/components/IconFont';
import MenuForm from './components/MenuForm';
import styles from '../System.less';

const Menu = props => {
  const { loading, tree, list, dispatch } = props;

  // 【当前点击的菜单】
  const [menu, setMenu] = useState(null);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemMenu/fetch',
    });
    return function cleanup() {
      dispatch({
        type: 'systemMenu/clearTree',
      });
      dispatch({
        type: 'systemMenu/clearList',
      });
    };
  }, []);

  // 【启用禁用】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemMenu/update',
      payload: { ...record, status: checked },
    });
  };

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

  // 【移动】
  const handleMove = (record, direction) => {
    dispatch({
      type: 'systemMenu/move',
      payload: {
        ...record,
        direction,
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
        return <Switch checked={text} onClick={checked => toggleState(checked, record)} />;
      },
    },
    {
      title: '排序',
      render: (text, record) => (
        <>
          <a
            onClick={() => handleMove(record, 'UP')}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => handleMove(record, 'DOWN')}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </>
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
              <Divider type="vertical" />
            </MenuForm>
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
            <Tree treeData={tree} onSelect={handleSelect} />
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
              <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(({ systemMenu: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.systemMenu,
}))(Menu);
