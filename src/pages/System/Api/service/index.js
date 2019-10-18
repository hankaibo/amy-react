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
 * 按主键查询所有子按钮数据。
 * @param payload
 * @returns {Promise<void>}
 */
export async function listChildrenById(payload) {
  const { id, ...rest } = payload;
  rest.type = 2;
  return request(`/resources/${id}/children?${stringify(rest)}`);
}

/**
 * 添加按钮。
 * @param params
 * @returns {Promise<void>}
 */
export async function addButton(params) {
  return request('/resources', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条按钮数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getButtonById(id) {
  return request(`/resources/${id}`);
}
/**
 * 更新按钮。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateButton(params) {
  const { id } = params;
  return request(`/resources/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用按钮。
 * @param params
 * @return {Promise<void>}
 */
export async function enableButton(params) {
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
 * 删除按钮。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteButton(id) {
  return request(`/resources/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除按钮。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchButton(ids) {
  return request('/resources', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
