export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './login',
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
              {
                path: '/',
                redirect: '/home',
                authority: ['system:user:info'],
              },
              // home
              {
                path: '/home',
                name: 'home',
                icon: 'home',
                component: './home',
              },
              // account
              {
                path: '/account',
                name: 'account',
                icon: 'user',
                routes: [
                  {
                    path: '/account/center',
                    name: 'center',
                    component: './account/center',
                  },
                  {
                    path: '/account/settings',
                    name: 'settings',
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
                    component: './system/department',
                    authority: ['system:department:tree'],
                  },
                  {
                    path: '/system/users',
                    name: 'user',
                    component: './system/user',
                    authority: ['system:user:list'],
                  },
                  {
                    path: '/system/roles',
                    name: 'role',
                    component: './system/role',
                    authority: ['system:role:tree'],
                  },
                  {
                    path: '/system/menus',
                    name: 'menu',
                    component: './system/menu',
                    authority: ['system:menu:tree'],
                  },
                  {
                    path: '/system/apis',
                    name: 'api',
                    component: './system/api',
                    authority: ['system:api:children'],
                  },
                  {
                    path: '/system/dictionaries',
                    name: 'dictionary',
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
              {
                component: './404',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
