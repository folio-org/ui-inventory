import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';

import '../../test/jest/__mock__';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import ItemView from './ItemView';

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
      }
    ],
  },
  items: {
    records: [
      {
        id: 'item1',
        status: {
          name: 'Available',
        },
        isBoundWith: true,
        boundWithTitles: [
          {
            "briefHoldingsRecord" : {
              "id" : "704ea4ec-456c-4740-852b-0814d59f7d21",
              "hrid" : "BW-1"
            },
            "briefInstance" : {
              "id" : "cd3288a4-898c-4347-a003-2d810ef70f03",
              "title" : "Elpannan och dess ekonomiska förutsättningar / av Hakon Wærn",
              "hrid" : "bwinst0001"
            },
          },
          {
            "briefHoldingsRecord" : {
              "id" : "704ea4ec-456c-4740-852b-0814d59f7d22",
              "hrid" : "BW-2"
            },
            "briefInstance" : {
              "id" : "cd3288a4-898c-4347-a003-2d810ef70f04",
              "title" : "Second Title",
              "hrid" : "bwinst0002"
            },
          },
        ],
      },
    ],
  },
  instances1: {
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
  locationsById: [],
};

const ItemViewSetup = ({
} = {}) => (
  <Router>
    <StripesContext.Provider value={stripesStub}>
      <ModuleHierarchyProvider value={['@folio/inventory']} module="inventory">
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
      renderWithIntl(
        <ItemViewSetup />      );
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

  });

});