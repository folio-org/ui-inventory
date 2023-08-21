import '../test/jest/__mock__';
import React from 'react';
import { screen, waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useStripes } from '@folio/stripes/core';
import { instances } from '../test/fixtures/instances';
import { DataContext } from './contexts';
import StripesConnectedInstance from './ConnectedInstance/StripesConnectedInstance';
import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewInstance from './ViewInstance';
import { CONSORTIUM_PREFIX } from './constants';

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

jest.mock('./components/ImportRecordModal/ImportRecordModal', () => (props) => {
  const { isOpen, handleSubmit, handleCancel } = props;
  if (isOpen) {
    const args = {
      externalIdentifierType: 'typeTest',
      externalIdentifier: 'externalIdentifier',
      selectedJobProfileId: 'profileId'
    };
    const container =
      <div>
        <div>ImportRecordModal</div>
        <button type="button" onClick={() => handleSubmit(args)}>handleSubmit</button>
        <button type="button" onClick={() => handleCancel()}>handleCancel</button>
      </div>;
    return container;
  }
  return null;
});
jest.mock('./components/InstancePlugin/InstancePlugin', () => ({ onSelect, onClose }) => {
  return (
    <div>
      <div>InstancePlugin</div>
      <button type="button" onClick={() => onSelect()}>onSelect</button>
      <button type="button" onClick={() => onClose()}>onClose</button>
    </div>
  );
});
jest.mock('./RemoteStorageService/Check', () => ({
  ...jest.requireActual('./RemoteStorageService/Check'),
  useByLocation: jest.fn(() => false),
  useByHoldings: jest.fn(() => false),
}));

const location = {
  pathname: '/testPathName',
  search: '?filters=test1&query=test2&sort=test3&qindex=test',
  hash: ''
};
const mockPush = jest.fn();
const mockReplace = jest.fn();
const history = createMemoryHistory();
history.location = location;
history.push = mockPush;
history.replace = mockReplace;
const instance = {
  ...instances[0],
  subjects:['Information society--Political aspects'],
  parentInstances: [],
  childInstances: [],
};

jest
  .spyOn(StripesConnectedInstance.prototype, 'instance')
  .mockImplementation(() => instance)
  .mockImplementationOnce(() => {});

const goToMock = jest.fn();
const mockReset = jest.fn();
const updateMock = jest.fn();
const mockonClose = jest.fn();
const mockData = jest.fn().mockResolvedValue(true);
const defaultProp = {
  centralTenantPermissions: [],
  selectedInstance: instance,
  goTo: goToMock,
  match: {
    path: '/inventory/view',
    params: {
      id: 'testId'
    },
  },
  intl: {
    formatMessage: jest.fn(),
  },
  isCentralTenantPermissionsLoading: false,
  mutator: {
    allInstanceItems: {
      reset: mockReset
    },
    holdings: {
      POST: jest.fn(),
    },
    marcRecord: {
      GET: mockData,
    },
    quickExport:{
      POST: jest.fn(),
    },
    query: {
      update: updateMock,
    },
    movableItems: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn(),
    },
    instanceRequests: {
      GET: jest.fn(() => Promise.resolve([])),
      reset: jest.fn()
    }
  },
  onClose: mockonClose,
  onCopy: jest.fn(),
  openedFromBrowse: false,
  paneWidth: '55%',
  resources: {
    allInstanceItems: {
      reset: mockReset
    },
    allInstanceHoldings: {},
    locations: {},
    configs: {
      hasLoaded: true,
      records: [
        {
          value: 'testParse'
        },
      ]
    },
    instanceRequests: {
      other: {
        totalRecords: 10,
      },
      records: [
        {
          id: 'testIdRecord1'
        }
      ],
    },
  },
  stripes: {
    connect: jest.fn(),
    hasInterface: jest.fn().mockReturnValue(true),
    hasPerm: jest.fn().mockReturnValue(true),
    locale: 'Testlocale',
    logger: {
      log: jest.fn()
    },
    okapi: { tenant: 'diku' },
    user: { user: {} },
  },
  tagsEnabled: true,
  updateLocation: jest.fn(),
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
    <Router
      history={history}
      initialEntries={[{
        pathname: `/inventory/view/${instances[0].id}`,
      }]}
    >
      <DataContext.Provider value={referenceData}>
        <ViewInstance
          {...defaultProp}
          {...props}
        />
      </DataContext.Provider>
    </Router>
  </QueryClientProvider>,
  translationsProperties
);

