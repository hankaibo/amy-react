import React, { useState, useEffect, memo } from 'react';
import { Row, Col, Card, Tree, Table, Switch, Button, Divider, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import { isArray, isEmpty, isEqual } from 'lodash';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import { getValue } from '@/utils/utils';
import ApiForm from './components/ApiForm';
import UploadForm from './components/Upload';
import styles from '../System.less';

const { DirectoryTree } = Tree;
const API_TYPE = 2;

const Api = connect(({ systemApi: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemApi/fetch'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击选中的菜单】
  const [currentMenu, setCurrentMenu] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({
    type: API_TYPE, // 固定值，数据初始化后不可更改。
    id: 0,
    status: null,
  });
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【初始化后，加载左侧菜单树数据】
  useEffect(() => {
    dispatch({
      type: 'systemApi/fetch',
      payload: {
        type: 1, // 在这里默认菜单类型为1，接口类型为2。
      },
    });
    return () => {
      dispatch({
        type: 'systemApi/clearTree',
      });
    };
  }, [dispatch]);

  // 【初始化左侧菜单树后，并查询根的接口列表数据。】
  useEffect(() => {
    if (first && isArray(tree) && !isEmpty(tree)) {
      setParams({ ...params, id: tree[0].id });
      setCurrentMenu({ ...tree[0] });
      setFirst(false);
    }
  }, [first, tree]);

  // 【查询菜单列表】
  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch({
        type: 'systemApi/fetchChildrenById',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemApi/clearList',
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

  // 【启用禁用按钮】
  const toggleState = (checked, record) => {
    const { id } = record;
    const { id: parentId } = currentMenu;
    dispatch({
      type: 'systemApi/enable',
      payload: {
        type: API_TYPE,
        id,
        status: checked,
        parentId,
      },
    });
  };

  // 【移动按钮】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemApi/move',
      payload: {
        ...record,
        sourceId: record.id,
        targetId,
      },
      callback: () => {
        message.success('移动接口成功。');
      },
    });
  };

  // 【删除接口】
  const handleDelete = (record) => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemApi/delete',
      payload: {
        id,
        parentId,
        type: API_TYPE,
      },
      callback: () => {
        message.success('删除接口成功。');
      },
    });
  };

  // 【过滤按钮】
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
      title: '接口名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '接口url',
      dataIndex: 'uri',
    },
    {
      title: '接口编码',
      dataIndex: 'code',
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      width: 120,
      render: (text, record) => (
        <Authorized authority="system:api:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={(checked) => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      width: 90,
      render: (text, record, index) => (
        <Authorized authority="system:api:move" noMatch={null}>
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
      width: 90,
      align: 'center',
      render: (text, record) => (
        <>
          <Authorized authority="system:api:update" noMatch={null}>
            <ApiForm isEdit id={record.id}>
              <EditOutlined title="编辑" className="icon" />
            </ApiForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:api:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该接口吗？"
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
            {isArray(tree) && tree.length > 0 && (
              <DirectoryTree
                expandAction="doubleClick"
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
            title={currentMenu && `[${currentMenu.title}]的接口`}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:api:add" noMatch={null}>
                  <ApiForm id={currentMenu && currentMenu.id}>
                    <Button type="primary" title="新增">
                      <PlusOutlined />
                    </Button>
                  </ApiForm>
                </Authorized>
                <Authorized authority="system:api:import" noMatch={null}>
                  <UploadForm>
                    <Button title="导入">
                      <ImportOutlined />
                    </Button>
                  </UploadForm>
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

export default memo(Api, areEqual);
