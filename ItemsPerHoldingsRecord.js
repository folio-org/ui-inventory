import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Layer from '@folio/stripes-components/lib/Layer';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';

import Items from './Items';
import ItemForm from './edit/items/ItemForm';

class ItemsPerHoldingsRecord extends React.Component {

  static manifest = Object.freeze({
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
    this.props.history.push(`/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}${this.props.location.search}`);
  }


  render() {
    const { okapi, resources: { addItemMode, materialTypes, loanTypes }, instance, holdingsRecord, location } = this.props;

    const materialtypes = (materialTypes || {}).records || [];
    const loantypes = (loanTypes || {}).records || [];
    const referenceTables = this.props.referenceTables;
    referenceTables.loanTypes = loantypes;
    referenceTables.materialTypes = materialtypes;

    const newItemButton = <Button id="clickable-new-item" onClick={this.onClickAddNewItem} title="+ Item" buttonStyle="primary paneHeaderNewButton">+ New item</Button>;

    return (
      <div>
        <Row onClick={this.viewHoldingsRecord}>
          <Col sm={4}>
            <KeyValue label="Callnumber" value={holdingsRecord.callNumber} />
          </Col>
          { holdingsRecord.permanentLocationId ?
            <Col sm={5}>
              <KeyValue label="Permanent location" value={referenceTables.shelfLocations.find(loc => holdingsRecord.permanentLocationId === loc.id).name} />
            </Col>
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
          <Col>
            {newItemButton}
          </Col>
        </Row>
        <Row>
          <Col sm={10} smOffset={1}>
            <this.cItems holdingsRecord={holdingsRecord} referenceTables={referenceTables} okapi={okapi} instance={instance} location={location} history={this.props.history} match={this.props.match} />
          </Col>
        </Row>
        <br />
        <Layer key={`itemformlayer_${holdingsRecord.id}`} isOpen={addItemMode ? (addItemMode.mode && this.addItemModeThisLayer) : false} label="Add New Item Dialog">
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
          />
        </Layer>
      </div>);
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
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  history: PropTypes.object,
  okapi: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }),
};

export default ItemsPerHoldingsRecord;
