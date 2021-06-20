import React, { useState } from 'react';
import { Card, Col, Collapse, Descriptions, List, Row, Space, Typography } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Eraser from '@/components/Eraser';
import styles from './index.less';

const { Panel } = Collapse;
const { Text, Link } = Typography;

const Home = () => {
  const [logList] = useState([
    {
      version: 'v1.0.0',
      datetime: '2021-01-01',
      content: ['Amy系统正式发布'],
    },
  ]);
  return (
    <div className={styles.container}>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card title="联系信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <>
                    <GithubOutlined />
                    <Text>前端bug</Text>
                  </>
                }
              >
                <Link href="https://github.com/hankaibo/amy-react/issues">
                  https://github.com/hankaibo/amy-react/issues
                </Link>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <GithubOutlined />
                    <Text>后台bug: </Text>
                  </>
                }
              >
                <Link href="https://github.com/hankaibo/amy-java/issues">
                  https://github.com/hankaibo/amy-java/issues
                </Link>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card title="更新日志">
            <Collapse ghost>
              {logList.map((item) => (
                <Panel
                  header={
                    <Text>
                      {item.version} - {item.datetime}
                    </Text>
                  }
                  key={item.datetime}
                >
                  <List
                    size="small"
                    dataSource={item.content}
                    renderItem={(it, idx) => (
                      <List.Item>
                        {idx + 1}. {it}
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card title="捐赠支持">
            <Space>
              {/* eslint-disable-next-line global-require */}
              <Eraser width={190} height={251} qrSrc={require('@/assets/alipay-qr-code.jpg')} />
              {/* eslint-disable-next-line global-require */}
              <Eraser width={190} height={251} qrSrc={require('@/assets/wechat-qr-code.jpg')} />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
