import React from 'react';
import PropTypes from 'prop-types';

import Items from './Items';

class ItemCreator extends React.Component {

  constructor(props) {
    super(props);
    this.cItems = props.stripes.connect(Items, { dataKey: props.holdingsRecordId });
  }

  render() {
    return <this.cItems {...this.props} />;
  }
}

ItemCreator.propTypes = {
  holdingsRecordId: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired,
};

export default ItemCreator;
