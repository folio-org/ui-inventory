import React from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  Icon,
} from '@folio/stripes/components';

const ItemsCountBadge = ({ itemCount }) => {
  return <Badge>{itemCount ?? <Icon icon="spinner-ellipsis" width="10px" />}</Badge>;
};

ItemsCountBadge.propTypes = {
  itemCount: PropTypes.number,
};

export default ItemsCountBadge;
