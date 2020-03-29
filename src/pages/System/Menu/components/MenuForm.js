import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, TreeSelect, Tooltip, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import styles from '../../System.less';

const MenuForm = connect(({ systemMenu: { tree, menu }, loading }) => ({
  tree,
  menu,
  loading: loading.effects[('systemMenu/fetchById', 'systemMenu/add', 'systemMenu/update')],
}))(({ loading, children, isEdit, id, menu, tree, dispatch }) => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue } = form;

  // 【模态框显示隐藏属性】
  const [visible, setVisible] = useState(false);

  // 【模态框显示隐藏函数】
  const showModalHandler = (e) => {
    if (e) e.stopPropagation();
    setVisible(true);
  };
  const hideModelHandler = () => {
    resetFields();
    setVisible(false);
  };

  // 【修改时，获取菜单数据】
  useEffect(() => {
    if (visible && isEdit) {
      dispatch({
        type: 'systemMenu/fetchById',
        payload: {
          id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemMenu/clear',
      });
    };
  }, [visible, isEdit, id, dispatch]);

  // 【修改时，回显菜单表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (!isEmpty(menu)) {
        setFieldsValue({ ...menu, parentId: menu.parentId.toString() });
      }
    }
  }, [visible, isEdit, menu, setFieldsValue]);

  // 【新建时，父菜单默认值】
  useEffect(() => {
    if (visible && !isEdit) {
      if (id) {
        setFieldsValue({ parentId: id.toString() });
      }
    }
  }, [visible, isEdit, id, setFieldsValue]);

  // 【添加与修改菜单】
  const handleAddOrUpdate = (values) => {
    if (isEdit) {
      Object.assign(values, { id }, { type: 1 });
      dispatch({
        type: 'systemMenu/update',
        payload: {
          values,
          oldParentId: menu.parentId,
        },
        callback: () => {
          hideModelHandler();
          message.success('修改菜单成功。');
        },
      });
    } else {
      Object.assign(values, { type: 1 });
      dispatch({
        type: 'systemMenu/add',
        payload: {
          values,
          oldParentId: id,
        },
        callback: () => {
          hideModelHandler();
          message.success('添加菜单成功。');
        },
      });
    }
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
        title={isEdit ? '修改菜单' : '新增菜单'}
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="menuForm"
          className={styles.form}
          initialValues={{
            status: true,
          }}
          onFinish={handleAddOrUpdate}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请将名称长度保持在1至20字符之间！',
                min: 1,
                max: 20,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <span>编码</span>
                <Tooltip title="请保证与前台路由组织的name一致，以实现动态菜单功能。">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            name="code"
            rules={[
              {
                required: true,
                message: '请将编码长度保持在1至20字符之间！',
                min: 1,
                max: 20,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true }]}
            valuePropName="checked"
          >
            <Switch checkedChildren="开" unCheckedChildren="关" />
          </Form.Item>
          <Form.Item label="父菜单" name="parentId">
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={tree}
              placeholder="请选择菜单。"
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={hideModelHandler}>取消</Button>
            <Button type="primary" loading={loading} htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default MenuForm;
