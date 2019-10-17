import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取整棵部门树数据。
 * @returns {Promise<void>}
 */
export async function getDepartmentTree() {
  return request('/departments');
}

/**
 * 根据父部门主键查询其所有子部门数据。
 * @param payload
 * @returns {Promise<void>}
 */
export async function listSubDepartmentById(payload) {
  const { id, ...rest } = payload;
  return request(`/departments/${id}/children?${stringify(rest)}`);
}

/**
 * 按主键与方向移动部门。
 * @param params {id,step} id是要操作的节点，step表示上移(1)还是下移(-1)
 * @returns {Promise<void>}
 */
export async function moveDepartment(params) {
  const { sourceId, targetId } = params;
  return request.put(`/departments?from=${sourceId}&to=${targetId}`);
}

/**
 * 按主键查询一条部门数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getDepartmentById(id) {
  return request(`/departments/${id}`);
}

/**
 * 添加部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDepartment(params) {
  return request('/departments', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除部门。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDepartment(id) {
  return request(`/departments/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 更新部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDepartment(params) {
  const { id } = params;
  return request(`/departments/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用部门。
 * @param params
 * @return {Promise<void>}
 */
export async function enableDepartment(params) {
  const { id, status } = params;
  return request(`/departments/${id}`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}
