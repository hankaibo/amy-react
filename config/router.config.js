export default [
  // /
  { path: '/', redirect: '/user' },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login/Login' },
      { path: '/user/register', name: 'register', component: './Login/Register' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/app',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // home
      // 最好在这里配置authority，要不然没有权限打开下面页面会报错而停留在异常页面非登录页面。
      { path: '/app', redirect: '/app/home', authority: ['system.user.info'] },
      {
        path: '/app/home',
        name: 'home',
        icon: 'home',
        component: './Home/Home',
      },
      // system
      {
        path: '/app/system',
        name: 'system',
        icon: 'setting',
        dynamic: true,
        routes: [
          {
            path: '/app/system/departments',
            name: 'department',
            component: './System/Department',
            dynamic: true,
          },
          {
            path: '/app/system/users',
            name: 'user',
            component: './System/User',
            dynamic: true,
          },
          {
            path: '/app/system/roles',
            name: 'role',
            component: './System/Role',
            dynamic: true,
          },
          {
            path: '/app/system/menus',
            name: 'menu',
            component: './System/Menu',
            dynamic: true,
          },
          {
            path: '/app/system/apis',
            name: 'api',
            component: './System/Api',
            dynamic: true,
          },
          {
            path: '/app/system/dictionaries',
            name: 'dictionary',
            dynamic: true,
            routes: [
              {
                path: '/app/system/dictionaries',
                component: './System/Dictionary',
              },
              {
                path: '/app/system/dictionaries/:id',
                hideInMenu: true,
                component: './System/Dictionary',
              },
            ],
          },
          {
            path: '/app/system/information',
            name: 'information',
            component: './System/Information',
            dynamic: true,
          },
          {
            component: '404',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  // exception
  {
    path: '/exception',
    name: 'exception',
    icon: 'warning',
    hideInMenu: true,
    routes: [
      {
        path: '/exception/403',
        name: 'not-permission',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: 'not-find',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: 'server-error',
        component: './Exception/500',
      },
    ],
  },
  {
    component: '404',
  },
];
