import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tree,
  Table,
  Input,
  Button,
  Switch,
  Popconfirm,
  Divider,
  message,
} from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import { getPlainNode, getParentKey, getValue } from '@/utils/utils';
import DepartmentForm from './components/DepartmentForm';
import styles from '../System.less';

const { Search } = Input;

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
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  // 【部门树搜索参数】
  const [searchValue, setSearchValue] = useState('');
  // 【查询参数】
  const [params, setParams] = useState({});
  //
  const [first, setFirst] = useState(true);

  // 【首次请求加载部门树】
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

  // 【默认选中、展开、子部门数据、当前部门】
  useEffect(() => {
    if (first && Array.isArray(tree) && tree.length) {
      setSelectedKeys([tree[0].key]);
      setExpandedKeys([tree[0].key]);
      setParams({ ...params, id: tree[0].id });
      setCurrentDepartment({ ...tree[0], titleValue: tree[0].title });
      setFirst(false);
    }
  }, [first, tree]);

  // 【展开部门】
  const handleExpand = keys => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // 【选择部门并获取其子部门数据】
  const handleSelect = (keys, info) => {
    if (keys.length === 1) {
      const id = keys[0];
      setSelectedKeys(keys);
      setParams({ ...params, id });
      setCurrentDepartment(info.node.props);
    }
  };

  // 【搜索部门并高亮其搜索项】
  const handleChange = e => {
    const { value } = e.target;
    const keys = getPlainNode(tree)
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, tree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(keys);
    setSearchValue(value);
    setAutoExpandParent(false);
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
        ...record,
        sourceId: record.id,
        targetId,
      },
    });
  };

  // 【启用禁用部门】
  const toggleState = (checked, record) => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemDepartment/enable',
      payload: {
        id,
        status: checked,
        parentId,
      },
    });
  };

  // 【删除部门】
  const handleDelete = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemDepartment/delete',
      payload: {
        id,
        parentId,
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

    const { id } = currentDepartment;

    setParams({
      ...params,
      id,
      ...filters,
    });
  };

  // 【构造树结构，添加高亮支持】
  const loop = (data = []) =>
    data.map(item => {
      const it = { ...item, titleValue: item.title, disabled: !item.status };
      const index = it.title.indexOf(searchValue);
      const beforeStr = it.title.substr(0, index);
      const afterStr = it.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
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
    },
    {
      title: '部门状态',
      dataIndex: 'status',
      filters: [
        { text: '禁用', value: 0 },
        { text: '启用', value: 1 },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <Authorized authority="system:department:status" noMatch={NoMatch(text)}>
          {/* true数据不方便转换status，在这里进行转化。 */}
          <Switch checked={text} onClick={checked => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:department:move" noMatch="--">
          <ArrowUpOutlined
            className="icon"
            title="向上"
            onClick={() => handleMove(record, index - 1)}
          />
          <Divider type="vertical" />
          <ArrowDownOutlined
            className="icon"
            title="向下"
            onClick={() => handleMove(record, index + 1)}
          />
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
      render: (text, record) => (
        <>
          <Authorized authority="system:department:update" noMatch={null}>
            <DepartmentForm isEdit id={record.id}>
              <EditOutlined title="编辑" className="icon" />
            </DepartmentForm>
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
    <PageHeaderWrapper title={false}>
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card
            title="组织"
            bordered={false}
            style={{ marginTop: 10 }}
            bodyStyle={{ padding: '15px' }}
          >
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleChange} />
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              autoExpandParent={autoExpandParent}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              treeData={loop(tree)}
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
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:department:add" noMatch={null}>
                  <DepartmentForm id={currentDepartment && currentDepartment.id}>
                    <Button type="primary" title="新增">
                      <PlusOutlined />
                    </Button>
                  </DepartmentForm>
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
    </PageHeaderWrapper>
  );
});

const areEqual = (prevProps, nextProps) => isEqual(prevProps, nextProps);

export default memo(Department, areEqual);
