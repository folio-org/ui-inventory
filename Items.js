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

  onSelectRow = (e, meta) => {
    if (e) e.stopPropagation();
    this.openItem(meta);
  }

  openItem(selectedItem) {
    const itemId = selectedItem.id;
    this.props.history.push(`/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}/${itemId}${this.props.location.search}`);
  }

  render() {
    const { resources: { items } } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => _.get(x, ['barcode']),
      status: x => _.get(x, ['status', 'name']) || '--',
      'Material Type': x => _.get(x, ['materialType', 'name']),
    };
    return (
      <div>
        <MultiColumnList
          id="list-items"
          contentData={itemRecords}
          rowMetadata={['id', 'holdingsRecordId']}
          onRowClick={this.onSelectRow}
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
  }),
  history: PropTypes.object,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
};

export default Items;
