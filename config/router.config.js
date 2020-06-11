export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login' },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['system:user:info'],
        routes: [
          // home
          {
            path: '/home',
            name: 'home',
            icon: 'HomeOutlined',
            component: './Home',
          },
          // system
          {
            path: '/system',
            name: 'system',
            icon: 'SettingOutlined',
            routes: [
              {
                path: '/system/departments',
                name: 'department',
                icon: 'ApartmentOutlined',
                component: './System/Department',
                authority: ['system:department'],
              },
              {
                path: '/system/users',
                name: 'user',
                icon: 'TeamOutlined',
                component: './System/User',
                authority: ['system:user'],
              },
              {
                path: '/system/roles',
                name: 'role',
                icon: 'UsergroupAddOutlined',
                component: './System/Role',
                authority: ['system:role'],
              },
              {
                path: '/system/menus',
                name: 'menu',
                icon: 'MenuOutlined',
                component: './System/Menu',
                authority: ['system:menu'],
              },
              {
                path: '/system/apis',
                name: 'api',
                icon: 'ApiOutlined',
                component: './System/Api',
                authority: ['system:api'],
              },
              {
                path: '/system/dictionaries',
                name: 'dictionary',
                icon: 'BookOutlined',
                authority: ['system:dictionary'],
                routes: [
                  {
                    path: '/system/dictionaries/',
                    hideInMenu: true,
                    component: './System/Dictionary',
                  },
                  {
                    path: '/system/dictionaries/:id',
                    hideInMenu: true,
                    component: './System/Dictionary',
                  },
                ],
              },
              {
                path: '/system/messages',
                name: 'message',
                icon: 'MessageOutlined',
                component: './System/Msg',
                authority: ['system:message'],
              },
              {
                component: './404',
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
              {
                component: './404',
              },
            ],
          },
          //
          {
            path: '/',
            redirect: '/home',
            authority: ['system:user:info'],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
