import React, { useEffect } from 'react';
import { Tag, message } from 'antd';
import { connect, useIntl } from 'umi';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

const NoticeIconView = ({ notices = [], currentUser, fetchingNotices, dispatch }) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    dispatch({
      type: 'user/fetchMessage',
      payload: {
        current: 1,
        pageSize: 5,
        receiveId: currentUser.id,
        isPublish: 1,
        type: null,
      },
    });
  }, [dispatch]);

  const changeReadState = (clickedItem) => {
    const { id } = clickedItem;
    dispatch({
      type: 'user/changeNoticeReadState',
      payload: id,
    });
  };

  const handleNoticeClear = (title, key) => {
    message.success(`${formatMessage({ id: 'component.noticeIcon.cleared' })} ${title}`);

    dispatch({
      type: 'user/clearNotices',
      payload: key,
    });
  };

  const getNoticeData = () => {
    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.createTime) {
        newNotice.createTime = moment(notice.createTime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return newNotices.reduce((acc, cur, idx, src, k = cur.type) => {
      (acc[k] || (acc[k] = [])).push(cur);
      return acc;
    }, {});
  };

  const getUnreadData = (noticeData) => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  const noticeData = getNoticeData();
  const unreadMsg = getUnreadData(noticeData);
  return (
    <NoticeIcon
      className={styles.action}
      count={currentUser && currentUser.unreadCount}
      onItemClick={(item) => {
        changeReadState(item);
      }}
      loading={fetchingNotices}
      clearText={formatMessage({ id: 'component.noticeIcon.clear' })}
      viewMoreText={formatMessage({ id: 'component.noticeIcon.view-more' })}
      onClear={handleNoticeClear}
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData[1]}
        title={formatMessage({ id: 'component.globalHeader.notification' })}
        emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData[2]}
        title={formatMessage({ id: 'component.globalHeader.message' })}
        emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        count={unreadMsg.event}
        list={noticeData[3]}
        title={formatMessage({ id: 'component.globalHeader.event' })}
        emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
        showViewMore
      />
    </NoticeIcon>
  );
};

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  notices: user.messageList,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['user/fetchMessage'],
}))(NoticeIconView);
