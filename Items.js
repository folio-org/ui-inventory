import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';

class Items extends React.Component {
  static manifest = Object.freeze({
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

  openItem = (e, selectedItem) => {
    if (e) e.preventDefault();
    const itemId = selectedItem.id;

    this.props.parentMutator.query.update({
      _path: `/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}/${itemId}`
    });
  }

  render() {
    const { resources: { items } } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => _.get(x, ['barcode']),
      'status': x => _.get(x, ['status', 'name']) || '--',
      'Material Type': x => _.get(x, ['materialType', 'name']),
    };
    return (
      <div>
        <MultiColumnList
          id="list-items"
          contentData={itemRecords}
          rowMetadata={['id', 'holdingsRecordId']}
          onRowClick={this.openItem}
          formatter={itemsFormatter}
          visibleColumns={['Item: barcode', 'status', 'Material Type']}
          ariaLabel="Items"
          containerRef={(ref) => { this.resultsList = ref; }}
        />
      </div>);
  }
}

Items.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    query: PropTypes.object,
  }),
  parentMutator: PropTypes.object.isRequired,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
};

export default Items;
