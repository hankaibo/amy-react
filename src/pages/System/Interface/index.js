import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import IconFont from '@/components/IconFont';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InterfaceForm from './InterfaceForm';
import styles from '../System.less';

const status = ['禁用', '启用'];

@connect(({ systemInterface, loading }) => ({
  systemInterface,
  loading: loading.models.systemInterface,
}))
class Interface extends Component {
  state = {
    visible: false,
    selected: null,
  };

  columns = [
    {
      title: '接口名称',
      dataIndex: 'title',
    },
    {
      title: '接口url',
      dataIndex: 'uri',
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render: (text, record) => {
        return (
          <Switch checked={Boolean(text)} onClick={checked => this.toggleState(checked, record)} />
        );
      },
    },
    {
      title: '排序',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => this.handleGo(record.id, 1)}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => this.handleGo(record.id, -1)}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.openModal(record.id)}>
            <IconFont type="icon-edit" title="编辑" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record.id)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemInterface/fetch',
    });
  }

  openModal = id => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'systemInterface/fetchById',
        id,
        callback: () => {
          this.setState({
            visible: true,
          });
        },
      });
    }
    this.setState({
      visible: true,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemInterface/unselected',
    });
    this.setState({
      visible: false,
    });
  };

  toggleState = (checked, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemInterface/update',
      payload: { ...record, status: checked },
    });
  };

  handleSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    // 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    if (info.node.isLeaf()) {
      dispatch({
        type: 'systemInterface/fetchChildrenById',
        id,
      });
      //
      this.setState({
        selected: info.node.props,
      });
    }
  };

  handleGo = (id, step) => {
    const { dispatch } = this.props;
    const { selected } = this.state;
    const { id: selectId } = selected;
    dispatch({
      type: 'systemInterface/moveInterface',
      payload: {
        id,
        step,
      },
      callback: () => {
        dispatch({
          type: 'systemInterface/fetch',
        });
        dispatch({
          type: 'systemInterface/fetchChildrenById',
          id: selectId,
        });
      },
    });
  };

  // 【删除】
  handleDelete = id => {
    Modal.confirm({
      title: '删除',
      content: '您确定要删除该菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(id),
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemInterface/delete',
      id,
      callback: () => {
        message.success('删除成功');
      },
    });
  };

  render() {
    const {
      systemInterface: { treeData, list },
      loading,
    } = this.props;
    const { visible, selected } = this.state;

    return (
      <PageHeaderWrapper>
        <Row gutter={8}>
          <Col span={6}>
            <Card
              title="菜单树"
              style={{ marginTop: 10 }}
              bordered={false}
              bodyStyle={{ padding: '15px' }}
            >
              <Tree treeData={treeData} onSelect={this.handleSelect} />
            </Card>
          </Col>
          <Col span={18}>
            <Card
              title={selected ? `[${selected.title}]的接口` : '接口列表'}
              bordered={false}
              bodyStyle={{ padding: '15px' }}
              style={{ marginTop: 10 }}
            >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button type="primary" title="新增" onClick={() => this.openModal()}>
                    <Icon type="plus" />
                  </Button>
                </div>
                <Table rowKey="id" loading={loading} columns={this.columns} dataSource={list} />
              </div>
            </Card>
          </Col>
        </Row>
        <InterfaceForm {...this.props} visible={visible} handleCancel={this.closeModal} />
      </PageHeaderWrapper>
    );
  }
}

export default Interface;
