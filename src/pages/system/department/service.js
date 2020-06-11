import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 根据状态获取部门树。
 * @returns {Promise<void>}
 */
export async function getDepartmentTree(params) {
  return request(`/departments?${stringify(params)}`);
}

/**
 * 根据部门id查询其下的所有直接子部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function listSubDepartmentById(params) {
  const { id, ...rest } = params;
  return request(`/departments/${id}/children?${stringify(rest)}`);
}

/**
 * 根据数据新建一个部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDepartment(params) {
  return request.post('/departments', {
    data: {
      ...params,
    },
  });
}

/**
 * 根据部门id查询部门详情。
 * @param id
 * @returns {Promise<void>}
 */
export async function getDepartmentById(id) {
  return request(`/departments/${id}`);
}

/**
 * 根据部门数据更新部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDepartment(params) {
  const { id } = params;
  return request.put(`/departments/${id}`, {
    data: {
      ...params,
    },
  });
}

/**
 * 根据部门状态启用禁用部门。
 * @param params
 * @return {Promise<void>}
 */
export async function enableDepartment(params) {
  const { id, status } = params;
  return request.patch(`/departments/${id}/status?${stringify({ status })}`);
}

/**
 * 根据部门Id删除一个部门。(子孙部门同样连带删除。)
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDepartment(id) {
  return request.delete(`/departments/${id}`);
}

/**
 * 按主键与方向移动部门。
 * @param params
 * @returns {Promise<void>}
 */
export async function moveDepartment(params) {
  const { sourceId, targetId } = params;
  return request.put(`/departments?from=${sourceId}&to=${targetId}`);
}
