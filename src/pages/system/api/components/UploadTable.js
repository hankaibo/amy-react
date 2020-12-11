import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, ImportOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import RenderPropsModal from '@/components/RenderModal';
import ImportForm from './ImportForm';
import styles from './UploadTable.less';

const addOrUpdate = (arr, obj) => {
  const newArr = [...arr];
  for (let i = 0; i < newArr.length; i += 1) {
    if (Object.keys(newArr[i])[0] === Object.keys(obj)[0]) {
      newArr[i] = { ...obj };
      return newArr;
    }
  }
  newArr.push(obj);
  return newArr;
};

const UploadTable = connect(({ systemApi: { apiList } }) => ({
  apiList,
}))(({ apiList, dispatch }) => {
  // 【自定义列属性】
  const inputTextRef = useRef(null);
  const [column, setColumn] = useState([]);
  // 【复选框状态属性与函数】
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'systemApi/updateFile',
      payload: [...column],
    });
    return () => {
      dispatch({
        type: 'systemApi/clearFile',
      });
    };
  }, [column, dispatch]);

  // 【上传】
  const props = {
    name: 'swagger',
    accept: '.json',
    beforeUpload: (file) => {
      message.success(`${file.name} 上传成功。`);
      const reader = new FileReader();
      reader.readAsText(file);
      // reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const fileContent = JSON.parse(reader.result);
        dispatch({
          type: 'systemApi/uploadFile',
          payload: {
            fileContent,
          },
        });
      };
      return false;
    },
    onRemove() {
      dispatch({
        type: 'systemApi/clearFile',
      });
    },
  };

  // 【复选框相关操作】
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  // 动态修改上传文件某列值
  const handleSubmit = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setColumn(addOrUpdate(column, { [dataIndex]: selectedKeys[0] }));
  };
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setColumn(addOrUpdate(column, { [dataIndex]: '' }));
  };
  const handleChange = (e, setSelectedKeys, dataIndex) => {
    setColumn(addOrUpdate(column, { [dataIndex]: e.target.value }));
    setSelectedKeys(e.target.value ? [e.target.value] : []);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div>
        <Input
          ref={inputTextRef}
          placeholder="'添加前缀"
          value={selectedKeys[0]}
          onChange={(e) => handleChange(e, setSelectedKeys, dataIndex)}
          onPressEnter={() => handleSubmit(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSubmit(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          确定
        </Button>
        <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterIcon: (filtered) => <EditOutlined title="编辑" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: (filterVisible) => {
      if (filterVisible) {
        setTimeout(() => inputTextRef.current.select());
      }
    },
  });

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
      ...getColumnSearchProps('uri'),
    },
    {
      title: '编码',
      dataIndex: 'code',
      ...getColumnSearchProps('code'),
    },
    {
      title: '方法类型',
      dataIndex: 'method',
    },
  ];

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <div className="tableList">
        <div className="tableListOperator">
          <Upload {...props}>
            <Button title="上传">
              <UploadOutlined />
            </Button>
          </Upload>
          <RenderPropsModal>
            {({ showModalHandler, Modal }) => (
              <>
                <Button type="primary" disabled={selectedRowKeys.length <= 0} title="导入" onClick={showModalHandler}>
                  <ImportOutlined />
                </Button>
                <Modal title="新增">
                  <ImportForm ids={selectedRowKeys} className={styles.import} onClean={() => setSelectedRowKeys([])} />
                </Modal>
              </>
            )}
          </RenderPropsModal>
        </div>
        <Table
          key="key"
          bordered
          size="small"
          columns={columns}
          dataSource={apiList}
          pagination={false}
          rowSelection={rowSelection}
        />
      </div>
    </Card>
  );
});

export default UploadTable;
