import '../test/jest/__mock__';

import { screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
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
    jest.clearAllMocks();
  });
  it('should display action menu items', () => {
    renderViewInstance();
    expect(screen.getByText('Move items within an instance')).toBeInTheDocument();
    expect(screen.getByText('Move holdings/items to another instance')).toBeInTheDocument();
  });
  it('should NOT display \'move\' action menu items when instance was opened from Browse page', () => {
    renderViewInstance({ openedFromBrowse: true });
    expect(screen.queryByText('Move items within an instance')).not.toBeInTheDocument();
    expect(screen.queryByText('Move holdings/items to another instance')).not.toBeInTheDocument();
  });
  describe('Action Menu', () => {
    it('should not be displayed', () => {
      const stripes = useStripes();
      stripes.hasPerm.mockImplementationOnce(() => false);
      stripes.hasInterface.mockImplementationOnce(() => false);

      renderViewInstance({
        stripes: {
          ...defaultProp.stripes,
          hasInterface: jest.fn().mockReturnValue(false),
          hasPerm: jest.fn().mockReturnValue(false),
        },
        resources: {
          ...defaultProp.resources,
          configs: {
            ...defaultProp.resources.configs,
            records: [{ value: JSON.stringify({ titleLevelRequestsFeatureEnabled: true }) }],
          },
        },
      });
      expect(screen.queryByRole('button', { name: 'Actions' })).not.toBeInTheDocument();
    });
    it('"onClickEditInstance" should be called when the user clicks the "Edit instance" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Edit instance' }));
      expect(mockPush).toBeCalled();
    });
    it('"onClickViewRequests" should be called when the user clicks the "View requests" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'View requests' }));
      expect(mockPush).toBeCalled();
    });
    it('"onCopy" function should be called when the user clicks the "Duplicate instance" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Duplicate instance' }));
      expect(defaultProp.onCopy).toBeCalled();
    });
    it('"handleViewSource" should be called when the user clicks the "View source" button', async () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const veiwSourceButton = screen.getByRole('button', { name: 'View source' });
      await waitFor(() => {
        expect(veiwSourceButton).not.toHaveAttribute('disabled');
      });
      userEvent.click(veiwSourceButton);
      expect(goToMock).toBeCalled();
    });
    it('"createHoldingsMarc" should be called when the user clicks the "Add MARC holdings record" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Add MARC holdings record' }));
      expect(mockPush).toBeCalled();
    });
    it('"Move items within an instance" button to be clicked', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Move items within an instance' }));
      expect(renderViewInstance()).toBeTruthy();
    });
    it('"Export instance (MARC)" button to be clicked', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Export instance (MARC)' }));
      expect(renderViewInstance()).toBeTruthy();
    });
    it('"InstancePlugin" should render when user clicks "Move holdings/items to another instance" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Move holdings/items to another instance' }));
      expect(screen.getByRole('button', { name: '+' }));
    });
    it('"ImportRecordModal" component should render when user clicks "Overlay source bibliographic record" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      expect(screen.getByText('ImportRecordModal')).toBeInTheDocument();
    });
    it('"handleImportRecordModalSubmit" should be called when the user clicks the "handleSubmit" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      userEvent.click(screen.getByRole('button', { name: 'handleSubmit' }));
      expect(updateMock).toBeCalled();
    });
    it('"ImportRecordModal" component should be closed when the user clicks "handleClose" button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      userEvent.click(screen.getByRole('button', { name: 'handleCancel' }));
      expect(screen.queryByText('ImportRecordModal')).not.toBeInTheDocument();
    });
    it('NewOrderModal should render when the user clicks the new order button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'New order' }));
      expect(screen.queryByText(/Create order/i)).toBeInTheDocument();
    });
    it('push function should be called when the user clicks the "Edit MARC bibliographic record" button', async () => {
      renderViewInstance();
      const expectedValue = {
        pathname: `/inventory/quick-marc/edit-bib/${defaultProp.selectedInstance.id}`,
        search: 'filters=test1&query=test2&sort=test3&qindex=test'
      };
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const button = screen.getByRole('button', { name: 'Edit MARC bibliographic record' });
      await waitFor(() => {
        expect(button).not.toHaveAttribute('disabled');
      });
      userEvent.click(button);
      expect(mockPush).toBeCalledWith(expectedValue);
    });
    it('push function should be called when the user clicks the "Derive new MARC bibliographic record" button', async () => {
      renderViewInstance();
      const expectedValue = {
        pathname: `/inventory/quick-marc/duplicate-bib/${defaultProp.selectedInstance.id}`,
        search: 'filters=test1&query=test2&sort=test3&qindex=test'
      };
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const button = screen.getByRole('button', { name: 'Derive new MARC bibliographic record' });
      await waitFor(() => {
        expect(button).not.toHaveAttribute('disabled');
      });
      userEvent.click(button);
      expect(mockPush).toBeCalledWith(expectedValue);
    });
    it('NewOrderModal should be closed when the user clicks the close button', async () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      userEvent.click(screen.getByRole('button', { name: 'New order' }));
      expect(screen.queryByText(/Create order/i)).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitFor(() => {
        expect(screen.queryByText(/Create order/i)).not.toBeInTheDocument();
      });
    });
  });
  describe('Tests for shortcut of HasCommand', () => {
    it('updateLocation function to be triggered on clicking new button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'new' }));
      expect(defaultProp.updateLocation).toBeCalled();
    });
    it('onClickEditInstance function to be triggered on clicking edit button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'edit' }));
      expect(mockPush).toBeCalled();
    });
    it('onCopy function to be triggered on clicking duplicateRecord button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'duplicateRecord' }));
      expect(defaultProp.onCopy).toBeCalled();
    });
    it('collapseAllSections triggered on clicking collapseAllSections button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'collapseAllSections' }));
      expect(spyOncollapseAllSections).toBeCalled();
    });
    it('expandAllSections triggered on clicking expandAllSections button', () => {
      renderViewInstance();
      userEvent.click(screen.getByRole('button', { name: 'expandAllSections' }));
      expect(spyOnexpandAllSections).toBeCalled();
    });
  });
});
