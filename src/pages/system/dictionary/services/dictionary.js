import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询字典列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageDictionary(params) {
  return request(`/dictionaries?${stringify(params)}`);
}

/**
 * 添加字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDictionary(params) {
  return request.post('/dictionaries', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条字典数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getDictionaryById(id) {
  return request(`/dictionaries/${id}`);
}

/**
 * 更新字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDictionary(params) {
  const { id } = params;
  return request.put(`/dictionaries/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用字典。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableDictionary(params) {
  const { id, status } = params;
  return request.patch(`/dictionaries/${id}/status?${stringify({ status })}`);
}

/**
 * 删除字典。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDictionary(id) {
  return request.delete(`/dictionaries/${id}`);
}

/**
 * 批量删除字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteBatchDictionary(params) {
  const { ids } = params;
  return request.delete('/dictionaries', {
    data: [...ids],
  });
}
