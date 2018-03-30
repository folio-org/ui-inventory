import React from 'react';
import PropTypes from 'prop-types';

import ItemsPerHoldingsRecord from './ItemsPerHoldingsRecord';

class Holdings extends React.Component {
  static manifest = Object.freeze({
    query: {},
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings?query=(instanceId=:{id})',
    },
    shelfLocations: {
      type: 'okapi',
      records: 'shelflocations',
      path: 'shelf-locations',
    },
    platforms: {
      type: 'okapi',
      records: 'platforms',
      path: 'platforms',
    },
  });

  constructor(props) {
    super(props);
    this.cItems = this.props.stripes.connect(ItemsPerHoldingsRecord);
  }

  render() {
    const { resources: { holdings, shelfLocations, platforms }, referenceTables } = this.props;

    if (!holdings || !holdings.hasLoaded || !shelfLocations || !shelfLocations.hasLoaded) return <div />;

    const holdingsRecords = holdings.records;
    referenceTables.shelfLocations = (shelfLocations || {}).records || [];
    referenceTables.platforms = (platforms || {}).records || [];

    const that = this;

    return (
      <div>
        {holdingsRecords.map(record =>
          <that.cItems key={`items_${record.id}`} holdingsRecord={record} {...that.props} />)}
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
