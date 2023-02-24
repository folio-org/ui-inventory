import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { waitFor, screen } from '@testing-library/react';

import '../../test/jest/__mock__';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import ItemView from './ItemView';

jest.mock('../Item/ViewItem/ItemAcquisition', () => ({
  ItemAcquisition: jest.fn(() => 'ItemAcquisition'),
}));

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
};

const resources = {
  holdingsRecords: {
    records: [
      {
        permanentLocationId: 1,
        temporaryLocationId: 'inactiveLocation',
      }
    ],
  },
  itemsResource: {
    records: [
      {
        id: 'item1',
        status: {
          name: 'Available',
        },
        permanentLocation: {
          id: 'inactiveLocation',
          name: 'Location 1',
        },
        temporaryLocation: {
          id: 'inactiveLocation',
          name: 'Location 1',
        },
        effectiveLocation: {
          id: 'inactiveLocation',
          name: 'Location 1',
        },
        isBoundWith: true,
        boundWithTitles: [
          {
            'briefHoldingsRecord' : {
              'id' : '704ea4ec-456c-4740-852b-0814d59f7d21',
              'hrid' : 'BW-1',
            },
            'briefInstance' : {
              'id' : 'cd3288a4-898c-4347-a003-2d810ef70f03',
              'title' : 'Elpannan och dess ekonomiska förutsättningar / av Hakon Wærn',
              'hrid' : 'bwinst0001',
            },
          },
          {
            'briefHoldingsRecord' : {
              'id' : '704ea4ec-456c-4740-852b-0814d59f7d22',
              'hrid' : 'BW-2',
            },
            'briefInstance' : {
              'id' : 'cd3288a4-898c-4347-a003-2d810ef70f04',
              'title' : 'Second Title',
              'hrid' : 'bwinst0002',
            },
          },
        ],
      },
    ],
  },
  instanceRecords: {
    records: [
      {
        id: 1,
      }
    ],
  },
  requests: {},
  loanTypes: {},
  okapi: {},
  location: {},
};

const referenceTables = {
  itemNoteTypes: [],
  locationsById: {
    inactiveLocation: { name: 'Location 1', isActive: false },
  },
};

const ItemViewSetup = () => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <ModuleHierarchyProvider module="@folio/inventory">
        <ItemView
          onCloseViewItem={noop}
          resources={resources}
          referenceTables={referenceTables}
          stripes={stripesStub}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </Router>
);

describe('ItemView', () => {
  describe('rendering ItemView', () => {
    beforeEach(() => {
      renderWithIntl(<ItemViewSetup />);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should display a table of bound-with items', () => {
      expect(document.querySelector('#item-list-bound-with-titles')).toBeInTheDocument();
    });

    it('should list 2 bound-with items in the table', () => {
      expect(document.querySelectorAll('#item-list-bound-with-titles .mclRowContainer > [role=row]').length).toEqual(2);
    });

    it('should link to the instance view from the instance HRID', () => {
      const id = resources.itemsResource.records[0].boundWithTitles[0].briefInstance.id;
      expect(document.querySelector('#item-list-bound-with-titles a.instanceHrid'))
        .toHaveAttribute('href', '/inventory/view/' + id);
    });

    it('should link to the holdings view from the holdings HRID', () => {
      const instanceId = resources.itemsResource.records[0].boundWithTitles[0].briefInstance.id;
      const holdingsRecordId = resources.itemsResource.records[0].boundWithTitles[0].briefHoldingsRecord.id;
      expect(document.querySelector('#item-list-bound-with-titles a.holdingsRecordHrid'))
        .toHaveAttribute('href', '/inventory/view/' + instanceId + '/' + holdingsRecordId);
    });

    it('should display "inactive" by an inactive holding permanent location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=holding-permanent-location]').innerHTML;
        expect(location).toContain('ui-inventory.inactive');
      });
    });

    it('should display "inactive" by an inactive holding temporary location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=holding-temporary-location]').innerHTML;
        expect(location).toContain('ui-inventory.inactive');
      });
    });

    it('should display "inactive" by an inactive item permanent location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-permanent-location]').innerHTML;
        expect(location).toContain('ui-inventory.inactive');
      });
    });

    it('should display "inactive" by an inactive item temporary location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-temporary-location]').innerHTML;
        expect(location).toContain('ui-inventory.inactive');
      });
    });

    it('should display "inactive" by an inactive item effective location', async () => {
      await waitFor(() => {
        const location = document.querySelector('*[data-testid=item-effective-location]').innerHTML;
        expect(location).toContain('ui-inventory.inactive');
      });
    });

    it('should display the information icons', () => {
      expect(screen.getAllByTestId('info-icon-effective-call-number')[0]).toBeDefined();
      expect(screen.getAllByTestId('info-icon-shelving-order')[0]).toBeDefined();
    });
  });
});
