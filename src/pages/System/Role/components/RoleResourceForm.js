import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Tree, Modal, message } from 'antd';

const FormItem = Form.Item;

const RoleResourceForm = Form.create({ name: 'roleResourceForm' })(props => {
  const {
    children,
    role: { id },
    resTree,
    resSelected,
    form,
    dispatch,
  } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;

  // https://github.com/ant-design/ant-design/issues/9807
  // https://github.com/ant-design/ant-design/issues/9807
  const [halfValue, setHalfValue] = useState([]);
  const [visible, setVisible] = useState(false);

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
        type: 'systemRole/fetchResTree',
        payload: {
          id,
        },
        callback: () => {
          setFieldsValue({ id });
        },
      });
    }
    return function cleanup() {
      dispatch({
        type: 'systemRole/clearRes',
      });
    };
  }, [visible, id]);

  const handleCheck = (checkedKeys, event) => {
    const { halfCheckedKeys } = event;
    setFieldsValue({ ids: checkedKeys });
    setHalfValue(halfCheckedKeys);
  };

  const handleGive = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id && fieldsValue.ids) {
        const newFieldsValue = { ...fieldsValue };
        newFieldsValue.ids = fieldsValue.ids.concat(halfValue);
        dispatch({
          type: 'systemRole/giveRoleResource',
          payload: newFieldsValue,
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
      <Modal destroyOnClose title="权限配置" visible={visible} onOk={handleGive} onCancel={hideModelHandler}>
        <Form>
          {getFieldDecorator('id')(<Input hidden />)}
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('ids')(
              <Tree
                autoExpandParent
                checkable
                checkedKeys={resSelected}
                defaultExpandAll
                treeData={resTree}
                onCheck={handleCheck}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
});

export default connect(({ systemRole: { resTree, resSelected } }) => ({
  resTree,
  resSelected,
}))(RoleResourceForm);
