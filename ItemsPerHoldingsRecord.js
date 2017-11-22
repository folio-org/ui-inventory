import React from 'react';
import PropTypes from 'prop-types';

import Layer from '@folio/stripes-components/lib/Layer';
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
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      fetch: false,
    },
  });

  constructor(props) {
    super(props);
    this.cItems = props.stripes.connect(Items, { dataKey: props.holdingsRecordId });
  }

  onClickAddNewItem = (e) => {
    if (e) e.preventDefault();
    console.log('clicked "add new item"');
    this.props.mutator.addItemMode.replace({ mode: true });
  }

  onClickCloseNewItem = (e) => {
    if (e) e.preventDefault();
    console.log('clicked "close new item"');
    this.props.mutator.addItemMode.replace({ mode: false });
  }

  createItem = (item) => {
    // POST item record
    console.log(`Creating new item record: ${JSON.stringify(item)}`);
    this.props.mutator.items.POST(item);
    this.onClickCloseNewItem();
  }

  render() {
    const { okapi, resources: { addItemMode, materialTypes, loanTypes, shelfLocations }, instance, holdingsRecord } = this.props;

    const materialtypes = (materialTypes || {}).records || [];
    const loantypes = (loanTypes || {}).records || [];
    const shelflocations = (shelfLocations || {}).records || [];


    const newItemButton = <div style={{ textAlign: 'right' }}><Button id="clickable-new-item" onClick={this.onClickAddNewItem} title="+ Item" buttonStyle="primary paneHeaderNewButton">+ New item</Button></div>;

    return (
      <div>
        {newItemButton}
        <this.cItems {...this.props} />
        <Layer isOpen={addItemMode ? addItemMode.mode : false} label="Add New Item Dialog">
          <ItemForm
            initialValues={{ status: { name: 'Available' }, title: instance.title, instanceId: 'dummy' }}
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
  holdingsRecordId: PropTypes.string.isRequired,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    addItemMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    items: PropTypes.shape({
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
