// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /api/v1/login': (req, res) => {
    const { password, username } = req.body;
    if (password === '123456' && username === 'admin') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAIWR3W6DMAyF3yXXUAVBW-j1XiQkpmQDgvKDVk1790EKlT2YdkXOFx_74Hyxd6_ZjTW1qmTOeZo1eZ4WkhepqK7XtMzqqhKyKHklWcK0c3OxNx8wpA7sBHaGLtQzFKrXw1IiPLtl58vlnPOs4gmDz3EFRRmBNR045LDgTLAyMmuMT1rTQ-IezkO_fk5hnnbSQ2Mw2M5Lw-3cwxBefG28aaWl12YQ9kHadtp5AoRSRNfCy_YNOvBA-B2oL4xK_CpRe9eSdj8z0rueaK3zwgeH_5M4I0Bpoz5I-2wO1DcGqtXesi1wP_R1gyPHGxp5eQ7ijgBFjhpFixpFi5pGi0i2ulMWBgJ7Mx08NpmPMJqK6MH6_vWgvIiqv5o8V8S-fwBDljskfQMAAA.CmGJW9FD-BM_Js_hCQIbBMR3Oa6H-bLvP3hrr-Pr1I8XpBOcl8YlLRD-R_8d9951cyw53j93lGMm6xz2kpe04w',
        role: 'admin',
        resources:
          'system:user:info,' +
          'system:department,' +
          'system:user,' +
          'system:role,' +
          'system:menu,' +
          'system:api,' +
          'develop:swagger,' +
          'system:dictionary,' +
          'system:department:status,' +
          'system:department:move,' +
          'system:department:update,' +
          'system:department:delete,' +
          'system:department:add,' +
          'system:user:status,' +
          'system:user:update,' +
          'system:user:delete,' +
          'system:user:grant,' +
          'system:user:password:reset,' +
          'system:user:add,' +
          'system:user:batchDelete,' +
          'system:role:status,' +
          'system:role:update,' +
          'system:role:delete,' +
          'system:role:grant,' +
          'system:role:add,' +
          'system:dictionary:status,' +
          'system:dictionary:update,' +
          'system:dictionary:delete,' +
          'system:dictionary:add,' +
          'system:dictionary:batchDelete',
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAIWR3W6DMAyF3yXXUAVBW-j1XiQkpmQDgvKDVk1790EKlT2YdkXOFx_74Hyxd6_ZjTW1qmTOeZo1eZ4WkhepqK7XtMzqqhKyKHklWcK0c3OxNx8wpA7sBHaGLtQzFKrXw1IiPLtl58vlnPOs4gmDz3EFRRmBNR045LDgTLAyMmuMT1rTQ-IezkO_fk5hnnbSQ2Mw2M5Lw-3cwxBefG28aaWl12YQ9kHadtp5AoRSRNfCy_YNOvBA-B2oL4xK_CpRe9eSdj8z0rueaK3zwgeH_5M4I0Bpoz5I-2wO1DcGqtXesi1wP_R1gyPHGxp5eQ7ijgBFjhpFixpFi5pGi0i2ulMWBgJ7Mx08NpmPMJqK6MH6_vWgvIiqv5o8V8S-fwBDljskfQMAAA.CmGJW9FD-BM_Js_hCQIbBMR3Oa6H-bLvP3hrr-Pr1I8XpBOcl8YlLRD-R_8d9951cyw53j93lGMm6xz2kpe04w',
        role: 'user',
        resources:
          'system:user:info,' +
          'system:dictionary,' +
          'system:dictionary:status,' +
          'system:dictionary:update,' +
          'system:dictionary:delete,' +
          'system:dictionary:add,' +
          'system:dictionary:batchDelete',
      });
      return;
    }
    res.send({
      status: 'error',
      data: {},
    });
  },
  'POst /api/v1/logout': (req, res) => {
    res.send({ code: 200, success: true, message: '用户登出成功。' });
  },
};
