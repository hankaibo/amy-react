import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const DepartmentForm = Form.create({ name: 'departmentForm' })(props => {
  const { children, isEdit, department, editDepartment, tree, form, dispatch } = props;
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
      const { id } = department;
      dispatch({
        type: 'systemDepartment/fetchById',
        payload: {
          id,
        },
      });
    }
    return function cleanup() {
      dispatch({
        type: 'systemDepartment/clear',
      });
    };
  }, [visible, isEdit, department]);

  // 【回显表单】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible && isEdit) {
      if (Object.keys(editDepartment).length > 0) {
        setFieldsValue(editDepartment);
      }
    }
  }, [visible, isEdit, editDepartment]);

  // 【保证任何时候添加上级菜单都有默认值】
  useEffect(() => {
    if (visible) {
      if (department) {
        setFieldsValue({ parentId: department.id });
      } else if (tree.length) {
        setFieldsValue({ parentId: tree[0].id });
      }
    }
  }, [visible, department, tree]);

  // 【添加与修改】
  const handleAddOrUpdate = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (isEdit) {
        dispatch({
          type: 'systemDepartment/update',
          payload: fieldsValue,
          callback: () => {
            resetFields();
            hideModelHandler();
            message.success('修改成功');
          },
        });
      } else {
        dispatch({
          type: 'systemDepartment/add',
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
      sm: { span: 15 },
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
      >
        <Form {...formItemLayout}>
          {isEdit && getFieldDecorator('id')(<Input hidden />)}
          <FormItem label="名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入至少1个字符的规则描述！', min: 1 }],
            })(<Input />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('status', { initialValue: true, valuePropName: 'checked' })(
              <Switch checkedChildren="开" unCheckedChildren="关" />
            )}
          </FormItem>
          <FormItem label="描述">
            {getFieldDecorator('description')(
              <TextArea placeholder="请输入字典描述" autosize={{ minRows: 2, maxRows: 6 }} />
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
});

export default connect(({ systemDepartment: { tree, editDepartment } }) => ({
  tree,
  editDepartment,
}))(DepartmentForm);
