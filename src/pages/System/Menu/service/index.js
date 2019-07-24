import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @returns {Promise<void>}
 */
export async function queryMenuTree() {
  return request('/api/v1/resources?type=1');
}

/**
 * 按主键查询所有子节点数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryChildrenById(id) {
  return request(`/api/v1/resources/${id}/children?type=1`);
}

/**
 * 按主键上移下移节点。
 * @param params {id,step} id是要操作的节点，step表示上移(1)还是下移(-1)
 * @returns {Promise<void>}
 */
export async function moveMenu(params) {
  const { id, direction } = params;
  return request(`/api/v1/resources/${id}/location`, {
    method: 'PUT',
    data: {
      direction,
    },
  });
}

/**
 * 按主键查询一条菜单数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryMenuById(id) {
  return request(`/api/v1/resources/${id}`);
}

/**
 * 添加菜单。
 * @param params
 * @returns {Promise<void>}
 */
export async function addMenu(params) {
  return request('/api/v1/resources', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除菜单。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteMenu(id) {
  return request(`/api/v1/resources/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除菜单。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchMenu(ids) {
  return request('/api/v1/resources', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新菜单。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateMenu(params) {
  const { id } = params;
  return request(`/api/v1/resources/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
