/** @param {import('karma').Config} config */
module.exports = config => config.set({
  client: { captureConsole: false },
  browserDisconnectTimeout: 20000,
});
