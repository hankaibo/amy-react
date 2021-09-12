import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, message, Popconfirm, Row, Switch, Table, Tag, Tree } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import RenderPropsModal from '@/components/RenderModal';
import { getValue, isArray, isEmpty } from '@/utils/utils';
import ApiForm from './components/ApiForm';
import UploadForm from './components/UploadTable';

const { DirectoryTree } = Tree;

const Api = connect(({ systemApi: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemApi/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击选中的菜单】
  const [currentMenu, setCurrentMenu] = useState(null);
  // 【查询参数】
  const [params, setParams] = useState({
    type: 'API', // 固定值，数据初始化后不可更改。
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
        type: 'MENU',
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
  }, [first, tree, params]);

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
    dispatch({
      type: 'systemApi/enable',
      payload: {
        id,
        status: checked,
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
    const { id } = record;
    dispatch({
      type: 'systemApi/delete',
      payload: {
        id,
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

    setParams({
      ...params,
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
      ellipsis: true,
    },
    {
      title: '接口编码',
      dataIndex: 'code',
      ellipsis: true,
    },
    {
      title: '方法类型',
      dataIndex: 'method',
      render: (text) => {
        let tag;
        switch (text.toLowerCase()) {
          case 'get':
            tag = <Tag color="#61affe">{text}</Tag>;
            break;
          case 'post':
            tag = <Tag color="#49cc90">{text}</Tag>;
            break;
          case 'delete':
            tag = <Tag color="#f93e3e">{text}</Tag>;
            break;
          case 'put':
            tag = <Tag color="#fca130">{text}</Tag>;
            break;
          case 'patch':
            tag = <Tag color="#50e3c2">{text}</Tag>;
            break;
          default:
            tag = <Tag color="#61affe">{text}</Tag>;
        }
        return tag;
      },
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
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
          <Authorized authority="system:api:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <ApiForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
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
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card title="菜单树" bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
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
            title={currentMenu && `【${currentMenu.title}】的接口`}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className="tableList">
              <div className="tableListOperator">
                <Authorized authority="system:api:add" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button type="primary" title="新增" onClick={showModalHandler}>
                          <PlusOutlined />
                        </Button>
                        <Modal title="新增">
                          <ApiForm id={currentMenu && currentMenu.id} />
                        </Modal>
                      </>
                    )}
                  </RenderPropsModal>
                </Authorized>
                <Authorized authority="system:api:import" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button title="上传" onClick={showModalHandler}>
                          <UploadOutlined />
                        </Button>
                        <Modal title="上传" width={800}>
                          <UploadForm />
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

export default Api;
