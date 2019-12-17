import request from '@/utils/request';

export async function login(params) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request('/logout', {
    method: 'POST',
  });
}
