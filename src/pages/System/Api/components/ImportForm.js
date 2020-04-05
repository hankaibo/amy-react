import { Modal, Form, Tree, Button, message } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import styles from '@/pages/System/System.less';

const { DirectoryTree } = Tree;

const ImportForm = connect(({ systemApi: { tree } }) => ({
  tree,
}))(({ className, children, ids, tree, onClean, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

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

  // 【树操作】
  const handleCheck = (selectedKeys) => {
    if (!isEmpty(selectedKeys)) {
      const id = selectedKeys[0];
      setFieldsValue({ id });
    }
  };

  // 【导入】
  const handleImport = (values) => {
    const { id } = values;
    dispatch({
      type: 'systemApi/importBatch',
      payload: {
        parentId: id,
        ids,
      },
      callback: () => {
        onClean();
        hideModelHandler();
        message.success('导入成功。');
      },
    });
  };

  return (
    <>
      <span className={className} onClick={showModalHandler}>
        {children}
      </span>
      <Modal
        forceRender
        destroyOnClose
        title="导入接口"
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form form={form} name="importForm" className={styles.form} onFinish={handleImport}>
          <Form.Item
            label="请选择父菜单"
            name="id"
            rules={[{ required: true, message: '请选择父菜单！' }]}
          >
            <DirectoryTree onSelect={handleCheck} treeData={tree} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={hideModelHandler}> 取消 </Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default ImportForm;
