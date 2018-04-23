import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Layer from '@folio/stripes-components/lib/Layer';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';

import Items from './Items';
import ItemForm from './edit/items/ItemForm';

/**
 * Accordion wrapper for an individual Holdings record on the instance-view
 * pane. Actual display of item summary is handled via Items.
 *
 */
class ItemsPerHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    addItemMode: { initialValue: { mode: false } },
    materialTypes: {
      type: 'okapi',
      path: 'material-types',
      records: 'mtypes',
    },
    loanTypes: {
      type: 'okapi',
      path: 'loan-types',
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
  onClickAddNewItem = (e) => {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    this.props.mutator.addItemMode.replace({ mode: true });
    this.addItemModeThisLayer = true;
  }

  onClickCloseNewItem = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.addItemMode.replace({ mode: false });
    this.addItemModeThisLayer = false;
  }

  createItem = (item) => {
    // POST item record
    this.props.mutator.items.POST(item);
    this.onClickCloseNewItem();
  }

  viewHoldingsRecord = () => {
    this.props.mutator.query.update({
      _path: `/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}`,
    });
  }


  render() {
    const { okapi, resources: { addItemMode, materialTypes, loanTypes }, instance, holdingsRecord, accordionToggle, accordionStates } = this.props;

    const materialtypes = (materialTypes || {}).records || [];
    const loantypes = (loanTypes || {}).records || [];
    const referenceTables = this.props.referenceTables;
    referenceTables.loanTypes = loantypes;
    referenceTables.materialTypes = materialtypes;

    const formatMsg = this.props.stripes.intl.formatMessage;
    const viewHoldingsButton = <Button id="clickable-view-holdings" onClick={this.viewHoldingsRecord}>{formatMsg({ id: 'ui-inventory.viewHoldings' })}</Button>;
    const newItemButton = <Button id="clickable-new-item" onClick={this.onClickAddNewItem} title={formatMsg({ id: 'ui-inventory.addItem' })} buttonStyle="primary paneHeaderNewButton">{formatMsg({ id: 'ui-inventory.addItem' })}</Button>;
    const labelLocation = holdingsRecord.permanentLocationId ? referenceTables.shelfLocations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : '';
    const labelCallNumber = holdingsRecord.callNumber || '';

    return (
      <Accordion
        open={accordionStates[holdingsRecord.id] === undefined || accordionStates[holdingsRecord.id]}
        id={holdingsRecord.id}
        onToggle={accordionToggle}
        label={formatMsg({ id: 'ui-inventory.holdingsHeader' }, { location: labelLocation, callNumber: labelCallNumber })}
        displayWhenOpen={<div>{viewHoldingsButton} {newItemButton}</div>}
      >
        <Row>
          { holdingsRecord.permanentLocationId ?
            null
            :
            <Col sm={5}>
              <KeyValue
                label="Platform"
                value={_.get(holdingsRecord, ['electronicLocation', 'platformId'], null) ?
                       (referenceTables.platforms.find(platform => _.get(holdingsRecord, ['electronicLocation', 'platformId'], '') === platform.id).name)
                       :
                       null}
              />
              <KeyValue label="URI" value={_.get(holdingsRecord, ['electronicLocation', 'uri'], '')} />
            </Col>
          }
        </Row>
        <Row>
          <Col sm={12}>
            <this.cItems holdingsRecord={holdingsRecord} instance={instance} parentMutator={this.props.mutator} />
          </Col>
        </Row>
        <br />
        <Layer key={`itemformlayer_${holdingsRecord.id}`} isOpen={addItemMode ? (addItemMode.mode && this.addItemModeThisLayer) : false} label={formatMsg({ id: 'ui-inventory.addNewHoldingsDialog' })}>
          <ItemForm
            form={`itemform_${holdingsRecord.id}`}
            id={holdingsRecord.id}
            key={holdingsRecord.id}
            initialValues={{ status: { name: 'Available' }, holdingsRecordId: holdingsRecord.id }}
            onSubmit={(record) => { this.createItem(record); }}
            onCancel={this.onClickCloseNewItem}
            okapi={okapi}
            instance={instance}
            holdingsRecord={holdingsRecord}
            referenceTables={referenceTables}
            intl={this.props.stripes.intl}
          />
        </Layer>
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
    shelfLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  referenceTables: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  }).isRequired,
  okapi: PropTypes.object,
  accordionToggle: PropTypes.func.isRequired,
  accordionStates: PropTypes.object.isRequired,
};

export default ItemsPerHoldingsRecord;
