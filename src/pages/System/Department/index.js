import React, { useState, useEffect } from 'react';
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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import IconFont from '@/components/IconFont';
import { getPlainNode, getParentKey } from '@/utils/utils';
import DepartmentForm from './components/DepartmentForm';
import styles from '../System.less';

const { TreeNode } = Tree;
const { Search } = Input;

const Department = props => {
  const { loading, tree, list, dispatch } = props;

  // 【当前点击的部门】
  const [current, setCurrent] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemDepartment/fetch',
    });
  }, []);

  // 【启用禁用部门】
  const toggleState = (checked, record) => {
    dispatch({
      type: 'systemDepartment/update',
      payload: { ...record, status: checked },
    });
  };

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
        setCurrent(info.node.props);
      },
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
          <TreeNode key={item.key} title={title} {...it}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} {...it} />;
    });

  // 【移动】
  const handleMove = (record, direction) => {
    dispatch({
      type: 'systemDepartment/move',
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

  // 【表格列】
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'title',
    },
    {
      title: '部门状态',
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
          <Authorized authority="system.department.update" noMatch={null}>
            <DepartmentForm isEdit department={record}>
              <a>
                <IconFont type="icon-edit" title="编辑" />
              </a>
              <Divider type="vertical" />
            </DepartmentForm>
          </Authorized>
          <Authorized authority="system.department.delete" noMatch={null}>
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
            title="部门树"
            style={{ marginTop: 10 }}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
          >
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={handleChange} />
            <Tree
              showLine
              switcherIcon={<IconFont type="icon-department" />}
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
            title={current ? `【${current.titleValue}】的子部门` : '部门列表'}
            bordered={false}
            bodyStyle={{ padding: '15px' }}
            style={{ marginTop: 10 }}
          >
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <DepartmentForm department={current}>
                  <Button type="primary" title="新增">
                    <Icon type="plus" />
                  </Button>
                </DepartmentForm>
              </div>
              <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />
            </div>
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(({ systemDepartment: { tree, list }, loading }) => ({
  tree,
  list,
  loading: loading.models.systemDepartment,
}))(Department);
