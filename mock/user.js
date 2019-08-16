// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /users/info': {
    code: 200,
    success: true,
    message: '成功',
    data: {
      id: 2,
      username: 'user',
      nickname: null,
      realName: null,
      password: 'q',
      salt: '',
      state: null,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: null,
      phone: null,
      mobile: null,
      sex: null,
      lastLoginTime: '2019-06-20T15:11:36.000+0000',
      createTime: '2019-06-20T15:11:36.000+0000',
      modifyTime: '2019-06-20T15:11:36.000+0000',
      roleList: null,
      resourceList: null,
    },
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
