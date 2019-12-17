import React, { useState, useEffect, memo } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Tree,
  Card,
  Button,
  Switch,
  Divider,
  Modal,
  message,
  Icon,
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
  loading: loading.models.systemDepartment,
}))(({ loading, tree, list, dispatch }) => {
  // 【当前点击的部门】
  const [department, setDepartment] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemDepartment/fetch',
    });
    return () => {
      dispatch({
        type: 'systemDepartment/clearTree',
      });
      dispatch({
        type: 'systemDepartment/clearList',
      });
    };
  }, [dispatch]);

  // 【获取子部门数据】
  const handleSelect = (selectedKeys, info) => {
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'systemDepartment/fetchChildrenById',
      payload: {
        id,
      },
      callback: () => {
        setDepartment(info.node.props);
      },
    });
  };

  // 【启用禁用部门】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemDepartment/enable',
      payload: { ...record, status: checked },
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
  const loop = data =>
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
  const deleteItem = record => {
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
  const handleDelete = record => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该部门吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(record),
    });
  };

  // 【过滤】
  const handleTableChange = (_, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { id } = department;

    const params = {
      id,
      ...filters,
    };

    dispatch({
      type: 'systemDepartment/fetchChildrenById',
      payload: params,
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
            <DepartmentForm isEdit department={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
            </DepartmentForm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="system:department:delete" noMatch={null}>
            <a onClick={() => handleDelete(record)}>
              <IconFont type="icon-delete" title="删除" />
            </a>
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
              switcherIcon={<Icon type="down" />}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={handleSelect}
              onExpand={handleExpand}
            >
              {loop(tree)}
            </Tree>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={department ? `【${department.titleValue}】的子部门` : '部门列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Authorized authority="system:department:add" noMatch={null}>
                  <DepartmentForm department={department}>
                    <Button type="primary" title="新增">
                      <Icon type="plus" />
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
                dataSource={list.length === 0 && department === null ? tree : list}
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
