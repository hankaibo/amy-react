import React, { useEffect } from 'react';
import { Tag, message } from 'antd';
import { connect, useIntl } from 'umi';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

const NoticeIconView = ({
  notices = [],
  currentUser,
  fetchingNotices,
  onNoticeVisibleChange,
  dispatch,
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    dispatch({
      type: 'global/fetchNotices',
    });
  });

  const changeReadState = (clickedItem) => {
    const { id } = clickedItem;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  const handleNoticeClear = (title, key) => {
    message.success(`${formatMessage({ id: 'component.noticeIcon.cleared' })} ${title}`);

    dispatch({
      type: 'global/clearNotices',
      payload: key,
    });
  };

  const getNoticeData = () => {
    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
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
      onPopupVisibleChange={onNoticeVisibleChange}
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title={formatMessage({ id: 'component.globalHeader.notification' })}
        emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title={formatMessage({ id: 'component.globalHeader.message' })}
        emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title={formatMessage({ id: 'component.globalHeader.event' })}
        emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      />
    </NoticeIcon>
  );
};

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(NoticeIconView);
