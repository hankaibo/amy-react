// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /api/v1/login': (req, res) => {
    const { password, username, type } = req.body;
    if (password === '123456' && username === 'admin') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAIWR3W6DMAyF3yXXUAVBW-j1XiQkpmQDgvKDVk1790EKlT2YdkXOFx_74Hyxd6_ZjTW1qmTOeZo1eZ4WkhepqK7XtMzqqhKyKHklWcK0c3OxNx8wpA7sBHaGLtQzFKrXw1IiPLtl58vlnPOs4gmDz3EFRRmBNR045LDgTLAyMmuMT1rTQ-IezkO_fk5hnnbSQ2Mw2M5Lw-3cwxBefG28aaWl12YQ9kHadtp5AoRSRNfCy_YNOvBA-B2oL4xK_CpRe9eSdj8z0rueaK3zwgeH_5M4I0Bpoz5I-2wO1DcGqtXesi1wP_R1gyPHGxp5eQ7ijgBFjhpFixpFi5pGi0i2ulMWBgJ7Mx08NpmPMJqK6MH6_vWgvIiqv5o8V8S-fwBDljskfQMAAA.CmGJW9FD-BM_Js_hCQIbBMR3Oa6H-bLvP3hrr-Pr1I8XpBOcl8YlLRD-R_8d9951cyw53j93lGMm6xz2kpe04w',
        role: 'admin',
        resources:
          'root,home,system,system.user.info,system.user,system.role,system.menu,system.resource,system.dictionary,system.user.list,system.user.add,system.user.batchDelete,system.user.get,system.user.update,system.user.delete,system.user.role.list,system.user.role.give,system.user.status,system.role.list,system.role.add,system.role.batchDelete,system.role.get,system.role.put,system.role.delete,system.role.resource.list,system.role.resource.give,system.role.status,system.menu.list,system.menu.add,system.menu.get,system.menu.put,system.menu.delete,system.menu.children,system.menu.move,system.dictionary.list,system.dictionary.get,system.dictionary.batchDelete,system.dictionary.get,system.dictionary.put,system.dictionary.delete,system.dictionary.status',
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        token:
          'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAIWR3W6DMAyF3yXXUAVBW-j1XiQkpmQDgvKDVk1790EKlT2YdkXOFx_74Hyxd6_ZjTW1qmTOeZo1eZ4WkhepqK7XtMzqqhKyKHklWcK0c3OxNx8wpA7sBHaGLtQzFKrXw1IiPLtl58vlnPOs4gmDz3EFRRmBNR045LDgTLAyMmuMT1rTQ-IezkO_fk5hnnbSQ2Mw2M5Lw-3cwxBefG28aaWl12YQ9kHadtp5AoRSRNfCy_YNOvBA-B2oL4xK_CpRe9eSdj8z0rueaK3zwgeH_5M4I0Bpoz5I-2wO1DcGqtXesi1wP_R1gyPHGxp5eQ7ijgBFjhpFixpFi5pGi0i2ulMWBgJ7Mx08NpmPMJqK6MH6_vWgvIiqv5o8V8S-fwBDljskfQMAAA.CmGJW9FD-BM_Js_hCQIbBMR3Oa6H-bLvP3hrr-Pr1I8XpBOcl8YlLRD-R_8d9951cyw53j93lGMm6xz2kpe04w',
        role: 'user',
        resources:
          'home,system.user.info,system.user.list,system.user.add,system.user.get,system.user.role.list,system.user.status,system.role.list,system.role.add,system.role.get,system.role.resource.list,system.role.status,system.dictionary.list,system.dictionary.get,system.dictionary.batchDelete,system.dictionary.get,system.dictionary.delete,system.dictionary.status,root,system,system.user,system.role,system.dictionary',
      });
      return;
    }
    res.send({
      status: 'error',
      data: {},
      type,
    });
  },
  'POst /api/v1/logout': (req, res) => {
    res.send({ code: 200, success: true, message: '用户登出成功。' });
  },
};
