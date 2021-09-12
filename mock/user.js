// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/users/info': {
    address: '东城区1号',
    avatar: 'http://47.95.120.23:9000/images/ffb4ea61-eaaf-48fe-8984-2ef2f1bfdffb.jpeg',
    createTime: '2019-10-04 00:43:06',
    departmentIdList: [1],
    email: 'hankaibo@mail.com',
    id: 1,
    mobile: '+86-18612345678',
    nickname: '管理员',
    phone: '+86-12345678',
    profile: '我是一条狗。',
    realName: 'hankaibo',
    signature: '胸无点墨，满腹牢骚',
    status: 1,
    updateTime: '2020-09-29 17:49:52',
    username: 'admin',
  },
  'GET /api/v1/messages': {
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0,
  },
};
