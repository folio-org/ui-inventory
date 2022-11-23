import '../test/jest/__mock__';

import { screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { instances } from '../test/fixtures/instances';
import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import { DataContext } from './contexts';
import StripesConnectedInstance from './ConnectedInstance/StripesConnectedInstance';
import ViewInstance from './ViewInstance';

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  TitleManager: ({ children }) => <>{children}</>
}));
jest.mock('./RemoteStorageService/Check', () => ({
  ...jest.requireActual('./RemoteStorageService/Check'),
  useByLocation: jest.fn(() => false),
  useByHoldings: jest.fn(() => false),
}));

const instance = {
  ...instances[0],
  parentInstances: [],
  childInstances: [],
};

jest
  .spyOn(StripesConnectedInstance.prototype, 'instance')
  .mockImplementation(() => instance);

const defaultProps = {
  selectedInstance: instance,
  paneWidth: '44%',
  openedFromBrowse: false,
  onCopy: jest.fn(),
  onClose: jest.fn(),
  mutator: {
    allInstanceItems: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn(),
    },
    configs: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn(),
    },
    holdings: {
      POST: jest.fn(() => Promise.resolve({})),
      reset: jest.fn(),
    },
    instanceRequests: {
      GET: jest.fn(() => Promise.resolve({})),
      reset: jest.fn(),
    },
    marcRecord: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn(),
    },
    movableItems: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn(),
    },
    query: {},
  },
};

const referenceData = {
  locationsById: {},
  identifierTypesById: {},
  identifierTypesByName: {},
  statisticalCodes: [],
  classificationTypes: [],
  instanceNoteTypes: [],
  instanceRelationshipTypes: [],
  electronicAccessRelationships: [],
  contributorNameTypes: [],
  contributorTypes: [],
  identifierTypes: [],
  alternativeTitleTypes: [],
};

const queryClient = new QueryClient();

const renderViewInstance = (props = {}) => renderWithIntl(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: `/inventory/view/${instances[0].id}`,
      }]}
    >
      <DataContext.Provider value={referenceData}>
        <ViewInstance
          {...defaultProps}
          {...props}
        />
      </DataContext.Provider>
    </MemoryRouter>
  </QueryClientProvider>,
  translationsProperties
);

describe('ViewInstance', () => {
  beforeEach(() => {
    // defaultProps.history.push.mockClear();
  });

  describe('Action menu', () => {
    it('should display action menu items', async () => {
      renderViewInstance();

      expect(screen.getByText('Move items within an instance')).toBeInTheDocument();
      expect(screen.getByText('Move holdings/items to another instance')).toBeInTheDocument();
    });

    it('should NOT display \'move\' action menu items when instance was opened from Browse page', async () => {
      renderViewInstance({ openedFromBrowse: true });

      expect(screen.queryByText('Move items within an instance')).not.toBeInTheDocument();
      expect(screen.queryByText('Move holdings/items to another instance')).not.toBeInTheDocument();
    });
  });
});
