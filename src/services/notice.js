import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryNotices(params = {}) {
  return request(`/api/v1/notices?${stringify(params)}`);
}
