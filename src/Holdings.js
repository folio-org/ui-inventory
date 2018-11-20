import React from 'react';
import PropTypes from 'prop-types';

import ItemsPerHoldingsRecord from './ItemsPerHoldingsRecord';

/**
 * Wrapper for items-per-holdings display which shows item links on
 * the instance-details pane. This component retrieves all holdings
 * records and then passes them off to ItemsPerHoldingsRecord to render.
 *
 */
class Holdings extends React.Component {
  static manifest = Object.freeze({
    query: {},
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings?query=(instanceId==:{id})',
      resourceShouldRefresh: true,
    },
  });

  constructor(props) {
    super(props);
    this.cItems = this.props.stripes.connect(ItemsPerHoldingsRecord);
  }

  render() {
    const {
      resources: {
        holdings,
      },
      referenceTables,
    } = this.props;

    const isResourcesLoading = !holdings || !holdings.hasLoaded;

    if (isResourcesLoading) {
      return null;
    }

    const holdingsRecords = holdings.records;

    return (
      <div>
        {holdingsRecords.map(record => (
          <this.cItems
            key={`items_${record.id}`}
            holdingsRecord={record}
            {...this.props}
          />
        ))}
      </div>
    );
  }
}

Holdings.propTypes = {
  resources: PropTypes.shape({
    holdings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  referenceTables: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
};

export default Holdings;
