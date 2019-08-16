import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryNotices(params = {}) {
  return request(`/notices?${stringify(params)}`);
}
