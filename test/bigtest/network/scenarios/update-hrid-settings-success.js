export default server => {
  server.put('/hrid-settings-storage/hrid-settings', () => {
    return new Response(204, {}, '');
  }, 204);
};
