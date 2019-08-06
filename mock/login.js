// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /api/v1/login': (req, res) => {
    const { password, username, type } = req.body;
    if (password === '123456' && username === 'admin') {
      res.send({
        code: 200,
        status: 'ok',
        data: {
          role: ['admin', 'user'],
          token:
            'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNosy0sOgzAMBNC7eE0kW-BQuI3TeBHaAiIBIVW9e81nM9I8zXxhKAl6QOywJWbXPLxFfKKTqN6RhICRUQJ7qCCvwcZr1sVKytlKmV46OpPtQinQE3ti6mriCnSfb6jbE5bprcdR4ieN8PsDAAD__w.HaHwTC4hVVn7uZjnrGruP97M349SERnRhfQsSkgbvzD-ACyHkn7067u7UI3MnXgjEMGsYJMxfesN6X3NTL8zAQ',
        },
        type,
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        code: 200,
        status: 'ok',
        data: {
          role: ['user'],
          token:
            'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNosy0sOgzAMBNC7eE0kW-BQuI3TeBHaAiIBIVW9e81nM9I8zXxhKAl6QOywJWbXPLxFfKKTqN6RhICRUQJ7qCCvwcZr1sVKytlKmV46OpPtQinQE3ti6mriCnSfb6jbE5bprcdR4ieN8PsDAAD__w.HaHwTC4hVVn7uZjnrGruP97M349SERnRhfQsSkgbvzD-ACyHkn7067u7UI3MnXgjEMGsYJMxfesN6X3NTL8zAQ',
        },
        type,
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
