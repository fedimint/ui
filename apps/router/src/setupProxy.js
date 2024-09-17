module.exports = function (app) {
  app.get('/config.json', (req, res) => {
    if (process.env.REACT_APP_FM_CONFIG_API) {
      res.json({
        baseUrl: process.env.REACT_APP_FM_CONFIG_API,
      });
    } else if (process.env.REACT_APP_FM_GATEWAY_API) {
      res.json({
        baseUrl: process.env.REACT_APP_FM_GATEWAY_API,
      });
    }
  });
};
