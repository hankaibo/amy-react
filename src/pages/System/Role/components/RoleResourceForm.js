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
    halfCheckedKeys,
    form,
    dispatch,
  } = props;
  const { validateFields, getFieldDecorator, setFieldsValue } = form;

  // https://github.com/ant-design/ant-design/issues/9807
  // https://github.com/ant-design/ant-design/issues/9807
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState([]);
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

  useEffect(() => {
    if (resSelected.length > 0) {
      setCheckedKeys(resSelected);
      setFieldsValue({ ids: resSelected.concat(halfCheckedKeys) });
    }
  }, [resSelected, halfCheckedKeys]);

  const onExpand = values => {
    setExpandedKeys(values);
    setAutoExpandParent(false);
  };

  const handleCheck = (values, event) => {
    const { halfValues } = event;
    setFieldsValue({ ids: [...values, ...halfValues] });
    setCheckedKeys(values);
  };

  const handleGive = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.id) {
        dispatch({
          type: 'systemRole/giveRoleResource',
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
      <Modal destroyOnClose title="权限配置" visible={visible} onOk={handleGive} onCancel={hideModelHandler}>
        <Form>
          {getFieldDecorator('id')(<Input hidden />)}
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('ids')(
              <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={handleCheck}
                checkedKeys={checkedKeys}
                treeData={resTree}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    </span>
  );
});

export default connect(({ systemRole: { resTree, resSelected, halfCheckedKeys } }) => ({
  resTree,
  resSelected,
  halfCheckedKeys,
}))(RoleResourceForm);
