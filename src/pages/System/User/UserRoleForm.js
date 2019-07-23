import React, { useEffect } from 'react';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const UserRoleForm = Form.create({ name: 'userRoleForm' })(props => {
  const { visible, handleCancel, form, dispatch, systemUser } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;
  const { roleList, roleSelected: ids, userId: id } = systemUser;

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    setFieldsValue({ id, ids });
  }, [id, ids, setFieldsValue]);

  const handleGive = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'systemUser/giveUserRole',
          payload: fieldsValue,
          callback: () => {
            handleCancel();
            message.success('分配成功');
          },
        });
      }
    });
  };

  return (
    <Modal
      destroyOnClose
      title="角色配置"
      visible={visible}
      onOk={handleGive}
      onCancel={handleCancel}
    >
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
    </Modal>
  );
});

export default UserRoleForm;
