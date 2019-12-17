import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Tree, Modal, message, Button } from 'antd';
import { difference } from '@/utils/utils';

const FormItem = Form.Item;

/**
 * 本实现，将选中的子节点与半包含的父节点都提交到后台。
 * 查询后台时，因为我使用左右树结构，非常方便分离出那些是父节点，expandedKeys只设置子节点的值。
 */
const RoleResourceForm = connect(
  ({ systemRole: { resourceTree, checkedKeys, halfCheckedKeys }, loading }) => ({
    treeData: resourceTree,
    resCheckedKeys: checkedKeys,
    halfCheckedKeys,
    loading: loading.models.systemRole,
  }),
)(
  Form.create({ name: 'roleResourceForm' })(
    ({ loading, children, role, treeData, resCheckedKeys, halfCheckedKeys, form, dispatch }) => {
      const { validateFields, getFieldDecorator, setFieldsValue } = form;

      // https://github.com/ant-design/ant-design/issues/9807
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

      // 【获取要修改角色的资源】
      useEffect(() => {
        if (visible) {
          const { id } = role;
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
        return () => {
          dispatch({
            type: 'systemRole/clearResTree',
          });
        };
      }, [visible, role, dispatch, setFieldsValue]);

      // 【回显树复选择框】
      useEffect(() => {
        setCheckedKeys(resCheckedKeys);
        setExpandedKeys(halfCheckedKeys);
        // 同步到表单
        setFieldsValue({ ids: resCheckedKeys.concat(halfCheckedKeys) });
      }, [resCheckedKeys, halfCheckedKeys, setFieldsValue]);

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
          const { id, ids } = fieldsValue;
          const oldCheckedKeys = [...resCheckedKeys, ...halfCheckedKeys];
          const plusResource = difference(ids, oldCheckedKeys);
          const minusResource = difference(oldCheckedKeys, ids);

          if (id) {
            dispatch({
              type: 'systemRole/grantRoleResource',
              payload: {
                id,
                plusResource,
                minusResource,
              },
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
            title="权限配置"
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
        </span>
      );
    },
  ),
);

export default RoleResourceForm;
