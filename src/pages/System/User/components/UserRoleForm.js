import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const UserRoleForm = Form.create({ name: 'userRoleForm' })(props => {
  const {
    children,
    record: { id },
    form,
    dispatch,
  } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;

  const [visible, setVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [roleSelected, setRoleSelected] = useState([]);

  const showModalHandler = e => {
    if (e) e.stopPropagation();
    setVisible(true);
  };

  const hideModelHandler = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'systemUser/fetchRoleList',
        payload: {
          id,
        },
        callback: () => {
          setVisible(true);
        },
      }).then(data => {
        setRoleList(data.roleList);
        setRoleSelected(data.roleSelected);
      });
    }
  }, [visible, id]);

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    if (visible) {
      setFieldsValue({ id, ids: roleSelected });
    }
  }, [id, roleSelected]);

  const handleGive = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'systemUser/giveUserRole',
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
        onOk={handleGive}
        onCancel={hideModelHandler}
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
    </span>
  );
});

export default connect(({ systemUser }) => ({
  systemUser,
}))(UserRoleForm);
