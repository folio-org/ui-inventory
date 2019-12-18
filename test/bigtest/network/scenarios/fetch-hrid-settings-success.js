import { hridSettings } from '../../mocks';

export default server => {
  server.get('/hrid-settings-storage/hrid-settings', hridSettings);
};
