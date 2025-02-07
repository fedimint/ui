module.exports = function (app) {
  app.get('/config.json', (req, res) => {
    if (import.meta.env.VITE_FM_CONFIG_API) {
      res.json({
        baseUrl: import.meta.env.VITE_FM_CONFIG_API,
      });
    } else if (import.meta.env.VITE_FM_GATEWAY_API) {
      res.json({
        baseUrl: import.meta.env.VITE_FM_GATEWAY_API,
      });
    }
  });
};
