import request from '@/utils/request';

/**
 * 登录
 * @param params 用户名/密码
 * @returns {Promise<*>}
 */
export async function login(params) {
  return request('/login', {
    method: 'POST',
    data: params,
    headers: {
      isToken: false,
    },
  });
}

/**
 * 登出
 * @returns {Promise<*>}
 */
export async function logout() {
  return request('/logout', {
    method: 'POST',
  });
}
