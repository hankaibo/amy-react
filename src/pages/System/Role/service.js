import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取整棵角色树。
 * @param params
 * @returns {Promise<void>}
 */
export async function getRoleTree(params) {
  return request(`/roles?${stringify(params)}`);
}

/**
 * 根据父角色主键查询其所有子角色数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function listSubRoleById(params) {
  const { id, ...rest } = params;
  return request(`/roles/${id}/children?${stringify(rest)}`);
}

/**
 * 添加角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function addRole(params) {
  return request.post('/roles', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条角色数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getRoleById(id) {
  return request(`/roles/${id}`);
}

/**
 * 更新角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateRole(params) {
  const { id } = params;
  return request.put(`/roles/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用角色。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableRole(params) {
  const { id, status } = params;
  return request.patch(`/roles/${id}/status?${stringify({ status })}`);
}

/**
 * 删除角色。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteRole(id) {
  return request.delete(`/roles/${id}`);
}

/**
 * 按主键与方向移动角色。
 * @param params
 * @returns {Promise<void>}
 */
export async function moveRole(params) {
  const { sourceId, targetId } = params;
  return request.put(`/roles?from=${sourceId}&to=${targetId}`);
}

/**
 * 查询完整的资源树。
 * @returns {Promise<void>}
 */
export async function getResourceByRole(id) {
  return request(`/roles/${id}/resources`);
}

/**
 * 赋予角色某资源。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function grantRoleResource(params) {
  const { id, ...rest } = params;
  return request.post(`/roles/${id}/resources`, {
    data: rest,
  });
}
