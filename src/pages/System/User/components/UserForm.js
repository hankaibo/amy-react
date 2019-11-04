import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, Radio, Upload, Icon, TreeSelect, Button } from 'antd';

const FormItem = Form.Item;

// 【模拟上传图片相关函数】
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 【上传前控制判断】
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('对不起，只支持jpg与png格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('对不起，您上传的图片超过2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UserForm = connect(({ systemUser: { tree, editUser }, loading }) => ({
  tree,
  editUser,
  loading: loading.models.systemUser,
}))(
  Form.create({ name: 'userForm' })(
    ({ loading, children, isEdit, user, editUser, tree, form, dispatch }) => {
      const { getFieldDecorator, setFieldsValue, validateFields, resetFields } = form;

      // 【模态框显示隐藏属性】
      const [visible, setVisible] = useState(false);
      // 【模拟图片上传的属性】
      const [imageLoading, setImageLoading] = useState(false);
      const [imageUrl, setImageUrl] = useState(null);

      // 【模态框显示隐藏函数】
      const showModalHandler = e => {
        if (e) e.stopPropagation();
        setVisible(true);
      };
      const hideModelHandler = () => {
        setVisible(false);
      };

      // 【获取要修改用户的数据】
      // 注：修改前获取用户数据回显表单，如果列表数据齐全，也可直接使用列表传递过来的而不再请求后台接口。
      useEffect(() => {
        if (visible && isEdit) {
          const { id } = user;
          dispatch({
            type: 'systemUser/fetchById',
            payload: {
              id,
            },
          });
        }
        return () => {
          dispatch({
            type: 'systemUser/clearUser',
          });
        };
      }, [visible, isEdit, user, dispatch]);

      // 【修改时，回显表单】
      useEffect(() => {
        // 👍 将条件判断放置在 effect 中
        if (visible && isEdit) {
          if (Object.keys(editUser).length > 0) {
            setFieldsValue({ ...editUser, oldDepartmentId: editUser.departmentId });
          }
        }
      }, [visible, isEdit, editUser, setFieldsValue]);

      // 【新建时，保证任何时候添加上级菜单都有默认值】
      // 【使用一个旧部门id，保证修改后还是在本页面】
      //  比如，用户从研究部门修改到测试部门了，这时候是显示研发部门的列表呢，还是显示测试部门的列表？
      // 为了简单方便，添加了一个原属部门的值，保证修改之后，继续刷新原页面。
      useEffect(() => {
        if (visible) {
          if (user) {
            // 添加操作时在列表添加了departmentId属性，故可以取到值。
            setFieldsValue({ departmentId: user.departmentId, oldDepartmentId: user.departmentId });
          } else if (tree.length) {
            setFieldsValue({ departmentId: tree[0].id, oldDepartmentId: tree[0].id });
          }
        }
      }, [visible, user, tree, setFieldsValue]);

      // 【添加与修改】
      const handleAddOrUpdate = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;

          if (isEdit) {
            dispatch({
              type: 'systemUser/update',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('修改成功');
              },
            });
          } else {
            dispatch({
              type: 'systemUser/add',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('添加成功');
              },
            });
          }
        });
      };

      // 【头像上传】
      const handleChange = info => {
        if (info.file.status === 'uploading') {
          setImageLoading(true);
          return;
        }
        if (info.file.status === 'done') {
          // 模拟一个url
          getBase64(info.file.originFileObj, imgUrl => {
            setImageUrl(imgUrl);
            setImageLoading(false);
          });
        }
      };

      // 【表单布局】
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
      };
      // 【上传按钮】
      const uploadButton = (
        <div>
          <Icon type={imageLoading ? 'imageLoading' : 'plus'} />
          <div className="ant-upload-text">上传</div>
        </div>
      );

      return (
        <span>
          <span onClick={showModalHandler}>{children}</span>
          <Modal
            destroyOnClose
            title={isEdit ? '修改' : '新增'}
            visible={visible}
            onOk={handleAddOrUpdate}
            onCancel={hideModelHandler}
            footer={[
              <Button key="back" onClick={hideModelHandler}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleAddOrUpdate}>
                确定
              </Button>,
            ]}
          >
            <Form {...formItemLayout}>
              {isEdit && getFieldDecorator('id')(<Input hidden />)}
              {getFieldDecorator('oldDepartmentId')(<Input hidden />)}
              <FormItem label="头像">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                演示环境，不保存上传的图片。
              </FormItem>
              <FormItem label="名称">
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '请将名称长度保持在1至20字符之间！',
                      min: 1,
                      max: 20,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {!isEdit && (
                <FormItem label="密码">
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请将密码长度保持在6至30字符之间！',
                        min: 6,
                        max: 30,
                      },
                    ],
                  })(<Input type="password" />)}
                </FormItem>
              )}
              <FormItem label="所属部门">
                {getFieldDecorator('departmentId')(
                  <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={tree}
                    placeholder="请选择部门"
                    treeDefaultExpandAll
                  />
                )}
              </FormItem>
              <FormItem label="昵称">
                {getFieldDecorator('nickname', {
                  rules: [{ message: '请将昵称长度保持在1至20字符之间！', min: 1, max: 20 }],
                })(<Input />)}
              </FormItem>
              <FormItem label="真实姓名">
                {getFieldDecorator('realName', {
                  rules: [{ message: '请将真实姓名长度保持在1至20字符之间！', min: 1, max: 20 }],
                })(<Input />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  initialValue: true,
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </FormItem>
              <FormItem label="邮箱">
                {getFieldDecorator('email', {
                  rules: [{ type: 'email', message: '请输入正确的邮箱。' }],
                })(<Input type="email" />)}
              </FormItem>
              <FormItem label="座机号码">
                {getFieldDecorator('phone', {
                  rules: [{ message: '请将座机号码长度保持在8至20字符之间！', min: 8, max: 20 }],
                })(<Input />)}
              </FormItem>
              <FormItem label="手机号码">
                {getFieldDecorator('mobile', {
                  rules: [{ message: '请将手机号码长度保持在8至20字符之间！', min: 11, max: 20 }],
                })(<Input />)}
              </FormItem>
              <FormItem label="性别">
                {getFieldDecorator('sex')(
                  <Radio.Group>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                    <Radio value={3}>保密</Radio>
                    <Radio value={4}>中性</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Form>
          </Modal>
        </span>
      );
    }
  )
);

export default UserForm;
