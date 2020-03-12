import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Tree, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { connect } from 'dva';

const { DirectoryTree } = Tree;
const FormItem = Form.Item;

const SwaggerImportForm = connect(({ developSwagger: { menuTree }, loading }) => ({
  menuTree,
  loading: loading.models.developSwagger,
}))(
  Form.create({ name: 'swaggerImportForm' })(
    ({ loading, children, swagger, menuTree, form, dispatch }) => {
      const { validateFields, getFieldDecorator, setFieldsValue } = form;

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

      // 【获取菜单树】
      useEffect(() => {
        if (visible) {
          dispatch({
            type: 'developSwagger/fetchMenu',
          });
        }
        return () => {
          dispatch({
            type: 'developSwagger/clearMenu',
          });
          dispatch({
            type: 'developSwagger/clearSelected',
          });
        };
      }, [visible, dispatch]);

      // 【树操作】
      const handleCheck = selectedKeys => {
        const id = Array.isArray(selectedKeys) && selectedKeys.length > 0 ? selectedKeys[0] : null;
        setFieldsValue({ id });
      };

      // 【导入】
      const handleGrant = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;
          const { id } = fieldsValue;

          dispatch({
            type: 'developSwagger/importApi',
            payload: {
              id,
              swagger,
            },
            callback: () => {
              hideModelHandler();
              message.success('导入成功');
            },
          });
        });
      };

      return (
        <span>
          <span onClick={showModalHandler}>{children}</span>
          <Modal
            destroyOnClose
            title="导入配置"
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
              <FormItem label="请选择父菜单" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('id', {
                  rules: [{ required: true, message: '请选择父级菜单！' }],
                })(<DirectoryTree onSelect={handleCheck} treeData={menuTree} />)}
              </FormItem>
            </Form>
          </Modal>
        </span>
      );
    },
  ),
);

export default SwaggerImportForm;
