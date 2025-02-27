import { coreEvents } from '@folio/stripes/core';

import InventoryRouting from './index';
import { removeItem } from './storage';
import { EVENTS } from './constants';

jest.mock('./storage');

jest.mock('@folio/service-interaction', () => ({
  NumberGeneratorModalButton: () => <div>NumberGeneratorModalButton</div>
}));

const searchTermsExpectations = () => {
  expect(removeItem).toHaveBeenNthCalledWith(1, '@folio/inventory/search.instances.lastSearch');
  expect(removeItem).toHaveBeenNthCalledWith(2, '@folio/inventory/search.holdings.lastSearch');
  expect(removeItem).toHaveBeenNthCalledWith(3, '@folio/inventory/search.items.lastSearch');
  expect(removeItem).toHaveBeenNthCalledWith(4, '@folio/inventory/browse.lastSearch');
  expect(removeItem).toHaveBeenNthCalledWith(5, '@folio/inventory/search.instances.lastOffset');
  expect(removeItem).toHaveBeenNthCalledWith(6, '@folio/inventory/search.holdings.lastOffset');
  expect(removeItem).toHaveBeenNthCalledWith(7, '@folio/inventory/search.items.lastOffset');
  expect(removeItem).toHaveBeenNthCalledWith(8, '@folio/inventory/browse.lastOffset');
};

describe('InventoryRouting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when the user logs in', () => {
    it('should reset search terms in session storage', () => {
      InventoryRouting.eventHandler(coreEvents.LOGIN);
      searchTermsExpectations();
    });
  });

  describe('when the user switch affiliation', () => {
    it('should reset search terms in session storage', () => {
      InventoryRouting.eventHandler(EVENTS.SWITCH_ACTIVE_AFFILIATION);
      searchTermsExpectations();
    });
  });
});
