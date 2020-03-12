import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, message, Button, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const InformationForm = connect(({ systemInformation: { editInformation }, loading }) => ({
  editInformation,
  loading: loading.models.systemInformation,
}))(
  Form.create({ name: 'informationForm' })(
    ({ loading, children, isEdit, information, editInformation, form, dispatch }) => {
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

      // 【获取要修改信息的数据】
      useEffect(() => {
        if (visible && isEdit) {
          const { id } = information;
          dispatch({
            type: 'systemInformation/fetchById',
            payload: {
              id,
            },
          });
        }
        return function cleanup() {
          dispatch({
            type: 'systemInformation/clearInformation',
          });
        };
      }, [visible, isEdit, information, dispatch]);

      // 【回显表单】
      useEffect(() => {
        // 👍 将条件判断放置在 effect 中
        if (visible && isEdit) {
          if (Object.keys(editInformation).length > 0) {
            setFieldsValue(editInformation);
          }
        }
      }, [visible, isEdit, editInformation, setFieldsValue]);

      // 【添加与修改】
      const handleAddOrUpdate = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;

          if (isEdit) {
            dispatch({
              type: 'systemInformation/update',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('修改成功');
              },
            });
          } else {
            dispatch({
              type: 'systemInformation/add',
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
              {isEdit && getFieldDecorator('id')(<Input hidden />)}
              <FormItem label="标题">
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请将标题长度保持在1至20字符之间！',
                      min: 1,
                      max: 20,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('description', {
                  rules: [{ message: '请将描述长度保持在1至150字符之间！', min: 1, max: 150 }],
                })(
                  <TextArea placeholder="请输入信息描述。" autoSize={{ minRows: 2, maxRows: 6 }} />,
                )}
              </FormItem>
              <FormItem label="类型">
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择类型！' }],
                })(
                  <Radio.Group>
                    <Radio value={1}>通知</Radio>
                    <Radio value={2}>消息</Radio>
                    <Radio value={3}>事件</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              <FormItem label="发送范围">
                {getFieldDecorator('range', {
                  rules: [{ required: true, message: '请选择范围！' }],
                })(
                  <Radio.Group>
                    <Radio value={1}>按部门</Radio>
                    <Radio value={2}>按用户</Radio>
                    <Radio value={3}>自定义</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Form>
          </Modal>
        </span>
      );
    },
  ),
);

export default InformationForm;
