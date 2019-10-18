import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, TreeSelect, Tooltip, Icon, Button } from 'antd';

const FormItem = Form.Item;

const MenuForm = connect(({ systemMenu: { tree, editMenu }, loading }) => ({
  tree,
  editMenu,
  loading: loading.models.systeMenu,
}))(
  Form.create({ name: 'menuForm' })(
    ({ loading, children, isEdit, menu, editMenu, tree, form, dispatch }) => {
      const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;

      // 【模态框显示隐藏属性】
      const [visible, setVisible] = useState(false);

      // 【模态框显示隐藏函数】
      const showModalHandler = e => {
        if (e) e.stopPropagation();
        setVisible(true);
      };
      const hideModelHandler = () => {
        setVisible(false);
      };

      // 【获取数据】
      useEffect(() => {
        if (visible && isEdit) {
          const { id } = menu;
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
      }, [visible, isEdit, menu, dispatch]);

      // 【回显表单】
      useEffect(() => {
        // 👍 将条件判断放置在 effect 中
        if (visible && isEdit) {
          if (Object.keys(editMenu).length > 0) {
            setFieldsValue(editMenu);
          }
        }
      }, [visible, isEdit, editMenu, setFieldsValue]);

      // 【保证任何时候添加上级菜单都有默认值】
      useEffect(() => {
        if (visible) {
          if (menu) {
            setFieldsValue({ parentId: menu.id });
          } else if (tree.length) {
            setFieldsValue({ parentId: tree[0].id });
          }
        }
      }, [visible, menu, tree, setFieldsValue]);

      // 【添加与修改】
      const handleAddOrUpdate = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;

          if (isEdit) {
            dispatch({
              type: 'systemMenu/update',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('修改成功');
              },
            });
          } else {
            dispatch({
              type: 'systemMenu/add',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('添加成功');
              },
            });
          }
        });
      };

      // 【表单布局】
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
      };

      return (
        <span>
          <span onClick={showModalHandler}>{children}</span>
          <Modal
            destroyOnClose
            title={isEdit ? '修改' : '新增'}
            visible={visible}
            onOk={handleAddOrUpdate}
            onCancel={hideModelHandler}
            footer={[
              <Button key="back" onClick={hideModelHandler}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleAddOrUpdate}>
                确定
              </Button>,
            ]}
          >
            <Form {...formItemLayout}>
              {getFieldDecorator('type', { initialValue: 1 })(<Input hidden />)}
              {isEdit && getFieldDecorator('id')(<Input hidden />)}
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请将名称长度保持在1至20字符之间！',
                      min: 1,
                      max: 20,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem
                label={
                  <span>
                    <span>编码</span>
                    <Tooltip title="请保证与前台路由组织的name一致，以实现动态菜单功能。">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请将编码长度保持在1至20字符之间！',
                      min: 1,
                      max: 20,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
                  <Switch checkedChildren="开" unCheckedChildren="关" />
                )}
              </FormItem>
              <FormItem label="上级菜单">
                {getFieldDecorator('parentId')(
                  <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={tree}
                    placeholder="请选择菜单"
                    treeDefaultExpandAll
                  />
                )}
              </FormItem>
            </Form>
          </Modal>
        </span>
      );
    }
  )
);

export default MenuForm;
