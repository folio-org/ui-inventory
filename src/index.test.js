import InventoryRouting from './index';

import { coreEvents } from '@folio/stripes/core';

global.Storage.prototype.clear = jest.fn();

describe('InventoryRouting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when LOGIN event is fired', () => {
    it('should clear session storage', () => {
      InventoryRouting.eventHandler(coreEvents.LOGIN);
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('when SWITCH_ACTIVE_AFFILIATION event is fired', () => {
    it('should clear session storage', () => {
      InventoryRouting.eventHandler('SWITCH_ACTIVE_AFFILIATION');
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });
});
