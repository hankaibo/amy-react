/**
 * request 网络请求工具
 * 更详细的api文档: https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

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
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const apierror = {
    status: '',
    message: '',
  };
  // data为后台接口包含的错误信息。如果后台返回的数据格式不符合要求将自己格式化一下。
  const { response, data } = error;
  if (response && response.status) {
    // 如果后台接口定义了错误信息，则使用接口定义的；否则使用默认的错误信息。
    if (Object.prototype.toString.call(data) === '[object Object]') {
      const { status, message } = data;
      apierror.status = status;
      apierror.message = message;
    } else {
      apierror.status = response.status;
      apierror.message = codeMessage[response.status] || response.statusText;
    }

    const errorText = apierror.message;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  // 方式一，直接抛出异常信息，中断请求流程；
  // 优点是简单，models里不需要再处理错误逻辑了；缺点是太糙，对每个请求不能进行精细化处理。
  // 这样的话，登录页面的单独错误信息将不再生效。为了使用登录页面生效，后台请求状态码应该为200。
  // throw error;
  // 方式二，返回整个错误信息或者回后台接口自定义错误信息，我使用了后者；
  // 优缺点与方式一相反。
  return { apierror };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  maxCache: 10, // 最大缓存个数, 超出后会自动清掉按时间最开始的一个.
  prefix: '/api/v1', // 默认前缀
  errorHandler, // 默认错误处理
  credentials: 'omit', // 默认请求是否带上cookie
});

/**
 * 请求拦截器。
 */
request.interceptors.request.use(async (url, options) => {
  const token = localStorage.getItem('jwt');
  const defaultOptions = { ...options };
  if (token && token !== 'undefined' && !url.startsWith('/api/v1/login')) {
    defaultOptions.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    url,
    options: { ...defaultOptions },
  };
});

export default request;
