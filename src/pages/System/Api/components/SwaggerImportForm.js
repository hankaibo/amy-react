import { Form, Button, Modal, Tree, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import styles from '@/pages/System/System.less';

const { DirectoryTree } = Tree;

const SwaggerImportForm = connect(({ developSwagger: { menuTree }, loading }) => ({
  menuTree,
  loading: loading.models.developSwagger,
}))(({ loading, children, swagger, menuTree, dispatch }) => {
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

  // 【获取菜单树】
  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'developSwagger/fetchMenu',
      });
    }
    return () => {
      dispatch({
        type: 'developSwagger/clearMenu',
      });
    };
  }, [visible, dispatch]);

  // 【树操作】
  const handleCheck = (selectedKeys) => {
    if (isEmpty(selectedKeys)) {
      const id = selectedKeys[0];
      setFieldsValue({ id });
    }
  };

  // 【导入】
  const handleGrant = (values) => {
    const { id } = values;
    dispatch({
      type: 'developSwagger/importApi',
      payload: {
        id,
        swagger,
      },
      callback: () => {
        hideModelHandler();
        message.success('导入成功。');
      },
    });
  };

  // 【表单布局】
  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 24 },
      sm: { offset: 5, span: 19 },
    },
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        forceRender
        destroyOnClose
        title="导入配置"
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="departmentForm"
          className={styles.form}
          onFinish={handleGrant}
        >
          <Form.Item
            label="请选择父菜单"
            name="id"
            rules={[{ required: true, message: '请选择父级菜单！' }]}
          >
            <DirectoryTree onSelect={handleCheck} treeData={menuTree} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={hideModelHandler}> 取消 </Button>
            <Button type="primary" loading={loading} htmlType="submit">
              {' '}
              确定{' '}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default SwaggerImportForm;