describe('ViewInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StripesConnectedInstance.prototype.instance.mockImplementation(() => instance);
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
  describe('instance header', () => {
    describe('for non-consortia users', () => {
      it('should render instance title, publisher, and publication date', () => {
        defaultProp.stripes.hasInterface.mockReturnValue(false);

        const { getByText } = renderViewInstance();
        const expectedTitle = 'Instance • #youthaction • Information Age Publishing, Inc. • 2015';

        expect(getByText(expectedTitle)).toBeInTheDocument();
      });
    });

    describe('for consortia central tenant', () => {
      it('should render instance shared, title, publisher, and publication date for all instances', () => {
        defaultProp.stripes.hasInterface.mockReturnValue(true);
        const stripes = {
          ...defaultProp.stripes,
          okapi: { tenant: 'consortium' },
          user: { user: { consortium: { centralTenantId: 'consortium' } } },
        };

        const { getByText } = renderViewInstance({ stripes });
        const expectedTitle = 'Shared instance • #youthaction • Information Age Publishing, Inc. • 2015';

        expect(getByText(expectedTitle)).toBeInTheDocument();
      });
    });

    describe('for member library tenant', () => {
      const stripes = {
        ...defaultProp.stripes,
        okapi: { tenant: 'university' },
        user: { user: { consortium: { centralTenantId: 'consortium' } } },
      };

      describe('local instance', () => {
        it('should render instance local, title, publisher, and publication date', () => {
          const { getByText } = renderViewInstance({ stripes });
          const expectedTitle = 'Local instance • #youthaction • Information Age Publishing, Inc. • 2015';

          expect(getByText(expectedTitle)).toBeInTheDocument();
        });
      });

      describe('shadow instance', () => {
        it('should render instance shared, title, publisher, and publication date', () => {
          const selectedInstance = {
            ...instance,
            source: 'CONSORTIUM-FOLIO'
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => selectedInstance);

          const { getByText } = renderViewInstance({ stripes, selectedInstance });
          const expectedTitle = 'Shared instance • #youthaction • Information Age Publishing, Inc. • 2015';

          expect(getByText(expectedTitle)).toBeInTheDocument();
        });
      });
    });
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
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Edit instance' }));
      expect(mockPush).toBeCalled();
    });
    it('"onClickViewRequests" should be called when the user clicks the "View requests" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'View requests' }));
      expect(mockPush).toBeCalled();
    });
    it('"onCopy" function should be called when the user clicks the "Duplicate instance" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Duplicate instance' }));
      expect(defaultProp.onCopy).toBeCalled();
    });
    it('"handleViewSource" should be called when the user clicks the "View source" button', async () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const veiwSourceButton = screen.getByRole('button', { name: 'View source' });
      await waitFor(() => {
        expect(veiwSourceButton).not.toHaveAttribute('disabled');
      });
      fireEvent.click(veiwSourceButton);
      expect(goToMock).toBeCalled();
    }, 10000);
    it('"createHoldingsMarc" should be called when the user clicks the "Add MARC holdings record" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Add MARC holdings record' }));
      expect(mockPush).toBeCalled();
    });
    it('"Move items within an instance" button to be clicked', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Move items within an instance' }));
      expect(renderViewInstance()).toBeTruthy();
    });
    it('"Export instance (MARC)" button to be clicked', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Export instance (MARC)' }));
      expect(renderViewInstance()).toBeTruthy();
    });
    it('"InstancePlugin" should render when user clicks "Move holdings/items to another instance" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Move holdings/items to another instance' }));
      expect(screen.getByRole('button', { name: '+' }));
    });
    it('"ImportRecordModal" component should render when user clicks "Overlay source bibliographic record" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      expect(screen.getByText('ImportRecordModal')).toBeInTheDocument();
    });
    it('"handleImportRecordModalSubmit" should be called when the user clicks the "handleSubmit" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      fireEvent.click(screen.getByRole('button', { name: 'handleSubmit' }));
      expect(updateMock).toBeCalled();
    });
    it('"ImportRecordModal" component should be closed when the user clicks "handleClose" button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'Overlay source bibliographic record' }));
      fireEvent.click(screen.getByRole('button', { name: 'handleCancel' }));
      expect(screen.queryByText('ImportRecordModal')).not.toBeInTheDocument();
    });
    it('NewOrderModal should render when the user clicks the new order button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'New order' }));
      expect(screen.queryByText(/Create order/i)).toBeInTheDocument();
    });
    it('push function should be called when the user clicks the "Edit MARC bibliographic record" button', async () => {
      renderViewInstance();
      const expectedValue = {
        pathname: `/inventory/quick-marc/edit-bib/${defaultProp.selectedInstance.id}`,
        search: 'filters=test1&query=test2&sort=test3&qindex=test&shared=false',
      };
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const button = screen.getByRole('button', { name: 'Edit MARC bibliographic record' });
      await waitFor(() => {
        expect(button).not.toHaveAttribute('disabled');
      });
      fireEvent.click(button);
      expect(mockPush).toBeCalledWith(expectedValue);
    });

    describe('when user is in member tenant and record is shared and central tenant has permission to edit marc bib record', () => {
      it('should see "Edit MARC bibliographic record" action', async () => {
        const sharedInstance = {
          ...instance,
          source: `${CONSORTIUM_PREFIX}MARC`,
        };
        StripesConnectedInstance.prototype.instance.mockImplementation(() => sharedInstance);

        renderViewInstance({
          centralTenantPermissions: [{
            permissionName: 'ui-quick-marc.quick-marc-editor.all',
          }],
        });

        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

        expect(screen.getByRole('button', { name: 'Edit MARC bibliographic record' })).toBeVisible();
      });
    });

    describe('when user is in member tenant and record is shared and central tenant has not permission to edit the marc bib record', () => {
      it('should not see "Edit MARC bibliographic record" action', () => {
        const sharedInstance = {
          ...instance,
          source: `${CONSORTIUM_PREFIX}MARC`,
        };
        StripesConnectedInstance.prototype.instance.mockImplementation(() => sharedInstance);

        renderViewInstance({
          centralTenantPermissions: [],
        });

        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

        expect(screen.queryByRole('button', { name: 'Edit MARC bibliographic record' })).not.toBeInTheDocument();
      });
    });

    describe('when user is in member tenant and record is not shared', () => {
      it('should see "Edit MARC bibliographic record" action', () => {
        renderViewInstance();

        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

        expect(screen.getByRole('button', { name: 'Edit MARC bibliographic record' })).toBeVisible();
      });
    });

    describe('when user is in central tenant and there is permission to edit the marc bib record', () => {
      it('should see "Edit MARC bibliographic record" action', () => {
        const stripes = {
          ...defaultProp.stripes,
          okapi: { tenant: 'consortium' },
          user: { user: { consortium: { centralTenantId: 'consortium' } } },
        };

        renderViewInstance({
          centralTenantPermissions: [{
            permissionName: 'ui-quick-marc.quick-marc-editor.all',
          }],
          stripes,
        });

        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

        expect(screen.getByRole('button', { name: 'Edit MARC bibliographic record' })).toBeVisible();
      });
    });

    it('push function should be called when the user clicks the "Derive new MARC bibliographic record" button', async () => {
      renderViewInstance();
      const expectedValue = {
        pathname: `/inventory/quick-marc/duplicate-bib/${defaultProp.selectedInstance.id}`,
        search: 'filters=test1&query=test2&sort=test3&qindex=test&shared=false',
      };
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      const button = screen.getByRole('button', { name: 'Derive new MARC bibliographic record' });
      await waitFor(() => {
        expect(button).not.toHaveAttribute('disabled');
      });
      fireEvent.click(button);
      expect(mockPush).toBeCalledWith(expectedValue);
    });
    it('NewOrderModal should be closed when the user clicks the close button', async () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
      fireEvent.click(screen.getByRole('button', { name: 'New order' }));
      expect(screen.queryByText(/Create order/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitFor(() => {
        expect(screen.queryByText(/Create order/i)).not.toBeInTheDocument();
      });
    }, 10000);
    describe('when a user derives a shared record', () => {
      it('should append the `shared` search parameter', async () => {
        const newInstance = {
          ...instance,
          source: `${CONSORTIUM_PREFIX}MARC`,
        };
        StripesConnectedInstance.prototype.instance.mockImplementation(() => newInstance);

        renderViewInstance();

        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        const button = screen.getByRole('button', { name: 'Derive new MARC bibliographic record' });
        await waitFor(() => {
          expect(button).not.toHaveAttribute('disabled');
        });
        fireEvent.click(button);

        expect(mockPush).toBeCalledWith(expect.objectContaining({
          search: expect.stringContaining('shared=true'),
        }));
      });
    });
  });
  describe('Tests for shortcut of HasCommand', () => {
    it('updateLocation function to be triggered on clicking new button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'new' }));
      expect(defaultProp.updateLocation).toBeCalled();
    });
    it('onClickEditInstance function to be triggered on clicking edit button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'edit' }));
      expect(mockPush).toBeCalled();
    });
    it('onCopy function to be triggered on clicking duplicateRecord button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'duplicateRecord' }));
      expect(defaultProp.onCopy).toBeCalled();
    });
    it('collapseAllSections triggered on clicking collapseAllSections button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'collapseAllSections' }));
      expect(spyOncollapseAllSections).toBeCalled();
    });
    it('expandAllSections triggered on clicking expandAllSections button', () => {
      renderViewInstance();
      fireEvent.click(screen.getByRole('button', { name: 'expandAllSections' }));
      expect(spyOnexpandAllSections).toBeCalled();
    });
  });
});
