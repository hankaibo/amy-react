import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import Inbox from './components/Inbox';
import Sent from './components/Sent';
import styles from './Center.less';

const operationTabList = [
  {
    key: 'inbox',
    tab: (
      <span>
        收件箱 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'sent',
    tab: (
      <span>
        发件箱 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];

const TagList = ({ tags }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];
    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    }
    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>标签</div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center = ({ currentUser = {}, currentUserLoading, dispatch }) => {
  const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);

  const [tabKey, setTabKey] = useState('inbox');

  // TODO 【获取当前用户信息，详细】
  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrent',
    });
  }, []);

  // 【切换标签】
  const onTabChange = (key) => {
    setTabKey(key);
  };

  // 【渲染相应标签的具体内容】
  const renderChildrenByTabKey = (key) => {
    if (key === 'inbox') {
      return <Inbox />;
    }
    if (key === 'sent') {
      return <Sent />;
    }
    return null;
  };

  // 【渲染用户信息】
  const renderUserInfo = (user) => (
    <div className={styles.detail}>
      <p>
        <ContactsOutlined style={{ marginRight: 8 }} />
        {user.title || '老菜鸟'}
      </p>
      <p>
        <ClusterOutlined style={{ marginRight: 8 }} />
        {user.department || 'xx公司-测试部门-测试1部-xxx-bbb-xxx-cccc'}
      </p>
      <p>
        <HomeOutlined style={{ marginRight: 8 }} />
        {user.address || '一无所有，四海不为家'}
      </p>
    </div>
  );

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
            {!dataLoading && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.username}</div>
                  <div>{currentUser.signature || '胸无点墨，满腹牢骚'}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <TagList tags={currentUser.tags || []} />
                <Divider style={{ marginTop: 16 }} dashed />
                <div className={styles.team}>
                  <div className={styles.teamTitle}>团队</div>
                  <Row gutter={36}>
                    {currentUser.notice &&
                      currentUser.notice.map((item) => (
                        <Col key={item.id} lg={24} xl={12}>
                          <Link to={item.href}>
                            <Avatar size="small" src={item.logo} />
                            {item.member}
                          </Link>
                        </Col>
                      ))}
                  </Row>
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={onTabChange}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default connect(({ loading, user }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))(Center);
