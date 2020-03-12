import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {
  Row,
  Col,
  Tree,
  Card,
  Button,
  Switch,
  Divider,
  message,
  Popconfirm,
  Table,
  Input,
} from 'antd';
import { isEqual } from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Ellipsis from '@/components/Ellipsis';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Authorized/NoMatch';
import IconFont from '@/components/IconFont';
import { getPlainNode, getParentKey, getValue } from '@/utils/utils';
import DepartmentForm from './components/DepartmentForm';
import styles from '../System.less';

const { TreeNode } = Tree;
const { Search } = Input;

const Department = connect(({ systemDepartment: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.effects['systemDepartment/fetchChildrenById'],
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的部门】
  const [currentDepartment, setCurrentDepartment] = useState(null);
  // 【部门树相关】
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 【查询参数】
  const [params, setParams] = useState({});

  // 【首次请求加载树数据】
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

  // 【查询列表】
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

  // 【获取子部门数据】
  const handleSelect = (selectedKeys, info) => {
    if (selectedKeys.length === 1) {
      const id = selectedKeys[0];
      setParams({ ...params, id });
      setCurrentDepartment(info.node.props);
    }
  };

  // 【启用禁用部门】
  const toggleState = (checked, record) => {
    const info = { ...record };
    delete info.children;
    dispatch({
      type: 'systemDepartment/enable',
      payload: { ...info, status: checked },
    });
  };

  // 【搜索高亮部门】
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
    setAutoExpandParent(true);
  };

  const handleExpand = keys => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // 【构造树结构，添加高亮支持】
  const loop = (data = []) =>
    data.map(item => {
      const it = { ...item };
      it.titleValue = it.title;
      delete it.title;
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return (
          <TreeNode disabled={it.status === 0} key={item.key} title={title} {...it}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      // 因为返回的是树，为了避免在models里循环就在这里直接使用status了。
      return <TreeNode disabled={it.status === 0} key={item.key} title={title} {...it} />;
    });

  // 【移动】
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

  // 【删除】
  const handleDelete = record => {
    const { id, parentId } = record;
    dispatch({
      type: 'systemDepartment/delete',
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

    const { id } = currentDepartment;

    setParams({
      ...params,
      id,
      ...filters,
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      render: (text, record) => record.name || record.title,
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
        <Authorized authority="system:department:status" noMatch={NoMatch(!!text)}>
          {/* true数据不方便转换status，在这里进行转化。 */}
          <Switch checked={!!text} onClick={checked => toggleState(checked, record)} />
        </Authorized>
      ),
    },
    {
      title: '排序',
      render: (text, record, index) => (
        <Authorized authority="system:department:move" noMatch="--">
          <LegacyIcon
            className="icon"
            type="arrow-up"
            title="向上"
            onClick={() => handleMove(record, index - 1)}
          />
          <Divider type="vertical" />
          <LegacyIcon
            className="icon"
            type="arrow-down"
            title="向下"
            onClick={() => handleMove(record, index + 1)}
          />
        </Authorized>
      ),
    },
    {
      title: '部门备注',
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
          <Authorized authority="system:department:update" noMatch={null}>
            <DepartmentForm isEdit id={record.id}>
              <IconFont type="icon-edit" title="编辑" className="icon" />
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
              <IconFont type="icon-delete" title="删除" className="icon" />
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
            title="部门树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleChange} />
            <Tree
              showLine
              switcherIcon={<LegacyIcon type="down" />}
              autoExpandParent={autoExpandParent}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onSelect={handleSelect}
            >
              {loop(tree)}
            </Tree>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={currentDepartment ? `【${currentDepartment.titleValue}】的子部门` : '部门列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:department:add" noMatch={null}>
                  <DepartmentForm id={currentDepartment && currentDepartment.id}>
                    <Button type="primary" title="新增">
                      <LegacyIcon type="plus" />
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
                dataSource={list.length === 0 && currentDepartment === null ? tree : list}
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
