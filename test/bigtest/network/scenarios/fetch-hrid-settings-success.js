import hridSettings from '../../mocks/hridSettings';

export default server => {
  server.get('/hrid-settings-storage/hrid-settings', hridSettings);
};
