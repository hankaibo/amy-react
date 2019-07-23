import React, { useEffect } from 'react';
import { Form, Input, Tree, Modal, message } from 'antd';

const FormItem = Form.Item;

const RoleResourceForm = Form.create({ name: 'roleResourceForm' })(props => {
  const { visible, handleCancel, form, dispatch, systemRole } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;
  const { resTree, resSelected: ids, roleId: id } = systemRole;

  const handleCheck = checkedKeys => {
    setFieldsValue({ ids: checkedKeys });
  };

  useEffect(() => {
    // 👍 将条件判断放置在 effect 中
    setFieldsValue({ id });
  }, [id, setFieldsValue]);

  const handleGive = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'systemRole/giveRoleResource',
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
      title="权限配置"
      visible={visible}
      onOk={handleGive}
      onCancel={() => handleCancel()}
    >
      {getFieldDecorator('id')(<Input hidden />)}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        {getFieldDecorator('ids')(
          <Tree
            autoExpandParent
            checkable
            defaultCheckedKeys={ids}
            defaultExpandAll
            treeData={resTree}
            onCheck={handleCheck}
          />
        )}
      </FormItem>
    </Modal>
  );
});

export default RoleResourceForm;
