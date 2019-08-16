import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
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
