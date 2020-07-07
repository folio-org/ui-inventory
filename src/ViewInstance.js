import {
  get,
} from 'lodash';
import React, {
  Fragment,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import queryString from 'query-string';

import {
  AppIcon,
  IntlConsumer,
  IfPermission,
} from '@folio/stripes/core';
import {
  Pane,
  Button,
  Layer,
  Icon,
  Callout,
} from '@folio/stripes/components';

import {
  craftLayerUrl,
  marshalInstance,
  unmarshalInstance,
} from './utils';
import InstanceForm from './edit/InstanceForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import InstancePlugin from './components/InstancePlugin';

import {
  HoldingsListContainer,
  MoveItemsContext,

  InstanceDetails,
} from './Instance';

class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    selectedInstance: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      clear: false,
      throwErrors: false,
    },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: false,
      throwErrors: false,
    },
    movableItems: {
      type: 'okapi',
      path: 'inventory/items',
      fetch: false,
      throwErrors: false,
      accumulate: true,
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{id}/formatted?idType=INSTANCE',
      accumulate: true,
      throwErrors: false,
    },
    blockedFields: {
      type: 'okapi',
      path: 'inventory/config/instances/blocked-fields',
      clear: false,
      throwErrors: false,
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      marcRecord: null,
      findInstancePluginOpened: false,
      isItemsMovement: false,
    };
    this.instanceId = null;
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.calloutRef = createRef();
  }

  componentDidMount() {
    this.getMARCRecord();
  }

  componentDidUpdate(prevProps) {
    const { location: prevLocation } = prevProps;
    const { location } = this.props;

    if (prevLocation === location) return;
    this.getMARCRecord();
  }

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
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'edit' });
  };

  editInstanceMarc = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/quick-marc/edit/${instanceId}`,
      search: location.search,
    });
  };

  selectInstanse = (selectedInstance) => {
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

  moveItems = (fromHolding, toHolding, items) => {
    // TODO: replace temporary solution with correct one when implemented
    const { mutator } = this.props;

    return mutator.movableItems.GET({
      params: {
        query: items.map(item => `id==${item}`).join(' or '),
      },
    })
      .then(({ items: fetchedItems }) => {
        const updatedPromises = fetchedItems.map((item) => mutator.movableItems.PUT({
          ...item,
          holdingsRecordId: toHolding,
        }));

        return Promise.all(updatedPromises);
      })
      .then(() => {
        const message = (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.success"
            values={{ count: items.length }}
          />
        );

        this.calloutRef.current.sendCallout({ message });
      });
  };

  update = (instance) => {
    const { referenceTables: { identifierTypesByName } } = this.props;

    // Massage record to add preceeding and succeeding title fields
    marshalInstance(instance, identifierTypesByName);

    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.resetLayerQueryParam();
    });
  };

  resetLayerQueryParam = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
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

  toggleFindInstancePlugin = () => {
    this.setState(prevState => ({ findInstancePluginOpened: !prevState.findInstancePluginOpened }));
  };

  createActionMenuGetter = instance => ({ onToggle }) => {
    const {
      onCopy,
      stripes
    } = this.props;
    const { marcRecord } = this.state;
    const isSourceMARC = get(instance, ['source'], '') === 'MARC';
    const canEditInstance = stripes.hasPerm('ui-inventory.instance.edit');
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');

    if (!isSourceMARC && !canEditInstance && !canCreateInstance) {
      return null;
    }

    return (
      <Fragment>
        <IfPermission perm="ui-inventory.instance.edit">
          <Button
            id="edit-instance"
            href={this.craftLayerUrl('edit')}
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
          isSourceMARC && (
            <>
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
            </>
          )
        }

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
      </Fragment>
    );
  };

  render() {
    const {
      match: { params: { id, holdingsrecordid, itemid } },
      location,
      referenceTables,
      stripes,
      onClose,
      paneWidth,
    } = this.props;

    const { identifierTypesById } = referenceTables;

    const query = location.search ? queryString.parse(location.search) : {};
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();

    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={<FormattedMessage id="ui-inventory.editInstance" />}
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

    if (query.layer === 'edit') {
      return (
        <IntlConsumer>
          {(intl) => (
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editInstanceDialog' })}
            >
              <InstanceForm
                onSubmit={this.update}
                initialValues={unmarshalInstance(instance, identifierTypesById)}
                instanceSource={get(instance, ['source'])}
                referenceTables={referenceTables}
                stripes={stripes}
                match={this.props.match}
                onCancel={this.resetLayerQueryParam}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    return (
      <>
        <InstanceDetails
          onClose={onClose}
          actionMenu={this.createActionMenuGetter(instance)}
          instance={instance}
          referenceData={referenceTables}
        >
          {
            (!holdingsrecordid && !itemid) ?
              (
                <MoveItemsContext moveItems={this.moveItems}>
                  <HoldingsListContainer
                    instance={instance}
                    referenceData={referenceTables}
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
                  {...this.props}
                />
              )
              : null
          }
        </InstanceDetails>

        <Callout ref={this.calloutRef} />

        {
          this.state.findInstancePluginOpened && (
            <InstancePlugin
              onSelect={this.selectInstanse}
              onClose={this.toggleFindInstancePlugin}
              withTrigger={false}
            />
          )
        }
      </>
    );
  }
}

ViewInstance.propTypes = {
  getSearchParams: PropTypes.func.isRequired,
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
    }),
  }),
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  okapi: PropTypes.object,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  referenceTables: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  updateLocation: PropTypes.func.isRequired,
};

export default withLocation(ViewInstance);
