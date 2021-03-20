import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Input, message, Popconfirm, Row, Switch, Table, Tree } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import RenderPropsModal from '@/components/RenderModal';
import NoMatch from '@/components/Authorized/NoMatch';
import { getParentKey, getPlainNode, getValue, isArray, isEmpty } from '@/utils/utils';
import DepartmentForm from './components/DepartmentForm';

const Department = connect(({ systemDepartment: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemDepartment/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的部门】
  const [currentDepartment, setCurrentDepartment] = useState(null);
  // 【部门树相关配置】
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 【部门树搜索参数】
  const [searchValue, setSearchValue] = useState('');
  // 【查询参数，获取本部门的所有子部门列表的参数】
  const [params, setParams] = useState({
    id: null, // 父部门id
    status: null, // 部门状态
  });
  // 【首次】
  const [first, setFirst] = useState(true);

  // 【初始化后，加载左侧部门树数据】
  useEffect(() => {
    dispatch({
      type: 'systemDepartment/fetch',
    });
    return () => {
      dispatch({
        type: 'systemDepartment/clearTree',
      });
    };
  }, [dispatch]);

  // 【默认选中、展开、子部门数据、当前部门】
  useEffect(() => {
    if (first && isArray(tree) && !isEmpty(tree)) {
      setSelectedKeys([tree[0].key]);
      setExpandedKeys([tree[0].key]);
      setParams({ ...params, id: tree[0].id });
      // 适配下面取titleValue值。
      setCurrentDepartment({ ...tree[0], titleValue: tree[0].title });
      // 只有首次加载后设置如上状态。
      setFirst(false);
    }
  }, [first, tree, params]);

  // 【查询部门列表】
  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch({
        type: 'systemDepartment/fetchChildrenById',
        payload: {
          ...params,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemDepartment/clearList',
      });
    };
  }, [params, dispatch]);

  // 【展开收起部门】
  const handleExpand = (keys) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // 【选择部门并获取其子部门数据】
  const handleSelect = (keys, { selectedNodes }) => {
    if (keys.length === 1) {
      const id = keys[0];
      setSelectedKeys(keys);
      setCurrentDepartment(selectedNodes[0]);
      setParams({ ...params, id });
    }
  };

  // 【搜索部门并高亮其搜索项】
  const handleChange = (e) => {
    const { value } = e.target;
    const keys = getPlainNode(tree)
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, tree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(keys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // 【移动部门】
  const handleMove = (record, index) => {
    if (list.length <= index || index < 0) {
      return;
    }
    const targetId = list[index].id;
    dispatch({
      type: 'systemDepartment/move',
      payload: {
        sourceId: record.id,
        targetId,
      },
      callback: () => {
        message.success('移动部门成功。');
      },
    });
  };

  // 【启用禁用部门】
  const toggleState = (checked, record) => {
    const { id } = record;
    dispatch({
      type: 'systemDepartment/enable',
      payload: {
        id,
        status: checked,
      },
    });
  };

  // 【删除部门】
  const handleDelete = (record) => {
    const { id } = record;
    dispatch({
      type: 'systemDepartment/delete',
      payload: {
        id,
      },
      callback: () => {
        message.success('删除部门成功。');
      },
    });
  };

  // 【过滤部门】
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

  // 【构造树结构，添加高亮支持】
  const loop = (data = []) =>
    data.map((item) => {
      const it = { ...item, titleValue: item.title };
      const index = it.title.indexOf(searchValue);
      const beforeStr = it.title.substr(0, index);
      const afterStr = it.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="selected">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{it.title}</span>
        );
      if (it.children && it.children.length) {
        return { ...it, children: loop(it.children), title };
      }
      return { ...it, title };
    });

  // 【表格列】
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '部门状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 'DISABLED' },
        { text: '启用', value: 'ENABLED' },
      ],
      filterMultiple: false,
      width: 110,
      align: 'center',
      render: (text, record) => (
        <Authorized authority="system:department:status" noMatch={NoMatch(text)}>
          <Switch checked={text} onClick={(checked) => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      width: 90,
      align: 'center',
      render: (text, record, index) => (
        <Authorized authority="system:department:move" noMatch={null}>
          <ArrowUpOutlined className="icon" title="向上" onClick={() => handleMove(record, index - 1)} />
          <Divider type="vertical" />
          <ArrowDownOutlined className="icon" title="向下" onClick={() => handleMove(record, index + 1)} />
        </Authorized>
      ),
    },
    {
      title: '部门备注',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <>
          <Authorized authority="system:department:update" noMatch={null}>
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                  <Modal title="编辑">
                    <DepartmentForm isEdit id={record.id} />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:department:delete" noMatch={null}>
            <Popconfirm
              title="您确定要删除该部门吗？"
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
          <Card title="组织" bordered={false} style={{ marginTop: 10 }} bodyStyle={{ padding: '15px' }}>
            <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleChange} />
            <Tree
              showLine
              autoExpandParent={autoExpandParent}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              treeData={isArray(tree) && !isEmpty(tree) ? loop(tree) : []}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={currentDepartment && `【${currentDepartment.titleValue}】的子部门`}
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <div className="tableList">
              <div className="tableListOperator">
                <Authorized authority="system:department:add" noMatch={null}>
                  <RenderPropsModal>
                    {({ showModalHandler, Modal }) => (
                      <>
                        <Button type="primary" title="新增" onClick={showModalHandler}>
                          <PlusOutlined />
                        </Button>
                        <Modal title="新增">
                          <DepartmentForm id={currentDepartment && currentDepartment.id} />
                        </Modal>
                      </>
                    )}
                  </RenderPropsModal>
                </Authorized>
              </div>
              <Table
                rowKey="id"
                bordered
                childrenColumnName="child"
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

export default Department;
