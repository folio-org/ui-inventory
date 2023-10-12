import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import '../test/jest/__mock__';

import {
  screen,
  waitFor,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useStripes,
  checkIfUserInMemberTenant,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';

import { instances } from '../test/fixtures/instances';
import { DataContext } from './contexts';
import StripesConnectedInstance from './ConnectedInstance/StripesConnectedInstance';

import ViewInstance from './ViewInstance';
import { CONSORTIUM_PREFIX } from './constants';

import {
  renderWithIntl,
  translationsProperties,
} from '../test/jest/helpers';

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
jest.mock('./common/hooks', () => ({
  ...jest.requireActual('./common/hooks'),
  useTenantKy: jest.fn(),
}));

const spyOncollapseAllSections = jest.spyOn(require('@folio/stripes/components'), 'collapseAllSections');
const spyOnexpandAllSections = jest.spyOn(require('@folio/stripes/components'), 'expandAllSections');

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

ConfirmationModal.mockImplementation(({
  open,
  onCancel,
  onConfirm,
}) => (open ? (
  <div>
    <span>Confirmation modal</span>
    <button
      type="button"
      onClick={onCancel}
    >
      Cancel
    </button>
    <button
      type="button"
      id="confirmButton"
      onClick={onConfirm}
    >
      Confirm
    </button>
  </div>
) : null));

const goToMock = jest.fn();
const mockReset = jest.fn();
const updateMock = jest.fn();
const mockonClose = jest.fn();
const mockData = jest.fn().mockResolvedValue(true);
const mockStripes = {
  connect: jest.fn(),
  hasInterface: jest.fn().mockReturnValue(true),
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'Testlocale',
  logger: {
    log: jest.fn()
  },
  okapi: { tenant: 'diku' },
  user: { user: {} },
};
const defaultProp = {
  centralTenantPermissions: [],
  selectedInstance: instance,
  centralTenantId: 'centralTenantId',
  consortiumId: 'consortiumId',
  refetchInstance: jest.fn(),
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
    },
    shareInstance: {
      POST: jest.fn(),
      GET: jest.fn(() => Promise.resolve({ sharingInstances: [{ status: 'COMPLETE' }] })),
    },
  },
  onClose: mockonClose,
  onCopy: jest.fn(),
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
          value: '{"titleLevelRequestsFeatureEnabled": true}',
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
  stripes: mockStripes,
  okapi: { tenant: 'memberTenant' },
  tagsEnabled: true,
  updateLocation: jest.fn(),
  isShared: false,
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
  translationsProperties,
);

const checkActionItemExists = (actionItemName) => {
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

  expect(screen.getByRole('button', { name: actionItemName })).toBeInTheDocument();
};

