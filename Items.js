import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Icon from '@folio/stripes-components/lib/Icon';
import Layer from '@folio/stripes-components/lib/Layer';

import utils from './utils';

import ItemForm from './edit/items/ItemForm';

class Items extends React.Component {

  static manifest = Object.freeze({
    editItemMode: { initialValue: { mode: false } },
    selectedItem: { initialValue: {} },
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(holdingsRecordId=!{holdingsRecord.id})',
    },
  });

  constructor(props) {
    super(props);
    this.editItemModeThisLayer = false;
  }

  onClickEditItem = (e, item) => {
    if (e) e.preventDefault();
    this.props.mutator.selectedItem.replace({ item });
    this.props.mutator.editItemMode.replace({ mode: true });
    this.editItemModeThisLayer = true;
  }

  onClickCloseEditItem = (e) => {
    if (e) e.preventDefault();
    utils.removeQueryParam('layer', this.props.location, this.props.history);
    this.editItemModeThisLayer = false;
  }

  updateItem = (item) => {
    this.props.mutator.items.PUT(item).then(() => {
      this.onClickCloseEditItem();
    });
  }

  render() {
    const { resources: { items, editItemMode, selectedItem }, instance, holdingsRecord, referenceTables } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => <div> <button title="Edit Item" onClick={(e) => { this.onClickEditItem(e, x); }}><Icon icon="edit" /></button> {_.get(x, ['barcode'])}</div>,
      status: x => _.get(x, ['status', 'name']) || '--',
      'Material Type': x => _.get(x, ['materialType', 'name']),
    };

    return (
      <div>
        <MultiColumnList
          id="list-items"
          contentData={itemRecords}
          rowMetadata={['id', 'holdingsRecordId']}
          formatter={itemsFormatter}
          visibleColumns={['Item: barcode', 'status', 'Material Type']}
          ariaLabel={'Items'}
          containerRef={(ref) => { this.resultsList = ref; }}
        />
        { selectedItem ?
          <Layer key="itemformlayer" isOpen={this.editItemModeThisLayer && (editItemMode ? editItemMode.mode : false)} label="Edit Item Dialog">
            <ItemForm
              form={'itemform'}
              initialValues={selectedItem}
              onCancel={this.onClickCloseEditItem}
              onSubmit={(record) => { this.updateItem(record); }}
              referenceTables={referenceTables}
              holdingsRecord={holdingsRecord}
              instance={instance}
            />
          </Layer>
          :
          null
        }
      </div>);
  }
}

Items.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    selectedItem: PropTypes.object,
  }),
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      PUT: PropTypes.func,
    }),
    editItemMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    selectedItem: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }),
  instance: PropTypes.object,
  history: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
};

export default Items;
