import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 按条件查询信息列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageInformation(params) {
  return request(`/information?${stringify(params)}`);
}

/**
 * 添加信息。
 * @param params
 * @returns {Promise<void>}
 */
export async function addInformation(params) {
  return request('/information', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条信息数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getInformationById(id) {
  return request(`/information/${id}`);
}

/**
 * 更新信息。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateInformation(params) {
  const { id } = params;
  return request(`/information/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除信息。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteInformation(id) {
  return request(`/information/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除信息。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchInformation(ids) {
  return request('/information', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
