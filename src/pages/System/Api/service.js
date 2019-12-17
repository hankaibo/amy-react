import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @returns {Promise<void>}
 */
export async function getMenuTree() {
  return request('/resources?type=1');
}

/**
 * 按主键查询所有子接口数据。
 * @param payload
 * @returns {Promise<void>}
 */
export async function listChildrenById(payload) {
  const { id, ...rest } = payload;
  rest.type = 2;
  return request(`/resources/${id}/children?${stringify(rest)}`);
}

/**
 * 添加接口。
 * @param params
 * @returns {Promise<void>}
 */
export async function addApi(params) {
  return request('/resources', {
    method: 'POST',
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
  return request(`/resources/${id}`, {
    method: 'PUT',
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
  const { id, status } = params;
  return request(`/resources/${id}`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}

/**
 * 按主键上移下移按钮。
 * @param params {sourceId,targetId} 源按钮与目标按钮
 * @returns {Promise<void>}
 */
export async function moveButton(params) {
  const { sourceId, targetId } = params;
  return request(`/resources?from=${sourceId}&to=${targetId}`, {
    method: 'PUT',
  });
}

/**
 * 删除接口。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteApi(id) {
  return request(`/resources/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除接口。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchApi(ids) {
  return request('/resources', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
