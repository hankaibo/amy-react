import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Card, Button, Switch, Divider, Modal, message, Icon, Table } from 'antd';
import IconFont from '@/components/IconFont';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MenuForm from './MenuForm';
import styles from '../System.less';

const status = ['禁用', '启用'];

@connect(({ systemMenu, loading }) => ({
  systemMenu,
  loading: loading.models.systemMenu,
}))
class Menu extends Component {
  columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
    },
    {
      title: '菜单状态',
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
        return <Switch checked={text} onClick={checked => this.toggleState(checked, record)} />;
      },
    },
    {
      title: '排序',
      render: (text, record) => (
        <>
          <a
            onClick={() => this.handleGo(record, 'UP')}
            style={{ padding: '0 5px', marginRight: '10px' }}
          >
            <Icon type="arrow-up" title="向上" />
          </a>
          <a onClick={() => this.handleGo(record, 'DOWN')}>
            <Icon type="arrow-down" title="向下" />
          </a>
        </>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <a onClick={() => this.openModal(record)}>
            <IconFont type="icon-edit" title="编辑" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>
            <IconFont type="icon-delete" title="删除" />
          </a>
        </>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      menu: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/fetch',
    });
  }

  openModal = record => {
    const { id } = record;
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'systemMenu/fetchById',
        id,
        callback: () => {
          this.setState({
            visible: true,
          });
        },
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  closeModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/clearInfo',
    });
    this.setState({
      visible: false,
    });
  };

  toggleState = (checked, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/update',
      payload: { ...record, status: checked },
    });
  };

  handleSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    // bug? 当点击靠右时，selectedKeys 为空。
    const id = selectedKeys.length === 0 ? info.node.props.id : selectedKeys;
    dispatch({
      type: 'systemMenu/fetchChildrenById',
      id,
    });
    //
    this.setState({
      menu: info.node.props,
    });
  };

  handleGo = (record, direction) => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/moveMenu',
      payload: {
        id,
        direction,
      },
      callback: () => {
        dispatch({
          type: 'systemMenu/fetch',
        });
        dispatch({
          type: 'systemMenu/fetchChildrenById',
          id,
        });
      },
    });
  };

  // 【删除】
  handleDelete = record => {
    const { id } = record;
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
      type: 'systemMenu/delete',
      id,
      callback: () => {
        dispatch({
          type: 'systemMenu/fetch',
          payload: {},
        });
        message.success('删除成功');
      },
    });
  };

  render() {
    const {
      systemMenu: { menuTree, list },
      loading,
    } = this.props;
    const { visible, menu } = this.state;

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
              <Tree treeData={menuTree} onSelect={this.handleSelect} />
            </Card>
          </Col>
          <Col span={18}>
            <Card
              title={menu ? `[${menu.title}]的子菜单` : '菜单列表'}
              bordered={false}
              bodyStyle={{ padding: '15px' }}
              style={{ marginTop: 10 }}
            >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button type="primary" title="新增" onClick={this.openModal}>
                    <Icon type="plus" />
                  </Button>
                </div>
                <Table rowKey="id" loading={loading} columns={this.columns} dataSource={list} />
              </div>
            </Card>
          </Col>
        </Row>
        <MenuForm {...this.props} visible={visible} handleCancel={this.closeModal} />
      </PageHeaderWrapper>
    );
  }
}

export default Menu;
