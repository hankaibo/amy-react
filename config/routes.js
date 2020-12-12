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
            icon: 'home',
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
            icon: 'setting',
            routes: [
              {
                path: '/system/departments',
                name: 'department',
                icon: 'apartment',
                component: './system/department',
                authority: ['system:department:tree'],
              },
              {
                path: '/system/users',
                name: 'user',
                icon: 'Team',
                component: './system/user',
                authority: ['system:user:list'],
              },
              {
                path: '/system/roles',
                name: 'role',
                icon: 'usergroupadd',
                component: './system/role',
                authority: ['system:role:tree'],
              },
              {
                path: '/system/menus',
                name: 'menu',
                icon: 'menu',
                component: './system/menu',
                authority: ['system:menu:tree'],
              },
              {
                path: '/system/apis',
                name: 'api',
                icon: 'api',
                component: './system/api',
                authority: ['system:api:children'],
              },
              {
                path: '/system/dictionaries',
                name: 'dictionary',
                icon: 'book',
                authority: ['system:dictionary:list'],
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
