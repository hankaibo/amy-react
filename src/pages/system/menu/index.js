import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tree, Table, Switch, Button, Divider, Popconfirm, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue, isArray, isEmpty } from '@/utils/utils';
import MenuForm from './components/MenuForm';

const { DirectoryTree } = Tree;
const MENU_TYPE = 1;

const Menu = connect(({ systemMenu: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemMenu/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击选中的菜单】
  const [currentMenu, setCurrentMenu] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({
    type: MENU_TYPE, // 固定值，数据初始化后不可更改。
    id: 0,
    status: null,
  });
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【初始化后，加载左侧菜单树数据】
  useEffect(() => {
    dispatch({
      type: 'systemMenu/fetch',
      payload: {
        type: MENU_TYPE, // 在这里默认菜单类型为1，接口类型为2。
      },
    });
    return () => {
      dispatch({
        type: 'systemMenu/clearTree',
      });
    };
  }, [dispatch]);

  // 【初始化左侧菜单树后，并查询根的子菜单列表数据。】
  useEffect(() => {
    if (first && isArray(tree) && !isEmpty(tree)) {
      setParams({ ...params, id: tree[0].id });
      setCurrentMenu({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree, params]);

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

  // 【选择菜单并获取其子菜单数据】
  const handleSelect = (selectedKeys, { selectedNodes }) => {
    if (selectedKeys.length === 1) {
      const id = parseInt(selectedKeys[0], 10);
      setCurrentMenu(selectedNodes[0]);
      setParams({ ...params, id });
    }
  };

  // 【启用禁用菜单】
  const toggleState = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemMenu/enable',
      payload: {
        id,
        status: checked,
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
        sourceId: record.id,
        targetId,
      },
      callback: () => {
        message.success('移动菜单成功。');
      },
    });
  };

  // 【删除菜单】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemMenu/delete',
      payload: {
        id,
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

    setParams({
      ...params,
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
        <Authorized authority="system:menu:move" noMatch={null}>
          <ArrowUpOutlined className="icon" title="向上" onClick={() => handleMove(record, index - 1)} />
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
      width: 90,
      fixed: 'right',
      render: (text, record) => (
        <>
          <Authorized authority="system:menu:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <MenuForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
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
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card title="菜单树" bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
            {isArray(tree) && tree.length > 0 && (
              <DirectoryTree
                expandAction="doubleClick"
                // 默认选中和展开第一项
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
            <div className="tableList">
              <div className="tableListOperator">
                <Authorized authority="system:menu:add" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button type="primary" title="新增" onClick={showModalHandler}>
                          <PlusOutlined />
                        </Button>
                        <Modal title="新增">
                          <MenuForm id={currentMenu && currentMenu.id} />
                        </Modal>
                      </>
                    )}
                  </RenderPropsModal>
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
    </PageContainer>
  );
});

export default Menu;
