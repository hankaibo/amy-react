import request from '@/utils/request';

/**
 * 查询资源树数据。
 * @returns {Promise<void>}
 */
export async function getResourceTree() {
  return request('/resources?type=1');
}

/**
 * 按主键查询所有子资源数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getChildrenById(id) {
  return request(`/resources/${id}/children?type=2`);
}

/**
 * 按主键上移下移节点。
 * @param params {id,step} id是要操作的节点，step表示上移(1)还是下移(-1)
 * @returns {Promise<void>}
 */
export async function moveResource(params) {
  const { id, direction } = params;
  return request(`/resources/${id}/location`, {
    method: 'PUT',
    data: {
      direction,
    },
  });
}

/**
 * 按主键查询一条资源数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getResourceById(id) {
  return request(`/resources/${id}`);
}

/**
 * 添加资源。
 * @param params
 * @returns {Promise<void>}
 */
export async function addResource(params) {
  return request('/resources', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 删除资源。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteResource(id) {
  return request(`/resources/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除资源。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchResource(ids) {
  return request('/resources', {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新资源。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateResource(params) {
  const { id } = params;
  return request(`/resources/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
