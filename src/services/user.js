import request from '@/utils/request';

export default async function queryCurrent() {
  return request('/users/info');
}
