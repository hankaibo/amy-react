import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Form, Tree, message, Button } from 'antd';
import { difference } from '@/utils/utils';
import styles from '@/pages/System/System.less';

const UserRoleForm = connect(
  ({ systemUser: { roleTree, checkedKeys, halfCheckedKeys }, loading }) => ({
    treeData: roleTree,
    roleCheckedKeys: checkedKeys,
    halfCheckedKeys,
    loading: loading.effects['systemUser/fetchRoleTree'],
  }),
)(({ loading, children, userId, treeData, roleCheckedKeys, halfCheckedKeys, dispatch }) => {
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

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
          id: userId,
          status: 1,
        },
      });
    }
    return () => {
      dispatch({
        type: 'systemUser/clearRoleTree',
      });
    };
  }, [visible, userId, dispatch]);

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
  const handleGrant = values => {
    const { ids } = values;
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
        message.success('用户分配角色成功。');
      },
    });
  };

  // 【表单布局】
  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 19, offset: 5 },
    },
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        forceRender
        destroyOnClose
        title="角色配置"
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="userRoleForm"
          className={styles.form}
          initialValues={{}}
          onFinish={handleGrant}
        >
          <Form.Item name="ids">
            <Tree
              checkable
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              checkedKeys={checkedKeys}
              onCheck={handleCheck}
              treeData={treeData}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button onClick={hideModelHandler}>取消</Button>
            <Button type="primary" loading={loading} htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default UserRoleForm;
