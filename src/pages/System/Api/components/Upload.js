import { Modal, Button, Card, Table, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { UploadOutlined, ImportOutlined } from '@ant-design/icons';
import SwaggerImportForm from './SwaggerImportForm';
import styles from '../../System.less';

const Swagger = connect(({ developSwagger: { list, selectedRowKeys }, loading }) => ({
  list,
  selectedRowKeys,
  loading: loading.models.developSwagger,
}))(({ loading, children, list, selectedRowKeys, dispatch }) => {
  // 【模态框显示隐藏属性】
  const [visible, setVisible] = useState(false);

  // 【模态框显示隐藏函数】
  const showModalHandler = (e) => {
    if (e) e.stopPropagation();
    setVisible(true);
  };
  const hideModelHandler = () => {
    setVisible(false);
  };

  // 【清空上传的swagger文件数据】
  useEffect(() => {
    dispatch({
      type: 'developSwagger/clearFile',
    });
    dispatch({
      type: 'developSwagger/clearSelected',
    });
  }, [dispatch]);

  // 【上传】
  const props = {
    name: 'swagger',
    accept: '.json',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // 此file非File对象实例，是包装之后的，请注意。
    onChange({ file }) {
      const { status, originFileObj } = file;
      if (status === 'done') {
        message.success(`${file.name} 文件上传成功。`);
        const reader = new FileReader();
        reader.readAsText(originFileObj);
        // reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          const fileContent = JSON.parse(reader.result);
          dispatch({
            type: 'developSwagger/uploadFile',
            payload: {
              fileContent,
            },
          });
        };
      } else if (status === 'error') {
        message.error(`${file.name} 文件上传失败。`);
      }
    },
    onRemove() {
      dispatch({
        type: 'developSwagger/clearFile',
      });
    },
  };

  // 【复选框相关操作】
  const handleRowSelectChange = (rowKeys) => {
    dispatch({
      type: 'developSwagger/saveSelected',
      payload: {
        rowKeys,
      },
    });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectChange,
  };

  // 【表格列】
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '接口url',
      dataIndex: 'uri',
      ellipsis: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
  ];

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        width={800}
        destroyOnClose
        title="上传"
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Upload {...props}>
                <Button type="primary" title="上传">
                  <UploadOutlined />
                </Button>
              </Upload>
              <SwaggerImportForm swagger={selectedRowKeys}>
                <Button type="primary" disabled={selectedRowKeys.length <= 0} title="导入">
                  <ImportOutlined />
                </Button>
              </SwaggerImportForm>
            </div>
            <Table
              bordered
              size="small"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={false}
              rowSelection={rowSelection}
            />
          </div>
        </Card>
      </Modal>
    </>
  );
});

export default Swagger;
