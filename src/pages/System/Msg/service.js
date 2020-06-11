import { stringify } from 'qs';
import request from '@/utils/request';

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
 * @param id
 * @returns {Promise<void>}
 */
export async function getMessageById(id) {
  return request(`/messages/${id}`);
}

/**
 * 更新站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateMessage(params) {
  const { id } = params;
  return request.put(`/messages/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用站内信。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableMessage(params) {
  const { id, status } = params;
  return request.patch(`/messages/${id}/status?${stringify({ status })}`);
}

/**
 * 删除站内信。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteMessage(id) {
  return request.delete(`/messages/${id}`);
}

/**
 * 批量删除站内信。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchMessage(ids) {
  return request.delete('/messages', {
    data: {
      ids,
    },
  });
}
