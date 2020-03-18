import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Layer,
  Row,
  Col,
  Button,
} from '@folio/stripes/components';
import {
  IntlConsumer,
  IfPermission,
} from '@folio/stripes/core';
import {
  has,
  cloneDeep,
} from 'lodash';

import Items from './Items';
import ItemForm from './edit/items/ItemForm';
import withLocation from './withLocation';
import {
  areAllFieldsEmpty,
  callNumberLabel
} from './utils';

/**
 * Accordion wrapper for an individual Holdings record on the instance-view
 * pane. Actual display of item summary is handled via Items.
 *
 */
class ItemsPerHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      fetch: false,
    },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: false,
    },
  });

  constructor(props) {
    super(props);
    this.cItems = props.stripes.connect(Items, { dataKey: props.holdingsRecord.id });

    this.state = {
      records: [],
    };
  }

  // Add Item handlers
  onClickAddNewItem = (holdingsRecordId) => {
    this.props.updateLocation({ layer: 'createItem', holdingsRecordId });
  };

  onClickCloseNewItem = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null, holdingsRecordId: null });
  }

  createItem = (item) => {
    // POST item record
    this.props.mutator.items.POST(item)
      .then(() => this.onClickCloseNewItem());
  }

  getRecords = records => {
    this.setState(curState => {
      const newState = cloneDeep(curState);
      newState.records = records;

      return newState;
    });
  };

  viewHoldings = () => {
    const {
      holdingsRecord,
      goTo,
      getParams,
      location: { pathname },
    } = this.props;
    const path = `${pathname}/${holdingsRecord.id}`;

    goTo(path, getParams());
  }

  renderButtonsGroup = () => {
    const { holdingsRecord } = this.props;

    return (
      <Fragment>
        <Button
          id="clickable-view-holdings"
          data-test-view-holdings
          onClick={this.viewHoldings}
          style={{ marginRight: '5px' }}
        >
          <FormattedMessage id="ui-inventory.viewHoldings" />
        </Button>
        <IfPermission perm="ui-inventory.item.create">
          <Button
            id="clickable-new-item"
            onClick={() => {
              this.onClickAddNewItem(holdingsRecord.id);
            }}
            buttonStyle="primary paneHeaderNewButton"
          >
            <FormattedMessage id="ui-inventory.addItem" />
          </Button>
        </IfPermission>
      </Fragment>
    );
  }

  render() {
    const {
      okapi,
      referenceTables,
      resources: {
        query: {
          layer,
          holdingsRecordId,
        },
      },
      instance,
      holdingsRecord,
      mutator,
      stripes,
    } = this.props;
    const { locationsById } = referenceTables;
    const labelLocation = holdingsRecord.permanentLocationId ? locationsById[holdingsRecord.permanentLocationId].name : '';

    if (layer === 'createItem' && holdingsRecordId === holdingsRecord.id) {
      return (
        <IntlConsumer>
          {intl => (
            <Layer
              contentLabel={intl.formatMessage({ id: 'ui-inventory.addNewHoldingsDialog' })}
              key={`itemformlayer_${holdingsRecord.id}`}
              isOpen
            >
              <ItemForm
                form={`itemform_${holdingsRecord.id}`}
                id={holdingsRecord.id}
                key={holdingsRecord.id}
                initialValues={{
                  status: { name: 'Available' },
                  holdingsRecordId: holdingsRecord.id,
                }}
                onSubmit={this.createItem}
                onCancel={this.onClickCloseNewItem}
                okapi={okapi}
                instance={instance}
                holdingsRecord={holdingsRecord}
                referenceTables={referenceTables}
                intl={stripes.intl}
                stripes={stripes}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    return (
      <Accordion
        id={holdingsRecord.id}
        label={(
          <FormattedMessage
            id="ui-inventory.holdingsHeader"
            values={{
              location: labelLocation,
              callNumber: callNumberLabel(holdingsRecord),
            }}
          />
        )}
        displayWhenOpen={this.renderButtonsGroup()}
      >
        <Row>
          <Col sm={12}>
            <this.cItems
              holdingsRecord={holdingsRecord}
              instance={instance}
              parentMutator={mutator}
              getRecords={this.getRecords}
            />
          </Col>
        </Row>
        <br />
      </Accordion>);
  }
}

ItemsPerHoldingsRecord.propTypes = {
  instance: PropTypes.object,
  location: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      POST: PropTypes.func,
    }),
    holdings: PropTypes.shape({
      PUT: PropTypes.func,
    }),
    query: PropTypes.object.isRequired,
  }),
  resources: PropTypes.shape({
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loanTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  referenceTables: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  okapi: PropTypes.object,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  getParams: PropTypes.func.isRequired,
};

export default withLocation(ItemsPerHoldingsRecord);
