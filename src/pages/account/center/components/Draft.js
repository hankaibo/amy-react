import React, { useState, useEffect } from 'react';
import { Table, Tag, Popconfirm, Divider, message } from 'antd';
import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import Authorized from '@/utils/Authorized';
import { getValue } from '@/utils/utils';
import RenderPropsModal from '@/components/RenderModal';
import MessageDetail from './MessageDetail';
import MessageForm from './MessageForm';

const getText = (value) => {
  switch (value) {
    case 1:
      return <Tag color="#2db7f5">通知</Tag>;
    case 2:
      return <Tag color="#87d068">消息</Tag>;
    case 3:
      return <Tag color="#108ee9">事件</Tag>;
    default:
      return '--';
  }
};

const Draft = connect(({ user: { currentUser, messageList, messagePagination }, loading }) => ({
  currentUser,
  messageList,
  messagePagination,
  loading: loading.effects['user/fetchMessage'],
}))(
  ({
    loading,
    currentUser,
    messageList,
    messagePagination,
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    dispatch,
  }) => {
    // 列表参数
    const [params, setParams] = useState({
      current: messagePagination.current || 1,
      pageSize: messagePagination.pageSize || 10,
      sendId: currentUser.id,
      isPublish: 0,
      type: null,
    });

    // 【初始化后，加载列表数据】
    useEffect(() => {
      dispatch({
        type: 'user/fetchMessage',
        payload: {
          ...params,
        },
      });
      return () => {
        dispatch({
          type: 'user/clearMessageList',
        });
      };
    }, [params, dispatch]);

    // 【删除信息】
    const handleDelete = (record) => {
      const { id } = record;
      dispatch({
        type: 'user/deleteMessage',
        payload: {
          id,
          source: 'DRAFT',
        },
        callback: () => {
          setSelectedRowKeys([]);
          message.success('删除信息成功。');
        },
      });
    };

    // 【发布信息】
    const handelPublish = (record) => {
      const { id } = record;
      dispatch({
        type: 'user/publishMessage',
        payload: {
          id,
        },
        callback: () => {
          message.success('发布信息成功。');
        },
      });
    };

    // 【复选框相关操作】
    const rowSelection = {
      selectedRowKeys,
      onChange: (keys) => {
        setSelectedRowKeys(keys);
      },
    };

    // 【分页、过滤】
    const handleTableChange = (page, filtersArg) => {
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});

      const { current, pageSize } = page;

      setParams({
        ...params,
        current,
        pageSize,
        ...filters,
      });
    };

    // 【表格列】
    const columns = [
      {
        title: '收信人',
        dataIndex: 'sendName',
      },
      {
        title: '信息标题',
        dataIndex: 'title',
        render: (text, record) => {
          return (
            <RenderPropsModal>
              {({ showModalHandler, Modal }) => (
                <>
                  <a onClick={showModalHandler}>{text}</a>
                  <Modal>
                    <MessageDetail title="详情" id={record.id} from="INBOX" />
                  </Modal>
                </>
              )}
            </RenderPropsModal>
          );
        },
      },
      {
        title: '信息类型',
        dataIndex: 'type',
        filters: [
          { text: '通知', value: 1 },
          { text: '消息', value: 2 },
          { text: '事件', value: 3 },
        ],
        filterMultiple: false,
        render: (text) => getText(text),
      },
      {
        title: '操作',
        render: (text, record) => (
          <>
            <Authorized authority="system:message:update" noMatch={null}>
              <RenderPropsModal>
                {({ showModalHandler, Modal }) => (
                  <>
                    <EditOutlined title="编辑" className="icon" onClick={showModalHandler} />
                    <Modal title="编辑">
                      <MessageForm isEdit id={record.id} />
                    </Modal>
                  </>
                )}
              </RenderPropsModal>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority="system:message:delete" noMatch={null}>
              <Popconfirm
                title="您确定要删除该信息吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <DeleteOutlined title="删除" className="icon" />
              </Popconfirm>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority="system:message:publish" noMatch={null}>
              <SendOutlined title="发布" className="icon" onClick={() => handelPublish(record)} />
            </Authorized>
          </>
        ),
      },
    ];

    return (
      <div className="tableList">
        <Table
          rowKey="id"
          bordered
          loading={loading}
          columns={columns}
          dataSource={messageList}
          pagination={messagePagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
        />
      </div>
    );
  },
);

export default Draft;
