import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, InputNumber, Switch, message, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const DictionaryForm = Form.create({ name: 'dictionaryForm' })(props => {
  const { loading, children, isEdit, dictionary, editDictionary, form, dispatch, ...rest } = props;
  const { location, match } = rest;
  const {
    query: { name: parentName },
  } = location;
  const {
    params: { id: parentId },
  } = match;
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

  // 【获取要修改用户的数据】
  // 注：修改前获取用户数据回显表单，如果列表数据齐全，也可直接使用列表传递过来的而不再请求后台接口。
  useEffect(() => {
    if (visible && isEdit) {
      const { id } = dictionary;
      dispatch({
        type: 'systemDictionary/fetchById',
        payload: {
          id,
        },
        callback: () => {
          setVisible(true);
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemDictionary/clear',
      });
    };
  }, [visible, isEdit, dictionary]);

  // 【回显表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (Object.keys(editDictionary).length > 0) {
        setFieldsValue(editDictionary);
      }
    }
  }, [visible, isEdit, editDictionary]);

  // 【添加与修改】
  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (isEdit) {
        dispatch({
          type: 'systemDictionary/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            hideModelHandler();
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemDictionary/add',
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
        onCancel={() => hideModelHandler()}
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
          {getFieldDecorator('parentId', {
            initialValue: parentId || 0,
          })(<Input hidden />)}
          {isEdit && getFieldDecorator('id', {})(<Input hidden />)}
          {parentName && (
            <FormItem label="父级名称">
              <Input value={parentName} disabled />
            </FormItem>
          )}
          <FormItem label="名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请将名称长度保持在1至20字符之间！', min: 1, max: 20 },
              ],
            })(<Input placeholder="请输入字典名称" />)}
          </FormItem>
          <FormItem label="编码">
            {getFieldDecorator('code', {
              rules: [
                { required: true, message: '请将编码长度保持在1至20字符之间！', min: 1, max: 20 },
              ],
            })(<Input placeholder="请输入字典编码" />)}
          </FormItem>
          <FormItem label="值">
            {getFieldDecorator('value', {
              rules: [
                { required: true, message: '请将值长度保持在1至20字符之间！', min: 1, max: 20 },
              ],
            })(<Input placeholder="请输入字典值" />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('sort')(
              <InputNumber
                placeholder="请输入字典排序"
                min={0}
                max={999}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label="描述">
            {getFieldDecorator('description', {
              rules: [{ message: '请将描述长度保持在1至50字符之间！', min: 1, max: 50 }],
            })(<TextArea placeholder="请输入字典描述。" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
});

export default connect(({ systemDictionary: { editDictionary }, loading }) => ({
  editDictionary,
  loading: loading.models.systemDictionary,
}))(DictionaryForm);
