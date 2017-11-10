import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';

class InstanceItems extends React.Component {

  static manifest = Object.freeze({
    instanceId: {},
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(instanceId=:{instanceid})',
    },
  });

  render() {
    const { resources: { items } } = this.props;

    if (!items || !items.hasLoaded) return <div />;

    const instanceItems = items.records;

    const itemsFormatter = {
      'Material Type': x => _.get(x, ['materialType', 'name']),
      location: x => _.get(x, ['location', 'name']),
      'Permanent Loan Type': x => _.get(x, ['permanentLoanType', 'name']),
      status: x => _.get(x, ['status', 'name']) || '--',
    };

    return (
      <MultiColumnList
        id="list-instance-items"
        contentData={instanceItems}
        rowMetadata={['id', 'instanceId']}
        formatter={itemsFormatter}
        visibleColumns={['Material Type', 'location', 'Permanent Loan Type', 'status', 'barcode']}
        ariaLabel={'Instance\'s items'}
        containerRef={(ref) => { this.resultsList = ref; }}
      />);
  }
}

InstanceItems.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default InstanceItems;
