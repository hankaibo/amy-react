// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/users/info': {
    user: {
      id: 38,
      createTime: '2019-08-06T10:53:58.000+0000',
      username: 'user',
      nickname: '测试用户',
      realName: '张三',
      status: 1,
      email: 'zs@mail.com',
      phone: '13012345678',
      mobile: '812345678',
      sex: 1,
    },
    menuList: ['home', 'root', 'system', 'system.user', 'system.role', 'system.dictionary'],
  },
};
