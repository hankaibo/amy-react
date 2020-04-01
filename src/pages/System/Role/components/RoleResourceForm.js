import React, { useState, useEffect } from 'react';
import { Modal, Form, Tree, Button, message } from 'antd';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { difference } from '@/utils/utils';
import styles from '../../System.less';

/**
 * 本实现，将选中的子节点与半包含的父节点都提交到后台。
 */
const RoleResourceForm = connect(
  ({ systemRole: { treeData, checkedKeys, halfCheckedKeys }, loading }) => ({
    resTreeData: treeData,
    resCheckedKeys: checkedKeys,
    resHalfCheckedKeys: halfCheckedKeys,
    loading: loading.effects['systemRole/fetchResTree'],
  }),
)(
  ({
    loading,
    children,
    disabled,
    id,
    resTreeData,
    resCheckedKeys,
    resHalfCheckedKeys,
    dispatch,
  }) => {
    const [form] = Form.useForm();
    const { setFieldsValue } = form;

    // https://github.com/ant-design/ant-design/issues/9807
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    // 【模态框显示隐藏属性】
    const [visible, setVisible] = useState(false);

    // 【模态框显示隐藏函数】
    const showModalHandler = (e) => {
      if (e) e.stopPropagation();
      setVisible(true);
    };
    const hideModelHandler = () => {
      setFieldsValue();
      setVisible(false);
    };

    // 【获取要修改角色的资源】
    useEffect(() => {
      if (visible) {
        dispatch({
          type: 'systemRole/fetchResTree',
          payload: {
            id,
          },
        });
      }
      return () => {
        dispatch({
          type: 'systemRole/clearResTree',
        });
      };
    }, [visible, id, dispatch]);

    // 【回显树复选择框】
    useEffect(() => {
      if (!isEmpty(resCheckedKeys) || !isEmpty(resHalfCheckedKeys)) {
        setCheckedKeys(resCheckedKeys);
        setExpandedKeys(resHalfCheckedKeys);
        // 同步到表单
        setFieldsValue({ ids: resCheckedKeys.concat(resHalfCheckedKeys) });
      }
    }, [resCheckedKeys, resHalfCheckedKeys, setFieldsValue]);

    // 【树操作】
    const onExpand = (values) => {
      setExpandedKeys(values);
    };
    const handleCheck = (values) => {
      setCheckedKeys(values);
      // 同步到form表单，因为tree组件不是表单组件的一部分，无法自动同步，需要手动设置一下。
      setFieldsValue({ ids: [...values] });
    };

    // 【授权】
    const handleGrant = (values) => {
      const { ids } = values;
      const oldCheckedKeys = [...resCheckedKeys, ...resHalfCheckedKeys];
      const plusResource = difference(ids, oldCheckedKeys);
      const minusResource = difference(oldCheckedKeys, ids);

      dispatch({
        type: 'systemRole/grantRoleResource',
        payload: {
          id,
          plusResource,
          minusResource,
        },
        callback: () => {
          hideModelHandler();
          message.success('分配资源成功。');
        },
      });
    };

    return (
      <>
        <span className={disabled ? 'disabled' : ''} onClick={disabled ? null : showModalHandler}>
          {children}
        </span>
        <Modal
          forceRender
          destroyOnClose
          title="权限配置"
          visible={visible}
          onCancel={hideModelHandler}
          footer={null}
        >
          <Form form={form} name="roleResourceForm" className={styles.form} onFinish={handleGrant}>
            <Form.Item name="ids">
              <Tree
                checkable
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                checkedKeys={checkedKeys}
                onCheck={handleCheck}
                treeData={resTreeData}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button onClick={hideModelHandler}>取消</Button>
              <Button type="primary" loading={loading} htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  },
);

export default RoleResourceForm;
