import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function getMenuTree(params) {
  return request(`/resources?${stringify(params)}`);
}

/**
 * 按主键查询所有子接口数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function listChildrenById(params) {
  const { id, ...rest } = params;
  return request(`/resources/${id}/children?${stringify(rest)}`);
}

/**
 * 添加接口。
 * @param params
 * @returns {Promise<void>}
 */
export async function addApi(params) {
  return request.post('/resources', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条接口数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getApiById(id) {
  return request(`/resources/${id}`);
}

/**
 * 更新接口。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateApi(params) {
  const { id } = params;
  return request.put(`/resources/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用接口。
 * @param params
 * @return {Promise<void>}
 */
export async function enableApi(params) {
  const { id, ...rest } = params;
  return request.patch(`/resources/${id}/status?${stringify(rest)}`);
}

/**
 * 按主键上移下移按钮。
 * @param params {sourceId,targetId} 源按钮与目标按钮
 * @returns {Promise<void>}
 */
export async function moveButton(params) {
  const { sourceId, targetId } = params;
  return request.put(`/resources?from=${sourceId}&to=${targetId}`);
}

/**
 * 删除接口。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteApi(id) {
  return request.delete(`/resources/${id}`);
}

/**
 * 批量导入接口。
 * @param params
 * @returns {Promise<*>}
 */
export async function importBatchApi(params) {
  return request.post('/resources/batch', {
    data: [...params],
  });
}
