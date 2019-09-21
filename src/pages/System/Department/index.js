import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import IconFont from '@/components/IconFont';
import DepartmentForm from './components/DepartmentForm';
import styles from '../System.less';

const Department = props => {
  const { loading, departmentTree, list, dispatch } = props;

  // 【当前点击的部门】
  const [current, setCurrent] = useState(null);

  // 【首次请求加载树数据】
  useEffect(() => {
    dispatch({
      type: 'systemDepartment/fetch',
    });
  }, []);

  // 【启用禁用】
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

  // 【移动】
  const handleGo = (record, direction) => {
    const { id } = record;
    dispatch({
      type: 'systemDepartment/moveDepartment',
      payload: {
        id,
        direction,
      },
    });
  };

  // 【删除】
  const deleteItem = id => {
    dispatch({
      type: 'systemDepartment/delete',
      payload: {
        id,
      },
      callback: () => {
        message.success('删除成功');
      },
    });
  };
  const handleDelete = record => {
    const { id } = record;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该部门吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(id),
    });
  };

  // 【表格列】
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'title',
    },
    {
      title: '部门编码',
      dataIndex: 'code',
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
            onClick={() => handleGo(record, 'UP')}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => handleGo(record, 'DOWN')}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <DepartmentForm isEdit department={record}>
            <a>
              <IconFont type="icon-edit" title="编辑" />
            </a>
            <Divider type="vertical" />
          </DepartmentForm>
          <a onClick={() => handleDelete(record)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
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
            <Tree treeData={departmentTree} onSelect={handleSelect} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Card
            title={current ? `[${current.title}]的子部门` : '部门列表'}
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

export default connect(({ systemDepartment: { departmentTree, list }, loading }) => ({
  departmentTree,
  list,
  loading: loading.models.systemDepartment,
}))(Department);
