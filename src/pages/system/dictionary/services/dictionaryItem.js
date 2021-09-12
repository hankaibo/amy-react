import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询字典项列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageDictionaryItem(params) {
  return request(`/dictionaryItems?${stringify(params)}`);
}

/**
 * 添加字典项。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDictionaryItem(params) {
  return request.post('/dictionaryItems', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条字典项数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getDictionaryItemById(id) {
  return request(`/dictionaryItems/${id}`);
}

/**
 * 更新字典项。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDictionaryItem(params) {
  const { id } = params;
  return request.put(`/dictionaryItems/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用字典项。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableDictionaryItem(params) {
  const { id, status } = params;
  return request.patch(`/dictionaryItems/${id}/status?${stringify({ status })}`);
}

/**
 * 删除字典项。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDictionaryItem(id) {
  return request.delete(`/dictionaryItems/${id}`);
}

/**
 * 批量删除字典项。
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteBatchDictionaryItem(params) {
  return request.delete('/dictionaryItems', {
    data: {
      ...params,
    },
  });
}
