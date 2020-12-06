import React, { useState, useEffect } from 'react';
import { Form, Tree, Button, message } from 'antd';
import { connect } from 'umi';
import { difference, isEmpty } from '@/utils/utils';

/**
 * 本实现，将选中的子节点与半包含的父节点都提交到后台。
 */
const RoleResourceForm = connect(({ systemRole: { treeData, checkedKeys, halfCheckedKeys }, loading }) => ({
  resTreeData: treeData,
  resCheckedKeys: checkedKeys,
  resHalfCheckedKeys: halfCheckedKeys,
  getLoading: loading.effects['systemRole/fetchResTree'],
  grantLoading: loading.effects['systemRole/grantRoleResource'],
}))(({ getLoading, grantLoading, id, resTreeData, resCheckedKeys, resHalfCheckedKeys, closeModal, dispatch }) => {
  const loading = getLoading || grantLoading;
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  // https://github.com/ant-design/ant-design/issues/9807
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 【获取要修改角色的资源】
  useEffect(() => {
    dispatch({
      type: 'systemRole/fetchResTree',
      payload: {
        id,
      },
    });
    return () => {
      dispatch({
        type: 'systemRole/clearResTree',
      });
    };
  }, [id, dispatch]);

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
    if (!ids) {
      closeModal();
    }
    const oldCheckedKeys = [...resCheckedKeys, ...resHalfCheckedKeys];
    const plusResourceIds = difference(ids, oldCheckedKeys);
    const minusResourceIds = difference(oldCheckedKeys, ids);

    dispatch({
      type: 'systemRole/grantRoleResource',
      payload: {
        id,
        plusResourceIds,
        minusResourceIds,
      },
      callback: () => {
        closeModal();
        message.success('分配资源成功。');
      },
    });
  };

  return (
    <Form form={form} name="roleResourceForm" className="form" onFinish={handleGrant}>
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
        <Button onClick={closeModal}>取消</Button>
        <Button type="primary" loading={loading} htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
});

export default RoleResourceForm;
