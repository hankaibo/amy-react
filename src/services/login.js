import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/v1/login', {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
  return request('/api/v1/logout', {
    method: 'POST',
  });
}

export async function register(params) {
  return request('/api/v1/register', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile) {
  return request(`/api/v1/captcha?mobile=${mobile}`);
}
