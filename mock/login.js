// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /api/v1/login': (req, res) => {
    const { password, username } = req.body;
    if (password === '123456' && username === 'admin') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAHWUzZLbIAzH34WzPRPH2TTm1tle9tZDX4CANqG1sQfkbXc6ffcCsbsSdk9BPyTy15d_i-9ohRQnuJq2g3N9At3Wp-7S1Bdtnurm9XDsPjWHY9MdRSVsCNEZxx_g6gD-DXyEYb5GqMxgXXJRKGRzPrTtqe0uT5WAX9MCzk0Gc4x8MZFVwo89vJj0ZiMe1vNoINmf03M2oFdox_SuhzDOXv9zGMDN3zxAdR8HqMJ7QBhkelpa9zpWSutxdrj-Sg0Owa9-A4SgbiD7-A8lU8aUyAAq25f0qlDfv0APCOXVPBm1pWbXd5qvUca9xAEVzqGkaIdtFlnI1-WZNeEAiNbdFt81xMCkPMba4ZZITOXcYlIQQofxbc-Zl4pc8JKwCFoVcqHvtjce3M4VL07qOpsA2tYMSArZ3mld5lx9Rlz34rUJnH4aGScUcEN34tOcM_Hy5pXjoTzDFEHPrFUZkAyzTduTAU8tIy5t8aKpZVS2IcN1G5lCnkYm5RS7mZ5ZGhmw5Ys2TSODchUjKpcte_FNi6hMI0MuT02WHKmWZFIpyeZKEuFCHj5URyKljMS4CmN1-uQp_74lbLIJpiv6QXemnNwWm_pxUWwqjfjPU48ExJ-_1Qb3Rk4GAAA.0_a5nE9zaXkTv3qoGUcoz2DkwJOJUK1baYAV_ELkhIXvlTqOJm8_yxxAjDLi2TgrgJldMMm7dkYnsNnRsgfCkQ',
        roles: 'Administration',
        resources:
          'menuTree,home,system:user:info,account,account:center,system:message:list,system:message:add,system:message:detail,system:message:batchDelete,system:message:update,system:message:delete,system:message:publish,system:message:status,system:message:timer,system:message:batchPublish,account:setting,system,system:department,system:department:tree,system:department:add,system:department:move,system:department:detail,system:department:update,system:department:delete,system:department:children,system:department:status,system:user,system:user:list,system:user:add,system:user:batchDelete,system:user:detail,system:user:update,system:user:delete,system:user:pwd:reset,system:user:pwd:update,system:user:roles,system:user:grant,system:user:status,system:role,system:role:tree,system:role:add,system:role:move,system:role:detail,system:role:update,system:role:delete,system:role:children,system:role:resources,system:role:grant,system:role:status,system:menu,system:menu:tree,system:menu:add,system:menu:move,system:menu:detail,system:menu:update,system:menu:delete,system:menu:children,system:menu:status,system:api,system:api:add,system:api:move,system:api:detail,system:api:update,system:api:delete,system:api:children,system:api:status,system:dictionary,system:dictionary:list,system:dictionary:add,system:dictionary:batchDelete,system:dictionary:detail,system:dictionary:update,system:dictionary:delete,system:dictionary:status',
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAHWTwXKcMAyG38VnmMkC2dnxtb3k1kNfwNjqrlswDBZpM5m8e20t20iGnsCfJM__y9K7-oleafV0Mc_gjKn7y9nUXde2dW-fbW2atj0BnOylb1SlfIwpGadfEOoIyyssCca1T3CNdPAGlT6dn9q267qmqRT8mTdwbgjkxBendHOp1DIN8OLynU3VnNUdfJkcxO3GCiHiKQcgTuti_wVHCOv3BaC6TSNU8S0ijDpXaB9-TJWxdloDPr7aQsB025Y3QozmCnrwEUtmnCuRAzR-KGlv0N6-wgAIZWidndlTd5g7r32ScStxRINrLCn6ce-ChHzbrnkYjoDow3XLfZQ4mM2CqXe4JxpzO_eYNYTRcXo9SpatYgHZElHBu8IC9uYHt0A4CMnm0JzwCeDPSoBZoPPB0xGX6glJ3VvWrnD-7XSaUMAdPajPMy7E6-tigiyVDnMF_xdPRYA5pDN_HgLSGiEpbcvi1giVz0DwsY1CobRBpJzisPJ_YYOAWL505jYIlKuYULlslCU3LaHSBkEpz8ye_XIt-cil5LNUkokUcs_hOjIpZWQmVThv0U_BLG97IiabYb6in_Rgylm02NTPQLGpvOI_V90NqI-_rxL80k0GAAA.agXIr7btPiHOUIz2dxaDqNDu0j5UI_vZGMIdiXdsUwkupU6e7sEbHzZkYetEKCd_51AuEtG_5KtLAsHc9hDp5g',
        roles: 'user,test1',
        resources:
          'menuTree,home,system:user:info,account,account:center,system:message:list,system:message:add,system:message:detail,system:message:batchDelete,system:message:update,system:message:delete,system:message:publish,system:message:status,system:message:timer,system:message:batchPublish,account:setting,system,system:department,system:department:tree,system:department:add,system:department:move,system:department:detail,system:department:update,system:department:delete,system:department:children,system:department:status,system:user,system:user:list,system:user:add,system:user:batchDelete,system:user:detail,system:user:update,system:user:delete,system:user:pwd:reset,system:user:pwd:update,system:user:roles,system:user:grant,system:user:status,system:role,system:role:tree,system:role:add,system:role:move,system:role:detail,system:role:update,system:role:delete,system:role:children,system:role:resources,system:role:grant,system:role:status,system:menu,system:menu:tree,system:menu:add,system:menu:move,system:menu:detail,system:menu:update,system:menu:delete,system:menu:children,system:menu:status,system:api,system:api:add,system:api:move,system:api:detail,system:api:update,system:api:delete,system:api:children,system:api:status,system:dictionary,system:dictionary:list,system:dictionary:add,system:dictionary:batchDelete,system:dictionary:detail,system:dictionary:update,system:dictionary:delete,system:dictionary:status',
      });
      return;
    }
    // 为了保证错误请求也可以被登录页面单独处理，这里状态码要设为200.
    res.status(200).send({
      apierror: {
        status: 'error',
        message: '用户名密码错误。',
      },
    });
  },
  'POst /api/v1/logout': (req, res) => {
    res.send({ code: 200, success: true, message: '用户登出成功。' });
  },
};