describe('ViewInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StripesConnectedInstance.prototype.instance.mockImplementation(() => instance);
    checkIfUserInCentralTenant.mockReturnValue(false);
    useStripes().hasInterface.mockReturnValue(true);
  });
  it('should display action menu items', () => {
    renderViewInstance();
    expect(screen.getByText('Move items within an instance')).toBeInTheDocument();
    expect(screen.getByText('Move holdings/items to another instance')).toBeInTheDocument();
  });
  it('should display \'move\' action menu items when instance was opened from Browse page', () => {
    renderViewInstance();
    expect(screen.queryByText('Move items within an instance')).toBeInTheDocument();
    expect(screen.queryByText('Move holdings/items to another instance')).toBeInTheDocument();
  });
  describe('instance header', () => {
    describe('for non-consortia users', () => {
      it('should render instance title, publisher, and publication date', () => {
        useStripes().hasInterface.mockReturnValue(false);

        const { getByText } = renderViewInstance();
        const expectedTitle = 'Instance • #youthaction • Information Age Publishing, Inc. • 2015';

        expect(getByText(expectedTitle)).toBeInTheDocument();
      });
    });

    describe('for consortia central tenant', () => {
      it('should render instance shared, title, publisher, and publication date for all instances', () => {
        defaultProp.stripes.hasInterface.mockReturnValue(true);

        const { getByText } = renderViewInstance({ isShared: true });
        const expectedTitle = 'Shared instance • #youthaction • Information Age Publishing, Inc. • 2015';

        expect(getByText(expectedTitle)).toBeInTheDocument();
      });
    });

    describe('for member library tenant', () => {
      describe('local instance', () => {
        it('should render instance local, title, publisher, and publication date', () => {
          const { getByText } = renderViewInstance({ isShared: false });
          const expectedTitle = 'Local instance • #youthaction • Information Age Publishing, Inc. • 2015';

          expect(getByText(expectedTitle)).toBeInTheDocument();
        });
      });

      describe('shared instance', () => {
        it('should render instance shared, title, publisher, and publication date', () => {
          const selectedInstance = {
            ...instance,
            shared: true,
            source: 'FOLIO',
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => selectedInstance);

          const { getByText } = renderViewInstance({ selectedInstance, isShared: true });
          const expectedTitle = 'Shared instance • #youthaction • Information Age Publishing, Inc. • 2015';

          expect(getByText(expectedTitle)).toBeInTheDocument();
        });
      });

      describe('shadow copy of instance', () => {
        it('should render instance shared, title, publisher, and publication date', () => {
          const selectedInstance = {
            ...instance,
            source: 'CONSORTIUM-FOLIO',
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => selectedInstance);

          const { getByText } = renderViewInstance({ selectedInstance, isShared: false });
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

    describe('"Edit instance" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Edit instance');
      });

      it('"onClickEditInstance" should be called when the user clicks the "Edit instance" button', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Edit instance' }));
        expect(mockPush).toBeCalled();
      });
    });
    describe('"View source" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('View source');
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
    });
    describe('"Move items within an instance" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Move items within an instance');
      });

      it('"Move items within an instance" button to be clicked', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Move items within an instance' }));
        expect(renderViewInstance()).toBeTruthy();
      });

      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };
          checkIfUserInCentralTenant.mockClear().mockReturnValue(true);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Move items within an instance' })).not.toBeInTheDocument();
        });
      });
    });
    describe('"Move holdings/items to another instance" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Move holdings/items to another instance');
      });

      it('"InstancePlugin" should render when user clicks "Move holdings/items to another instance" button', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Move holdings/items to another instance' }));
        expect(screen.getByRole('button', { name: '+' }));
      });

      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };
          checkIfUserInCentralTenant.mockClear().mockReturnValue(true);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Move holdings/items to another instance' })).not.toBeInTheDocument();
        });
      });
    });
    describe('"Overlay source bibliographic record" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Overlay source bibliographic record');
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
    });
    describe('"Duplicate instance" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Duplicate instance');
      });

      it('"onCopy" function should be called when the user clicks the "Duplicate instance" button', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Duplicate instance' }));
        expect(defaultProp.onCopy).toBeCalled();
      });
    });
    describe('"Share local instance" action item', () => {
      describe('when user is in non-consortium env', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            hasInterface: jest.fn().mockReturnValue(false),
          };
          checkIfUserInMemberTenant.mockClear().mockReturnValue(false);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Share local instance' })).not.toBeInTheDocument();
        });
      });
      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };
          checkIfUserInMemberTenant.mockClear().mockReturnValue(false);
          checkIfUserInCentralTenant.mockClear().mockReturnValue(true);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Share local instance' })).not.toBeInTheDocument();
        });
      });
      describe('when user is in member tenant', () => {
        describe('and instance is shared', () => {
          it('should be hidden', () => {
            checkIfUserInMemberTenant.mockClear().mockReturnValue(true);

            renderViewInstance({ isShared: true });
            fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

            expect(screen.queryByRole('button', { name: 'Share local instance' })).not.toBeInTheDocument();
          });
        });
        describe('and instance is shadow copy', () => {
          it('should be hidden', () => {
            checkIfUserInMemberTenant.mockClear().mockReturnValue(true);
            StripesConnectedInstance.prototype.instance.mockImplementation(() => ({
              ...instance,
              source: 'CONSORTIUM-FOLIO',
            }));

            renderViewInstance();
            fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

            expect(screen.queryByRole('button', { name: 'Share local instance' })).not.toBeInTheDocument();
          });
        });
        describe('and instance is local', () => {
          it('should be visible', () => {
            checkIfUserInMemberTenant.mockClear().mockReturnValue(true);

            renderViewInstance();
            fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

            expect(screen.getByRole('button', { name: 'Share local instance' })).toBeInTheDocument();
          });
        });
      });

      describe('when clicking Share local instance', () => {
        describe('and it has no linked MARC Authorities', () => {
          it('should show confirmation modal', () => {
            checkIfUserInMemberTenant.mockClear().mockReturnValue(true);

            renderViewInstance();
            fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
            fireEvent.click(screen.getByRole('button', { name: 'Share local instance' }));

            expect(screen.getByText('Confirmation modal')).toBeInTheDocument();
          });
        });

        describe('when confirming', () => {
          describe('and it has linked MARC Authorities', () => {
            beforeEach(() => {
              defaultProp.mutator.shareInstance.POST.mockResolvedValue({});
              checkIfUserInMemberTenant.mockClear().mockReturnValue(true);

              renderViewInstance({
                selectedInstance: {
                  ...instances[0],
                  alternativeTitles: [{
                    alternativeTitleTypeId: 'fe19bae4-da28-472b-be90-d442e2428ead',
                    alternativeTitle: 'Hashtag youthaction',
                    authorityId: 'testAuthorityId'
                  }],
                }
              });
            });

            it('should render unlink local MARC Authorities modal', () => {
              fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
              fireEvent.click(screen.getByRole('button', { name: 'Share local instance' }));
              fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

              expect(screen.getByText('Confirmation modal')).toBeInTheDocument();
            });

            describe('when proceed sharing', () => {
              it('should make POST request to share local instance', () => {
                fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
                fireEvent.click(screen.getByRole('button', { name: 'Share local instance' }));
                fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
                fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

                expect(defaultProp.mutator.shareInstance.POST).toHaveBeenCalled();
              });
            });

            describe('when cancel sharing', () => {
              it('should hide confirmation modal', () => {
                fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
                fireEvent.click(screen.getByRole('button', { name: 'Share local instance' }));
                fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
                fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

                expect(screen.queryByText('Confirmation modal')).not.toBeInTheDocument();
              });
            });
          });
        });
      });
    });
    describe('"Export instance (MARC)" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Export instance (MARC)');
      });

      it('"Export instance (MARC)" button to be clicked', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Export instance (MARC)' }));
        expect(renderViewInstance()).toBeTruthy();
      });
    });
    describe('"New order" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('New order');
      });

      it('NewOrderModal should render when the user clicks the new order button', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'New order' }));
        expect(screen.queryByText(/Create order/i)).toBeInTheDocument();
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

      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };
          checkIfUserInCentralTenant.mockClear().mockReturnValue(true);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'New order' })).not.toBeInTheDocument();
        });
      });
    });
    describe('"View requests" action item', () => {
      beforeEach(() => {
        const configsRequest = {
          hasLoaded: true,
          records: [
            {
              value: '{"titleLevelRequestsFeatureEnabled": false}',
            },
          ]
        };

        renderViewInstance({
          resources: {
            ...defaultProp.resources,
            configs: configsRequest,
          }
        });
      });

      it('should be rendered when "titleLevelRequestsFeatureEnabled" from config is false', () => {
        checkActionItemExists('View requests');
      });

      it('"onClickViewRequests" should be called when the user clicks the "View requests" button', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'View requests' }));
        expect(mockPush).toBeCalled();
      });

      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };

          renderViewInstance({ stripes });

          expect(screen.queryByRole('button', { name: 'View requests' })).not.toBeInTheDocument();
        });
      });
    });
    describe('"New request" action item', () => {
      it('should be rendered when "titleLevelRequestsFeatureEnabled" from config is true', () => {
        const configsRequest = {
          hasLoaded: true,
          records: [
            {
              value: '{"titleLevelRequestsFeatureEnabled": true}',
            },
          ]
        };

        renderViewInstance({
          resources: {
            ...defaultProp.resources,
            configs: configsRequest,
          }
        });
        checkActionItemExists('New request');
      });
    });
    describe('"Edit MARC bibliographic record" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Edit MARC bibliographic record');
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
            shared: true,
            tenantId: 'tenantId',
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => sharedInstance);

          renderViewInstance({
            centralTenantPermissions: [{
              permissionName: 'ui-quick-marc.quick-marc-editor.all',
            }],
            isShared: true,
            tenantId: 'tenantId',
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
            shared: true,
            tenantId: 'tenantId',
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => sharedInstance);

          renderViewInstance({
            centralTenantPermissions: [],
            isShared: true,
            tenantId: 'tenantId',
          });

          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Edit MARC bibliographic record' })).not.toBeInTheDocument();
        });
      });
      describe('when user is in member tenant and record is not shared', () => {
        it('should see "Edit MARC bibliographic record" action', () => {
          renderViewInstance({ isShared: false });

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
            isShared: true,
            tenantId: 'tenantId',
          });

          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.getByRole('button', { name: 'Edit MARC bibliographic record' })).toBeVisible();
        });
      });
    });
    describe('"Derive new MARC bibliographic record" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Derive new MARC bibliographic record');
      });

      it('push function should be called when the user clicks the "Derive new MARC bibliographic record" button', async () => {
        renderViewInstance({ isShared: false });
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

      describe('when a user derives a shared record', () => {
        it('should append the `shared` search parameter', async () => {
          const newInstance = {
            ...instance,
            source: `${CONSORTIUM_PREFIX}MARC`,
            shared: true,
            tenantId: 'tenantId',
          };
          StripesConnectedInstance.prototype.instance.mockImplementation(() => newInstance);

          renderViewInstance({ isShared: true });

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
    describe('"Add MARC holdings record" action item', () => {
      it('should be rendered', () => {
        renderViewInstance();
        checkActionItemExists('Add MARC holdings record');
      });

      it('"createHoldingsMarc" should be called when the user clicks the "Add MARC holdings record" button', () => {
        renderViewInstance();
        fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add MARC holdings record' }));
        expect(mockPush).toBeCalled();
      });

      describe('when user is in central tenant', () => {
        it('should be hidden', () => {
          const stripes = {
            ...defaultProp.stripes,
            okapi: { tenant: 'consortium' },
            user: { user: { consortium: { centralTenantId: 'consortium' } } },
          };
          checkIfUserInCentralTenant.mockClear().mockReturnValue(true);

          renderViewInstance({ stripes });
          fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

          expect(screen.queryByRole('button', { name: 'Add MARC holdings record' })).not.toBeInTheDocument();
        });
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
