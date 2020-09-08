/**
 * 该接口主要是对当前登录用户的操作，与 src/pages/system/user/service.js（对权限范围内的所有用户进行操作）不同。
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取当前登录用户信息。
 * @returns {Promise<void>}
 */
export async function getCurrentUser() {
  return request(`/users/info`);
}

/**
 * 更新当前登录用户信息。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateCurrentUser(params) {
  return request.put(`/users/info`, {
    data: {
      ...params,
    },
  });
}

/**
 * 更新当前登录用户密码。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function updateCurrentUserPassword(params) {
  const { oldPassword, newPassword } = params;
  return request.patch(`/users/info/password`, {
    data: {
      oldPassword,
      newPassword,
    },
  });
}

/**
 * 获取整棵部门树数据。
 * @returns {Promise<void>}
 */
export async function getDepartmentTree(params) {
  return request(`/departments?${stringify(params)}`);
}

/**
 * 按部门查询用户列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function listUser(params) {
  return request(`/users?${stringify(params)}`);
}

/**
 * 按条件查询站内信列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageMessage(params) {
  return request(`/messages?${stringify(params)}`);
}

/**
 * 添加站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function addMessage(params) {
  return request.post('/messages', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条站内信数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function getMessageById(params) {
  const { id, ...rest } = params;
  return request(`/messages/${id}?${stringify(rest)}`);
}

/**
 * 更新站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateMessage(params) {
  const { id, plusReceiveIds, minusReceiveIds, ...rest } = params;
  return request.put(`/messages/${id}`, {
    data: {
      msg: {
        id,
        ...rest,
      },
      plusReceiveIds,
      minusReceiveIds,
    },
  });
}

/**
 * 发布站内信。
 * @param id
 * @returns {Promise<void>}
 */
export async function publishMessage(id) {
  return request.patch(`/messages/${id}/publication`);
}

/**
 * 删除站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteMessage(params) {
  const { id, ...rest } = params;
  return request.delete(`/messages/${id}?${stringify(rest)}`);
}

/**
 * 批量删除站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteBatchMessage(params) {
  const { ids, ...rest } = params;
  return request.delete(`/messages${stringify(rest)}`, {
    data: [...ids],
  });
}

/**
 * 改变信息阅读状态。
 * @param id
 * @returns {Promise<void>}
 */
export async function updateMessageReadStatus(id) {
  return request.patch(`/messages/${id}/status`);
}

/**
 * 清空所有未读信息。
 * @param ids
 * @returns {Promise<void>}
 */
export async function updateAllMessageReadStatus(ids) {
  return request.put('/messages/status', {
    data: [...ids],
  });
}
