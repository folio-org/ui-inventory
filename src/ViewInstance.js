import {
  find,
  get,
} from 'lodash';
import React, {
  createRef
} from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  AppIcon,
  IfPermission,
  IfInterface,
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Button,
  Icon,
  MenuSection,
  Callout,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import ViewHoldingsRecord from './ViewHoldingsRecord';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import InstancePlugin from './components/InstancePlugin';
import { getPublishingInfo } from './Instance/InstanceDetails/utils';
import { getDate, handleKeyCommand } from './utils';
import { indentifierTypeNames, layers } from './constants';
import { DataContext } from './contexts';

import {
  HoldingsListContainer,
  MoveItemsContext,
  InstanceDetails,
} from './Instance';
import { CalloutRenderer } from './components';

import ImportRecordModal from './components/ImportRecordModal';

class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    allInstanceHoldings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: true,
      throwErrors: false,
      params: {
        query: 'instanceId==:{id}',
        limit: '1000',
      },
      shouldRefresh: () => false,
    },
    allInstanceItems: {
      accumulate: true,
      fetch: false,
      path: 'inventory/items',
      records: 'items',
      throwErrors: false,
      type: 'okapi',
      shouldRefresh: () => false,
    },
    allInstanceRequests: {
      accumulate: true,
      fetch: false,
      path: 'circulation/requests',
      records: 'requests',
      throwErrors: false,
      type: 'okapi',
      shouldRefresh: () => false,
    },
    movableItems: {
      type: 'okapi',
      path: 'inventory/items/move',
      fetch: false,
      throwErrors: false,
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{id}/formatted?idType=INSTANCE',
      accumulate: true,
      throwErrors: false,
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations?limit=1000',
    }
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      marcRecord: null,
      findInstancePluginOpened: false,
      isItemsMovement: false,
      isImportRecordModalOpened: false,
      isCopyrightModalOpened: false,
      afterCreate: false,
    };
    this.instanceId = null;
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);

    this.calloutRef = createRef();
    this.accordionStatusRef = createRef();
  }

  componentDidMount() {
    const isMARCSource = this.isMARCSource(this.props.selectedInstance);

    if (isMARCSource) {
      this.getMARCRecord();
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedInstance: prevInstance } = prevProps;
    const { selectedInstance: instance } = this.props;
    const instanceRecordsId = instance?.id;
    const prevInstanceRecordsId = prevInstance?.id;
    const prevIsMARCSource = this.isMARCSource(prevInstance);
    const isMARCSource = this.isMARCSource(instance);
    const isViewingAnotherRecord = instanceRecordsId !== prevInstanceRecordsId;
    const recordSourceWasChanged = isMARCSource !== prevIsMARCSource;

    if (isMARCSource && (isViewingAnotherRecord || recordSourceWasChanged)) {
      this.getMARCRecord();
    }

    // component got updated after a new record was created
    if (parse(prevProps?.location?.search)?.layer === layers.CREATE &&
      !parse(this.props?.location?.search)?.layer && !this.state.afterCreate) {
      // eslint-disable-next-line
      this.setState({ afterCreate: true });
    }
  }

  componentWillUnmount() {
    this.props.mutator.allInstanceItems.reset();
  }

  isMARCSource = (instance) => {
    const instanceRecordsSource = instance?.source;

    return instanceRecordsSource === 'MARC';
  };

  getMARCRecord = () => {
    const { mutator } = this.props;
    mutator.marcRecord.GET()
      .then(data => this.setState({ marcRecord: data }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('MARC record getting ERROR: ', error);
      });
  };

  // Edit Instance Handlers
  onClickEditInstance = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/edit/${instanceId}/instance`,
      search: location.search,
    });
  };

  onClickViewRequests = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/view-requests/${instanceId}`,
      search: location.search,
    });
  };

  redirectToQuickMarcPage = (page) => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/quick-marc/${page}/${instanceId}`,
      search: location.search,
    });
  };

  editInstanceMarc = () => {
    this.redirectToQuickMarcPage('edit-bib');
  };

  duplicateInstanceMarc = () => {
    this.redirectToQuickMarcPage('duplicate-bib');
  };

  selectInstance = (selectedInstance) => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/move/${instanceId}/${selectedInstance.id}/instance`,
      search: location.search,
    });
  };

  toggleItemsMovement = () => {
    this.setState((prevState) => ({ isItemsMovement: !prevState.isItemsMovement }));
  };

  goBack = (e) => {
    if (e) e.preventDefault();

    const {
      goTo,
      match: {
        params: { id },
      },
      location: { pathname, search }
    } = this.props;

    // extract instance url
    const [path] = pathname.match(new RegExp(`(.*)${id}`));

    goTo(`${path}${search}`);
  };

  handleViewSource = (e, instance) => {
    if (e) e.preventDefault();
    const {
      location,
      goTo,
    } = this.props;
    const { marcRecord } = this.state;

    if (!marcRecord) {
      const message = (
        <FormattedMessage
          id="ui-inventory.marcSourceRecord.notFoundError"
          values={{ name: instance.title }}
        />
      );
      this.calloutRef.current.sendCallout({
        type: 'error',
        message,
      });
      return;
    }
    goTo(`${location.pathname.replace('/view/', '/viewsource/')}${location.search}`);
  };

  handleImportRecordModalSubmit = (args) => {
    this.setState({ isImportRecordModalOpened: false });
    this.props.mutator.query.update({
      _path: `/inventory/import/${this.props.match.params.id}`,
      xidtype: args.externalIdentifierType,
      xid: args.externalIdentifier,
    });
  }

  handleImportRecordModalCancel = () => {
    this.setState({ isImportRecordModalOpened: false });
  }

  toggleCopyrightModal = () => {
    this.setState(prevState => ({ isCopyrightModalOpened: !prevState.isCopyrightModalOpened }));
  };

  toggleFindInstancePlugin = () => {
    this.setState(prevState => ({ findInstancePluginOpened: !prevState.findInstancePluginOpened }));
  };

  // Get all identifiers for all records
  getIdentifiers = (data) => {
    const { identifierTypesById } = data;
    const { ISBN, ISSN } = indentifierTypeNames;
    const selectedInstance = this.props?.selectedInstance;

    if (!selectedInstance) {
      return null;
    }

    // We can't make any meaningful assessment of which is
    // the best identifier to return, so just return the first
    // we find
    for (const identifiers of selectedInstance.identifiers) {
      const { identifierTypeId, value } = identifiers;
      const ident = identifierTypesById[identifierTypeId];
      if (
        (ident?.name === ISBN ||
          ident?.name === ISSN) &&
        value
      ) {
        return { type: ident.name, value };
      }
    }
    return null;
  };

  createActionMenuGetter = instance => ({ onToggle }) => {
    const {
      onCopy,
      stripes,
      intl,
    } = this.props;
    const { marcRecord, requests } = this.state;

    const isSourceMARC = get(instance, ['source'], '') === 'MARC';
    const canEditInstance = stripes.hasPerm('ui-inventory.instance.edit');
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');
    const canMoveItems = stripes.hasPerm('ui-inventory.item.move');
    const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
    const canEditMARCRecord = stripes.hasPerm('records-editor.records.item.put');
    const canDeriveMARCRecord = stripes.hasPerm('records-editor.records.item.post');

    const canEditDeriveMARCRecord = isSourceMARC && (canEditMARCRecord || canDeriveMARCRecord);

    if (!isSourceMARC && !canEditInstance && !canCreateInstance) {
      return null;
    }

    return (
      <>
        <MenuSection label={intl.formatMessage({ id: 'ui-inventory.inventory.label' })} id="inventory-menu-section">
          <IfPermission perm="ui-inventory.instance.edit">
            <Button
              id="edit-instance"
              onClick={() => {
                onToggle();
                this.onClickEditInstance();
              }}
              buttonStyle="dropdownItem"
            >
              <Icon icon="edit">
                <FormattedMessage id="ui-inventory.editInstance" />
              </Icon>
            </Button>
          </IfPermission>
          <IfPermission perm="ui-inventory.instance.create">
            <Button
              id="copy-instance"
              onClick={() => {
                onToggle();
                onCopy(instance);
              }}
              buttonStyle="dropdownItem"
            >
              <Icon icon="duplicate">
                <FormattedMessage id="ui-inventory.duplicateInstance" />
              </Icon>
            </Button>
          </IfPermission>

          {
            canMoveItems && (
              <Button
                id="move-instance-items"
                buttonStyle="dropdownItem"
                onClick={() => {
                  onToggle();
                  this.toggleItemsMovement();
                }}
              >
                <Icon icon="transfer">
                  <FormattedMessage
                    id={`ui-inventory.moveItems.instance.actionMenu.${this.state.isItemsMovement ? 'disable' : 'enable'}`}
                  />
                </Icon>
              </Button>
            )
          }

          {
            (canMoveItems || canMoveHoldings) && (
              <Button
                id="move-instance"
                buttonStyle="dropdownItem"
                onClick={() => {
                  onToggle();
                  this.toggleFindInstancePlugin();
                }}
              >
                <Icon icon="arrow-right">
                  <FormattedMessage id="ui-inventory.moveItems" />
                </Icon>
              </Button>
            )
          }

          <IfInterface name="copycat-imports">
            <IfPermission perm="copycat.profiles.collection.get">
              <Button
                id="dropdown-clickable-reimport-record"
                onClick={() => {
                  onToggle();
                  this.setState({ isImportRecordModalOpened: true });
                }}
                buttonStyle="dropdownItem"
              >
                <Icon icon="lightning">
                  <FormattedMessage id="ui-inventory.copycat.reimport" />
                </Icon>
              </Button>
            </IfPermission>
          </IfInterface>

          {
            canEditDeriveMARCRecord && (
              <IfPermission perm="ui-inventory.instance.view">
                <Button
                  id="clickable-view-source"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={(e) => {
                    onToggle();
                    this.handleViewSource(e, instance);
                  }}
                >
                  <Icon icon="document">
                    <FormattedMessage id="ui-inventory.viewSource" />
                  </Icon>
                </Button>
              </IfPermission>
            )
          }

          <Button
            id="view-requests"
            onClick={() => {
              onToggle();
              this.onClickViewRequests();
            }}
            buttonStyle="dropdownItem"
          >
            <Icon icon="eye-open">
              <FormattedMessage
                id="ui-inventory.viewRequests"
                values={{ count: requests?.length ?? '' }}
              />
            </Icon>
          </Button>
        </MenuSection>

        {
          canEditDeriveMARCRecord && (
            <MenuSection label={intl.formatMessage({ id: 'ui-inventory.quickMARC.label' })} id="quickmarc-menu-section">
              <IfPermission perm="records-editor.records.item.put">
                <Button
                  id="edit-instance-marc"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={() => {
                    onToggle();
                    this.editInstanceMarc();
                  }}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-inventory.editInstanceMarc" />
                  </Icon>
                </Button>
              </IfPermission>

              <IfPermission perm="records-editor.records.item.post">
                <Button
                  id="duplicate-instance-marc"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={() => {
                    onToggle();
                    this.duplicateInstanceMarc();
                  }}
                >
                  <Icon icon="duplicate">
                    <FormattedMessage id="ui-inventory.duplicateInstanceMarc" />
                  </Icon>
                </Button>
              </IfPermission>
            </MenuSection>
          )
        }

        <DataContext.Consumer>
          {data => (
            <Pluggable
              id="copyright-permissions-checker"
              toggle={this.toggleCopyrightModal}
              open={this.state.isCopyrightModalOpened}
              identifier={this.getIdentifiers(data)}
              type="copyright-permissions-checker"
              renderTrigger={({ menuText }) => (
                <Button
                  id="copyright-permissions-check"
                  buttonStyle="dropdownItem"
                  onClick={() => {
                    onToggle();
                    this.toggleCopyrightModal();
                  }}
                >
                  <Icon icon="report">
                    {menuText}
                  </Icon>
                </Button>
              )}
            />
          )}
        </DataContext.Consumer>
      </>
    );
  };

  // Pane subtitle (second line) for both instance and holdings detail panes
  createSubtitle = (record) => {
    return this.props.intl.formatMessage({
      id: 'ui-inventory.instanceRecordSubtitle',
    }, {
      hrid: record?.hrid,
      updatedDate: getDate(record?.metadata?.updatedDate),
    });
  }

  render() {
    const {
      match: { params: { id, holdingsrecordid, itemid } },
      resources: { allInstanceHoldings, locations },
      stripes,
      onCopy,
      onClose,
      paneWidth,
      tagsEnabled,
      updateLocation,
    } = this.props;
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();
    const holdingsRecord = find(allInstanceHoldings.records, { id: holdingsrecordid });

    const shortcuts = [
      {
        name: 'new',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.create')) {
            updateLocation({ layer: 'create' });
          }
        }),
      },
      {
        name: 'edit',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.edit')) this.onClickEditInstance();
        }),
      },
      {
        name: 'duplicateRecord',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.create')) onCopy(instance);
        }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
    ];

    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={<FormattedMessage id="ui-inventory.edit" />}
          appIcon={<AppIcon app="inventory" iconKey="instance" />}
          dismissible
          onClose={onClose}
        >
          <div style={{ paddingTop: '1rem' }}>
            <Icon
              icon="spinner-ellipsis"
              width="100px"
            />
          </div>
        </Pane>
      );
    }

    return (
      <>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <InstanceDetails
            id="pane-instancedetails"
            paneTitle={
              <FormattedMessage
                id="ui-inventory.instanceRecordTitle"
                values={{
                  title: instance?.title,
                  publisherAndDate: getPublishingInfo(instance),
                }}
              />
            }
            paneSubtitle={this.createSubtitle(instance)}
            onClose={onClose}
            actionMenu={this.createActionMenuGetter(instance)}
            instance={instance}
            tagsEnabled={tagsEnabled}
            ref={this.accordionStatusRef}
          >
            {
              (!holdingsrecordid && !itemid) ?
                (
                  <MoveItemsContext>
                    <HoldingsListContainer
                      instance={instance}
                      draggable={this.state.isItemsMovement}
                      droppable
                    />
                  </MoveItemsContext>
                )
                :
                null
            }

            {
              (holdingsrecordid && !itemid)
                ? (
                  <this.cViewHoldingsRecord
                    id={id}
                    holdingsrecordid={holdingsrecordid}
                    onCloseViewHoldingsRecord={this.goBack}
                    paneTitle={
                      <FormattedMessage
                        id="ui-inventory.holdingsPaneTitle"
                        values={{
                          location: find(locations.records, { id: holdingsRecord?.effectiveLocationId })?.name,
                          callNumber: holdingsRecord?.callNumber,
                        }}
                      />
                    }
                    paneSubtitle={this.createSubtitle(holdingsRecord)}
                    {...this.props}
                  />
                )
                : null
            }
          </InstanceDetails>

          <Callout ref={this.calloutRef} />

          {this.state.afterCreate &&
            <CalloutRenderer
              message={<FormattedMessage id="ui-inventory.instance.successfullySaved" values={{ hrid: instance.hrid }} />}
            />
          }

          {
            this.state.findInstancePluginOpened && (
              <InstancePlugin
                onSelect={this.selectInstance}
                onClose={this.toggleFindInstancePlugin}
                withTrigger={false}
              />
            )
          }

          <IfInterface name="copycat-imports">
            <IfPermission perm="copycat.profiles.collection.get">
              <ImportRecordModal
                isOpen={this.state.isImportRecordModalOpened}
                currentExternalIdentifier={undefined}
                handleSubmit={this.handleImportRecordModalSubmit}
                handleCancel={this.handleImportRecordModalCancel}
                id={id}
              />
            </IfPermission>
          </IfInterface>
        </HasCommand>
      </>
    );
  }
}

ViewInstance.propTypes = {
  getSearchParams: PropTypes.func.isRequired,
  selectedInstance:  PropTypes.object,
  goTo: PropTypes.func.isRequired,
  getParams: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
      holdingsrecordid: PropTypes.string,
      itemid: PropTypes.string,
    }),
  }),
  history: ReactRouterPropTypes.history.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  mutator: PropTypes.shape({
    allInstanceItems: PropTypes.object.isRequired,
    allInstanceRequests: PropTypes.object.isRequired,
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
    movableItems: PropTypes.object.isRequired,
  }),
  okapi: PropTypes.object,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  resources: PropTypes.shape({
    allInstanceItems: PropTypes.object.isRequired,
    allInstanceHoldings: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  tagsEnabled: PropTypes.bool,
  updateLocation: PropTypes.func.isRequired,
};

export default injectIntl(withLocation(stripesConnect(ViewInstance)));
