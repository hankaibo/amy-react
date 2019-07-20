import request from '@/utils/request';

/**
 * 查询接口树数据。
 * @returns {Promise<void>}
 */
export async function queryInterfaceTree() {
  return request(`/api/v1/resources?type=1`);
}

/**
 * 按主键查询所有子节点数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryChildrenById(id) {
  return request(`/api/v1/resources/${id}/children?type=2`);
}

/**
 * 按主键上移下移节点。
 * @param params {id,step} id是要操作的节点，step表示上移(1)还是下移(-1)
 * @returns {Promise<void>}
 */
export async function moveInterface(params) {
  const { id, step } = params;
  return request(`/api/v1/resources/${id}`, {
    method: 'PUT',
    data: {
      step,
    },
  });
}

/**
 * 按主键查询一条接口数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryInterfaceById(id) {
  return request(`/api/v1/resources/${id}`);
}

/**
 * 添加接口。
 * @param params
 * @returns {Promise<void>}
 */
export async function addInterface(params) {
  return request('/api/v1/resources', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除接口。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteInterface(id) {
  return request(`/api/v1/resources/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除接口。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchInterface(ids) {
  return request(`/api/v1/resources`, {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新接口。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateInterface(params = {}) {
  return request(`/api/v1/resources`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
