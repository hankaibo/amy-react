import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const UserRoleForm = Form.create({ name: 'userRoleForm' })(props => {
  const { children, user, roleList, roleSelected, form, dispatch } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;

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

  // 【获取要修改用户的角色】
  useEffect(() => {
    if (visible) {
      const { id } = user;
      dispatch({
        type: 'systemUser/fetchRoleByUser',
        payload: {
          id,
        },
        callback: () => {
          setVisible(true);
        },
      });
    }
  }, [visible, user]);

  // 【回显树复选择框】
  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible) {
      const { id } = user;
      setFieldsValue({ id, ids: roleSelected });
    }
  }, [visible, user, roleSelected]);

  // 【授权】
  const handleGrant = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'systemUser/grantUserRole',
          payload: fieldsValue,
          callback: () => {
            hideModelHandler();
            message.success('分配成功');
          },
        });
      }
    });
  };

  return (
    <span>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        destroyOnClose
        title="角色配置"
        visible={visible}
        onOk={handleGrant}
        onCancel={hideModelHandler}
      >
        <Form>
          {getFieldDecorator('id')(<Input hidden />)}
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('ids')(
              <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                {roleList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.code}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
});

export default connect(({ systemUser: { roleList, roleSelected } }) => ({
  roleList,
  roleSelected,
}))(UserRoleForm);
