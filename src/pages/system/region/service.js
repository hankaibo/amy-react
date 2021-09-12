import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取地区树。
 * @param params
 * @returns {Promise<void>}
 */
export async function getRegionTree(params) {
  return request(`/regions?${stringify(params)}`);
}

/**
 * 根据地区id查询其下的所有直接子地区。
 * @param params
 * @returns {Promise<void>}
 */
export async function listSubRegionById(params) {
  const { id, ...rest } = params;
  return request(`/regions/${id}/children?${stringify(rest)}`);
}

/**
 * 添加地区。
 * @param params
 * @returns {Promise<void>}
 */
export async function addRegion(params) {
  return request.post('/regions', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条地区数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getRegionById(id) {
  return request(`/regions/${id}`);
}

/**
 * 更新地区。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateRegion(params) {
  const { id } = params;
  return request.put(`/regions/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用地区。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableRegion(params) {
  const { id, status } = params;
  return request.patch(`/regions/${id}/status?${stringify({ status })}`);
}

/**
 * 删除地区。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteRegion(id) {
  return request.delete(`/regions/${id}`);
}

/**
 * 按主键与方向移动地区。
 * @param params
 * @returns {Promise<void>}
 */
export async function moveRegion(params) {
  const { sourceId, targetId } = params;
  return request.put(`/regions?from=${sourceId}&to=${targetId}`);
}
