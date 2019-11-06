import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, Radio, TreeSelect, Button } from 'antd';

const FormItem = Form.Item;

const ApiForm = connect(({ systemApi: { tree, editApi }, loading }) => ({
  tree,
  editApi,
  loading: loading.models.systemApi,
}))(
  Form.create({ name: 'apiForm' })(
    ({ loading, children, parent, isEdit, api, editApi, tree, form, dispatch }) => {
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
          const { id } = api;
          dispatch({
            type: 'systemApi/fetchById',
            payload: {
              id,
            },
          });
        }
        return () => {
          dispatch({
            type: 'systemApi/clear',
          });
        };
      }, [visible, isEdit, api, dispatch]);

      // 【回显表单】
      useEffect(() => {
        // 👍 将条件判断放置在 effect 中
        if (visible && isEdit) {
          if (Object.keys(editApi).length > 0) {
            if (parent) {
              const len = parent.code.length;
              const data = { ...editApi, code: editApi.code.substring(len + 1) };
              setFieldsValue(data);
            } else {
              setFieldsValue(editApi);
            }
          }
        }
      }, [visible, isEdit, editApi, parent, setFieldsValue]);

      // 【保证任何时候添加上级菜单都有默认值】
      useEffect(() => {
        if (visible) {
          if (parent) {
            setFieldsValue({ parentId: parent.id });
          } else if (tree.length) {
            setFieldsValue({ parentId: tree[0].id });
          }
        }
      }, [visible, parent, tree, setFieldsValue]);

      // 【添加与修改】
      const handleAddOrUpdate = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;
          const params = { ...fieldsValue, code: `${parent.code}.${fieldsValue.code}` };

          if (isEdit) {
            dispatch({
              type: 'systemApi/update',
              payload: params,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('修改成功');
              },
            });
          } else {
            dispatch({
              type: 'systemApi/add',
              payload: params,
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
              {getFieldDecorator('type', { initialValue: 2 })(<Input hidden />)}
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
              <FormItem label="编码">
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请将编码长度保持在1至50字符之间！',
                      min: 1,
                      max: 50,
                    },
                  ],
                })(<Input addonBefore={parent ? `${parent.code}.` : ''} />)}
              </FormItem>
              <FormItem label="URL">
                {getFieldDecorator('uri', {
                  rules: [
                    {
                      required: true,
                      message: '请将URL长度保持在3至100字符之间！',
                      min: 3,
                      max: 100,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
                  <Switch checkedChildren="开" unCheckedChildren="关" />
                )}
              </FormItem>
              <FormItem label="方法类型">
                {getFieldDecorator('method', {
                  rules: [{ required: true, message: '请选择方法类型。' }],
                })(
                  <Radio.Group>
                    <Radio value="GET">GET</Radio>
                    <Radio value="POST">POST</Radio>
                    <Radio value="DELETE">DELETE</Radio>
                    <Radio value="PUT">PUT</Radio>
                    <Radio value="PATCH">PATCH</Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem label="父菜单">
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

export default ApiForm;
