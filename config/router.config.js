export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './login' },
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
            component: './home',
          },
          // account
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [
              {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
              },
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ],
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
                component: './system/department',
                authority: ['system:department'],
              },
              {
                path: '/system/users',
                name: 'user',
                icon: 'TeamOutlined',
                component: './system/user',
                authority: ['system:user'],
              },
              {
                path: '/system/roles',
                name: 'role',
                icon: 'UsergroupAddOutlined',
                component: './system/role',
                authority: ['system:role'],
              },
              {
                path: '/system/menus',
                name: 'menu',
                icon: 'MenuOutlined',
                component: './system/menu',
                authority: ['system:menu'],
              },
              {
                path: '/system/apis',
                name: 'api',
                icon: 'ApiOutlined',
                component: './system/api',
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
                    component: './system/dictionary',
                  },
                  {
                    path: '/system/dictionaries/:id',
                    hideInMenu: true,
                    component: './system/dictionary',
                  },
                ],
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
                component: './exception/403',
              },
              {
                path: '/exception/404',
                name: 'not-find',
                component: './exception/404',
              },
              {
                path: '/exception/500',
                name: 'server-error',
                component: './exception/500',
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
