import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, Tree, Button, message } from 'antd';
import { difference } from '@/utils/utils';
import styles from '../../System.less';

/**
 * 本实现，将选中的子节点与半包含的父节点都提交到后台。
 * 查询后台时，因为我使用左右树结构，非常方便分离出那些是父节点，expandedKeys只设置子节点的值。
 */
const RoleResourceForm = connect(
  ({ systemRole: { resourceTree, checkedKeys, halfCheckedKeys }, loading }) => ({
    treeData: resourceTree,
    resCheckedKeys: checkedKeys,
    halfCheckedKeys,
    loading: loading.effects['systemRole/fetchResTree'],
  }),
)(({ loading, children, id, treeData, resCheckedKeys, halfCheckedKeys, dispatch }) => {
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
  }, [visible, id, dispatch, setFieldsValue]);

  // 【回显树复选择框】
  useEffect(() => {
    setCheckedKeys(resCheckedKeys);
    setExpandedKeys(halfCheckedKeys);
    // 同步到表单
    setFieldsValue({ ids: resCheckedKeys.concat(halfCheckedKeys) });
  }, [resCheckedKeys, halfCheckedKeys, setFieldsValue]);

  // 【树操作】
  const onExpand = (values) => {
    setExpandedKeys(values);
  };
  const handleCheck = (values, event) => {
    const { halfCheckedKeys: halfValues } = event;
    setCheckedKeys(values);
    // 同步到form表单，因为tree组件不是表单组件的一部分，我无法自动同步，需要手动设置一下。
    setFieldsValue({ ids: [...values, ...halfValues] });
  };

  // 【授权】
  const handleGrant = (values) => {
    const { id: roleId, ids } = values;
    const oldCheckedKeys = [...resCheckedKeys, ...halfCheckedKeys];
    const plusResource = difference(ids, oldCheckedKeys);
    const minusResource = difference(oldCheckedKeys, ids);

    if (roleId) {
      dispatch({
        type: 'systemRole/grantRoleResource',
        payload: {
          id: roleId,
          plusResource,
          minusResource,
        },
        callback: () => {
          hideModelHandler();
          message.success('分配成功');
        },
      });
    }
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
      xs: { offset: 0, span: 24 },
      sm: { offset: 5, span: 19 },
    },
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      <Modal
        forceRender
        destroyOnClose
        title="权限配置"
        visible={visible}
        onCancel={hideModelHandler}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="roleResourceForm"
          className={styles.form}
          onFinish={handleGrant}
        >
          <Form.Item name="ids">
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              onCheck={handleCheck}
              checkedKeys={checkedKeys}
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

export default RoleResourceForm;
