import React from 'react';
import PropTypes from 'prop-types';

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
    shelfLocations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations',
    },
    itemsStored: {
      type: 'okapi',
      records: 'items',
      path: 'item-storage/items',
      fetch: false,
    },
  });

  constructor(props) {
    super(props);
    this.cItems = props.stripes.connect(Items, { dataKey: props.holdingsRecord.id });
    this.addItemModeThisLayer = false;
  }

  onClickAddNewItem = (e) => {
    if (e) e.preventDefault();
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
    this.props.mutator.itemsStored.POST(item)
    .then(this.onClickCloseNewItem());
  }

  render() {
    const { okapi, resources: { addItemMode, materialTypes, loanTypes, shelfLocations }, instance, holdingsRecord } = this.props;

    const materialtypes = (materialTypes || {}).records || [];
    const loantypes = (loanTypes || {}).records || [];
    const shelflocations = (shelfLocations || {}).records || [];

    const newItemButton = <Button id="clickable-new-item" onClick={this.onClickAddNewItem} title="+ Item" buttonStyle="primary paneHeaderNewButton">+ New item</Button>;

    return (
        <div>
          <Row>
            <Col sm={1}>
              <KeyValue label="Items"/>
            </Col>
            <Col sm={2} smOffset={8}>
              {newItemButton}
            </Col>
        </Row>
        <this.cItems {...this.props} />
        <Layer key={`itemformlayer_${holdingsRecord.id}`} isOpen={addItemMode ? (addItemMode.mode && this.addItemModeThisLayer) : false} label="Add New Item Dialog">
          <ItemForm
            form={`itemform_${holdingsRecord.id}`}
            id={holdingsRecord.id}
            key={holdingsRecord.id}
            initialValues={{ status: { name: 'Available' }, title: instance.title, holdingsRecordId: holdingsRecord.id }}
            onSubmit={(record) => { this.createItem(record); }}
            onCancel={this.onClickCloseNewItem}
            okapi={okapi}
            instance={instance}
            holdingsRecord={holdingsRecord}
            materialTypes={materialtypes}
            loanTypes={loantypes}
            shelfLocations={shelflocations}
          />
        </Layer>
      </div>);
  }
}

ItemsPerHoldingsRecord.propTypes = {
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    addItemMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    itemsStored: PropTypes.shape({
      POST: PropTypes.func,
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
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
  okapi: PropTypes.object,
};

export default ItemsPerHoldingsRecord;
