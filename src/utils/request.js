/**
 * request 网络请求工具
 * 更详细的api文档: https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
 */
import { extend } from 'umi-request';
import { message as Message, Modal, notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  default: '系统未知错误，请反馈给管理员',
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  // data为后台接口包含的错误信息。如果后台返回的数据格式不符合要求将自己格式化一下。
  const { response, data } = error;
  // 未设置状态码则默认为成功状态
  const code = response.status;
  // 获取错误信息
  const msg =
    (data && data.apierror && data.apierror.message) || codeMessage[code] || response.statusText || codeMessage.default;
  if (code === 401) {
    Modal.confirm({
      centered: true,
      title: '系统提示',
      content: msg,
      okText: '重新登录',
      onOk() {
        return new Promise((resolve) => {
          resolve('test');
        });
      },
    });
    return Promise.reject(new Error(msg));
  }
  if (code === 500) {
    Message.error({ content: msg });
    return Promise.reject(new Error(msg));
  }
  notification.error({
    message: msg,
    description: msg,
  });
  return Promise.reject(new Error(msg));
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: '/api/v1', // 默认前缀
  timeout: 10000,
  errorHandler, // 默认错误处理
});

/**
 * 请求拦截器。
 */
request.interceptors.request.use(async (url, options) => {
  const optionsCopy = { ...options };
  optionsCopy.headers['Content-Type'] = 'application/json;charset=utf-8';
  // 是否需要设置 token
  const isToken = (options.headers || {}).isToken === false;
  const token = localStorage.getItem('jwt');
  if (token && !isToken) {
    optionsCopy.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    url,
    options: optionsCopy,
  };
});

export default request;
