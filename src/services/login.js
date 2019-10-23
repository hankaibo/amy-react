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

export async function register(params) {
  return request('/register', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile) {
  return request(`/captcha?mobile=${mobile}`);
}
