import request from '@/utils/request';

export async function queryDictList(params) {
  const { parentId = -1, pageSize = 10, current = 1 } = params;
  return request(`/api/v1/dicts?parentId=${parentId}&pageSize=${pageSize}&pageNum=${current}`);
}

export async function queryDictOneById(id) {
  return request(`/api/v1/dicts/${id}`);
}

export async function addDict(params) {
  return request('/api/v1/dicts', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeDict(id) {
  return request(`/api/v1/dicts/${id}`, {
    method: 'DELETE',
  });
}

export async function removeBatchDict(ids) {
  return request(`/api/v1/dicts`, {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

export async function updateDict(params = {}) {
  return request('/api/v1/dicts', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
