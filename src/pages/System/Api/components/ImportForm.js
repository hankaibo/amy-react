import { Modal, Form, Tree, Button, message } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { isEmpty } from '@/utils/utils';
import styles from '@/pages/System/System.less';

const { DirectoryTree } = Tree;

const ImportForm = connect(({ systemApi: { tree } }) => ({
  tree,
}))(({ visible, ids, tree, onClean, closeModal, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

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
        closeModal();
        message.success('导入成功。');
      },
    });
  };

  return (
    <Modal destroyOnClose title="导入接口" visible={visible} onCancel={closeModal} footer={null}>
      <Form form={form} name="importForm" className={styles.form} onFinish={handleImport}>
        <Form.Item
          label="请选择父菜单"
          name="id"
          rules={[{ required: true, message: '请选择父菜单！' }]}
        >
          <DirectoryTree onSelect={handleCheck} treeData={tree} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={closeModal}> 取消 </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default ImportForm;
