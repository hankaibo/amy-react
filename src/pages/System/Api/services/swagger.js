import request from '@/utils/request';

/**
 * 查询菜单树数据。
 * @returns {Promise<void>}
 */
export async function getMenuTree() {
  return request('/resources?type=1');
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
