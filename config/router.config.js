export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // user
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          { path: '/user', redirect: '/user/login' },
          { path: '/user/login', name: 'login', component: './Login/Login' },
          {
            component: '404',
          },
        ],
      },
      //
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['system:user:info'],
        routes: [
          // home
          {
            path: '/home',
            name: 'home',
            icon: 'home',
            component: './Home/Home',
          },
          // system
          {
            path: '/system',
            name: 'system',
            icon: 'setting',
            routes: [
              {
                path: '/system/departments',
                name: 'department',
                component: './System/Department',
                authority: ['system:department'],
              },
              {
                path: '/system/users',
                name: 'user',
                component: './System/User',
                authority: ['system:user'],
              },
              {
                path: '/system/roles',
                name: 'role',
                component: './System/Role',
                authority: ['system:role'],
              },
              {
                path: '/system/menus',
                name: 'menu',
                component: './System/Menu',
                authority: ['system:menu'],
              },
              {
                path: '/system/apis',
                name: 'api',
                component: './System/Api',
                authority: ['system:api'],
              },
              {
                path: '/system/dictionaries/:id',
                hideInMenu: true,
                component: './System/Dictionary',
              },
              {
                path: '/system/information',
                name: 'information',
                component: './System/Information',
              },
            ],
          },
          // develop
          {
            path: '/develop',
            name: 'develop',
            icon: 'icon-tool',
            routes: [
              {
                path: '/develop/swaggers',
                name: 'swagger',
                component: './Develop/Swagger',
                authority: ['develop:swagger'],
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
          //
          {
            path: '/',
            redirect: '/home',
            authority: ['system:user:info'],
          },
          // 404
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
