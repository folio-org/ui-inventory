import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';

class Items extends React.Component {

  static manifest = Object.freeze({
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(holdingsRecordId=!{holdingsRecordId})',
    },
  });

  render() {
    const { resources: { items } } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;

    const itemsFormatter = {
      'Material Type': x => _.get(x, ['materialType', 'name']),
      'Permanent Loan Type': x => _.get(x, ['permanentLoanType', 'name']),
      status: x => _.get(x, ['status', 'name']) || '--',
    };

    return (
      <MultiColumnList
        id="list-items"
        contentData={itemRecords}
        rowMetadata={['id', 'holdingsRecordId']}
        formatter={itemsFormatter}
        visibleColumns={['Material Type', 'Permanent Loan Type', 'status', 'barcode']}
        ariaLabel={'Items'}
        containerRef={(ref) => { this.resultsList = ref; }}
      />);
  }
}

Items.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default Items;
