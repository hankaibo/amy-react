import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Tree, Modal, message, Button } from 'antd';
import { difference } from '@/utils/utils';

const FormItem = Form.Item;

const UserRoleForm = connect(
  ({ systemUser: { roleTree, checkedKeys, halfCheckedKeys }, loading }) => ({
    treeData: roleTree,
    roleCheckedKeys: checkedKeys,
    halfCheckedKeys,
    loading: loading.effects['systemUser/fetchRoleTree'],
  }),
)(
  Form.create({ name: 'userRoleForm' })(
    ({ loading, children, id, treeData, roleCheckedKeys, halfCheckedKeys, form, dispatch }) => {
      const { validateFields, getFieldDecorator, setFieldsValue } = form;

      const [expandedKeys, setExpandedKeys] = useState([]);
      const [checkedKeys, setCheckedKeys] = useState([]);
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
          dispatch({
            type: 'systemUser/fetchRoleTree',
            payload: {
              id,
              status: 1,
            },
          });
        }
        return () => {
          dispatch({
            type: 'systemUser/clearRoleTree',
          });
        };
      }, [visible, id, dispatch]);

      // 【回显树复选择框】
      useEffect(() => {
        setCheckedKeys(roleCheckedKeys);
        setExpandedKeys(halfCheckedKeys);
      }, [roleCheckedKeys, halfCheckedKeys, setFieldsValue]);

      // 【树操作】
      const onExpand = values => {
        setExpandedKeys(values);
      };
      const handleCheck = (values, event) => {
        const { halfCheckedKeys: halfValues } = event;
        setCheckedKeys(values);
        // 同步到form表单，因为tree组件不是表单组件的一部分，我无法自动同步，需要手动设置一下。
        setFieldsValue({ ids: [...values, ...halfValues] });
      };

      // 【授权】
      const handleGrant = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;
          const { id: userId, ids } = fieldsValue;
          const oldCheckedKeys = [...roleCheckedKeys, ...halfCheckedKeys];
          const plusRole = difference(ids, oldCheckedKeys);
          const minusRole = difference(oldCheckedKeys, ids);

          dispatch({
            type: 'systemUser/grantUserRole',
            payload: {
              id: userId,
              plusRole,
              minusRole,
            },
            callback: () => {
              hideModelHandler();
              message.success('分配成功');
            },
          });
        });
      };

      return (
        <>
          <span onClick={showModalHandler}>{children}</span>
          <Modal
            destroyOnClose
            title="角色配置"
            visible={visible}
            onOk={handleGrant}
            onCancel={hideModelHandler}
            footer={[
              <Button key="back" onClick={hideModelHandler}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleGrant}>
                确定
              </Button>,
            ]}
          >
            <Form>
              {getFieldDecorator('id')(<Input hidden />)}
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('ids')(
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    onCheck={handleCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                  />,
                )}
              </FormItem>
            </Form>
          </Modal>
        </>
      );
    },
  ),
);

export default UserRoleForm;
