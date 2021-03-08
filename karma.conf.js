/** @param {import('karma').Config} config */
module.exports = config => config.set({

  client: {
    captureConsole: false,
    mocha: {
      timeout: 10000000
    },
  },
  browserDisconnectTimeout: 10000000,
  browserDisconnectTolerance: 1000,
  browserNoActivityTimeout: 10000000,
  flags: [
    '--disable-gpu',
    '--no-sandbox'
  ],
});
