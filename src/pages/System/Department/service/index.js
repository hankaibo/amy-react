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
 * @param id
 * @returns {Promise<void>}
 */
export async function getDepartmentChildrenById(id) {
  return request(`/departments/${id}/children`);
}

/**
 * 按主键与方向移动部门。
 * @param params {id,step} id是要操作的节点，step表示上移(1)还是下移(-1)
 * @returns {Promise<void>}
 */
export async function moveDepartment(params) {
  const { id, direction } = params;
  return request(`/departments/${id}/location`, {
    method: 'PUT',
    data: {
      direction,
    },
  });
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
 * 批量删除部门。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchDepartment(ids) {
  return request('/departments', {
    method: 'DELETE',
    data: {
      ids,
    },
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
