module.exports = function (app) {
  app.use('/config.json', (_req, res) => {
    res.json({
      fm_config_api: process.env.REACT_APP_FM_CONFIG_API,
      tos: process.env.REACT_APP_TOS,
    });
  });
};
