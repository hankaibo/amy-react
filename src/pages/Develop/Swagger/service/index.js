import request from '@/utils/request';

/**
 * 获取Swagger资源树。
 *
 * @param params
 * @return {Promise<void>}
 */
export default async function getSwaggerTree(params) {
  const { url } = params;
  return request(`${url}`);
}
