import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Layer,
  Row,
  Col,
  Button,
  Icon,
} from '@folio/stripes/components';

import Items from './Items';
import ItemForm from './edit/items/ItemForm';
import withlocation from './withLocation';

/**
 * Accordion wrapper for an individual Holdings record on the instance-view
 * pane. Actual display of item summary is handled via Items.
 *
 */
class ItemsPerHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    addItemMode: { initialValue: { mode: false } },
    addItemForHoldingsRecordId: {},
    materialTypes: {
      type: 'okapi',
      path: 'material-types',
      records: 'mtypes',
    },
    loanTypes: {
      type: 'okapi',
      path: 'loan-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '40',
      },
      records: 'loantypes',
    },
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
    this.addItemModeThisLayer = false;
  }

  // Add Item handlers
  onClickAddNewItem = (holdingsRecordId) => {
    const { mutator } = this.props;

    mutator.addItemMode.replace({ mode: true });
    mutator.addItemForHoldingsRecordId.replace({ holdingsRecordId });
    this.addItemModeThisLayer = true;
    this.props.updateLocation({ layer: 'createItem' });
  };

  onClickCloseNewItem = (e) => {
    const { mutator } = this.props;

    if (e) e.preventDefault();

    mutator.addItemMode.replace({ mode: false });
    this.addItemModeThisLayer = false;
    mutator.addItemForHoldingsRecordId.replace({});
    this.props.updateLocation({ layer: null });
  }

  createItem = (item) => {
    // POST item record
    this.props.mutator.items.POST(item)
      .then(() => this.onClickCloseNewItem());
  }

  renderButtonsGroup = () => {
    const {
      instance,
      holdingsRecord,
    } = this.props;

    return (
      <Fragment>
        <Button
          id="clickable-view-holdings"
          to={{ pathname: `/inventory/view/${instance.id}/${holdingsRecord.id}` }}
          style={{ marginRight: '5px' }}
        >
          <FormattedMessage id="ui-inventory.viewHoldings" />
        </Button>
        <Button
          id="clickable-new-item"
          onClick={() => {
            this.onClickAddNewItem(holdingsRecord.id);
          }}
          buttonStyle="primary paneHeaderNewButton"
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-inventory.addItem" />
          </Icon>
        </Button>
      </Fragment>
    );
  }

  render() {
    const {
      okapi,
      referenceTables,
      resources: {
        materialTypes,
        loanTypes,
        query,
        addItemForHoldingsRecordId,
      },
      instance,
      holdingsRecord,
      accordionToggle,
      accordionStates,
      mutator,
      stripes,
    } = this.props;
    const { locationsById } = referenceTables;
    const materialtypes = (materialTypes || {}).records || [];
    const loantypes = (loanTypes || {}).records || [];

    referenceTables.loanTypes = loantypes;
    referenceTables.materialTypes = materialtypes;

    const labelLocation = holdingsRecord.permanentLocationId ? locationsById[holdingsRecord.permanentLocationId].name : '';
    const labelCallNumber = holdingsRecord.callNumber || '';

    if (query.layer === 'createItem'
      && addItemForHoldingsRecordId.holdingsRecordId === holdingsRecord.id) {
      return (
        <Layer
          key={`itemformlayer_${holdingsRecord.id}`}
          isOpen
          label={<FormattedMessage id="ui-inventory.addNewHoldingsDialog" />}
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
      );
    }

    return (
      <Accordion
        open={accordionStates[holdingsRecord.id] === undefined || accordionStates[holdingsRecord.id]}
        id={holdingsRecord.id}
        onToggle={accordionToggle}
        label={(
          <FormattedMessage
            id="ui-inventory.holdingsHeader"
            values={{
              location: labelLocation,
              callNumber: labelCallNumber,
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
            />
          </Col>
        </Row>
        <br />
      </Accordion>);
  }
}

ItemsPerHoldingsRecord.propTypes = {
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      POST: PropTypes.func,
    }),
    holdings: PropTypes.shape({
      PUT: PropTypes.func,
    }),
    addItemMode: PropTypes.shape({
      replace: PropTypes.func,
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
  accordionToggle: PropTypes.func.isRequired,
  accordionStates: PropTypes.object.isRequired,
  updateLocation: PropTypes.func.isRequired,
};

export default withlocation(ItemsPerHoldingsRecord);
