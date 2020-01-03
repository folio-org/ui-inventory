export default server => {
  server.put('/hrid-settings-storage/hrid-settings', { errors: [{ title: 'Internal server error, e.g. due to misconfiguration' }] }, 500);
};
