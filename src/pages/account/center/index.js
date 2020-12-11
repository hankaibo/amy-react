import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Card, Col, Divider, Input, Row, Tag, Image, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined, DeleteOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import Authorized from '@/utils/Authorized';
import RenderPropsModal from '@/components/RenderModal';
import Inbox from './components/Inbox';
import Draft from './components/Draft';
import Sent from './components/Sent';
import defaultPic from '../../../assets/default.png';
import MessageForm from './components/MessageForm';
import styles from './Center.less';

const operationTabList = [
  {
    key: 'inbox',
    tab: (
      <span>
        收件箱 <span style={{ fontSize: 14 }} />
      </span>
    ),
  },
  {
    key: 'draft',
    tab: (
      <span>
        草稿箱 <span style={{ fontSize: 14 }} />
      </span>
    ),
  },
  {
    key: 'sent',
    tab: (
      <span>
        发件箱 <span style={{ fontSize: 14 }} />
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

  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tabKey, setTabKey] = useState('inbox');

  // 【获取当前用户信息】
  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrentUser',
    });
  }, [dispatch]);

  // 【切换标签】
  const onTabChange = (key) => {
    setSelectedRowKeys([]);
    setTabKey(key);
  };

  // 【渲染相应标签的具体内容】
  const renderChildrenByTabKey = (key) => {
    switch (key) {
      case 'inbox':
        return <Inbox selectedRowKeys={selectedRowKeys} onChange={setSelectedRowKeys} />;
      case 'draft':
        return <Draft />;
      case 'sent':
        return <Sent selectedRowKeys={selectedRowKeys} onChange={setSelectedRowKeys} />;
      default:
        return null;
    }
  };

  // 【批量删除信息】
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    dispatch({
      type: 'user/deleteBatchMessage',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        setSelectedRowKeys([]);
        message.success('批量删除信息成功。');
      },
    });
  };

  const renderExtraByTabKey = (key) => {
    switch (key) {
      case 'inbox':
      case 'sent':
      case 'draft':
        return (
          <>
            <Authorized authority="system:message:add" noMatch={null}>
              <RenderPropsModal>
                {({ showModalHandler, Modal }) => (
                  <>
                    <Button type="primary" title="新增" onClick={showModalHandler}>
                      <PlusOutlined />
                    </Button>
                    <Modal title="新增">
                      <MessageForm />
                    </Modal>
                  </>
                )}
              </RenderPropsModal>
            </Authorized>
            <Authorized authority="system:message:batchDelete" noMatch={null}>
              <Popconfirm
                title="您确定要删除这些信息吗？"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
                disabled={selectedRowKeys.length <= 0}
              >
                <Button type="danger" disabled={selectedRowKeys.length <= 0} title="删除">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Authorized>
          </>
        );
      default:
        return null;
    }
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
        {user.departmentIdList.map((item) => item)}
      </p>
      <p>
        <HomeOutlined style={{ marginRight: 8 }} />
        {user.address}
      </p>
    </div>
  );

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24} sm={24} xs={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
            {!dataLoading && (
              <div>
                <div className={styles.avatarHolder}>
                  <Image alt="用户头像" width={104} height={104} src={currentUser.avatar} fallback={defaultPic} />
                  <div className={styles.name}>{currentUser.username}</div>
                  <div>{currentUser.signature}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <TagList tags={currentUser.tags} />
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
        <Col lg={17} md={24} sm={24} xs={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            tabBarExtraContent={renderExtraByTabKey(tabKey)}
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
  currentUserLoading: loading.effects['user/fetchCurrentUser'],
}))(Center);
