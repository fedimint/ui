module.exports = function (app) {
  app.use('/config.json', (_req, res) => {
    res.json({
      baseUrl: process.env.VITE_FM_CONFIG_API,
      tos: process.env.VITE_TOS,
    });
  });
};
