import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import useFetchItems from '../../components/ViewRequests/useFetchItems';

const ViewRequestsButton = ({ mutator, onClick, resources }) => {
  const instanceHoldings = resources.allInstanceHoldings.records;
  const items = useFetchItems(mutator.allInstanceItems, instanceHoldings);
  console.log('resources.allInstanceHoldings.records', resources.allInstanceHoldings.records);
  console.log('ViewRequestsButton', items);
  console.log('resources', resources);

  return !items?.length ? null : (
    <Button
      id="view-requests"
      onClick={onClick}
      buttonStyle="dropdownItem"
    >
      <Icon icon="eye-open">
        <FormattedMessage id="ui-inventory.viewRequests" />
      </Icon>
    </Button>
  );
};

// ViewRequestsButton.manifest = Object.freeze({
//   allInstanceHoldings: {
//     type: 'okapi',
//     records: 'holdingsRecords',
//     path: 'holdings-storage/holdings',
//     fetch: true,
//     throwErrors: false,
//     params: {
//       query: 'instanceId==:{id}',
//       limit: '500',
//     },
//     shouldRefresh: () => false,
//   },
//   allInstanceItems: {
//     accumulate: true,
//     fetch: false,
//     path: 'inventory/items',
//     records: 'items',
//     throwErrors: false,
//     type: 'okapi',
//     shouldRefresh: () => false,
//   },
// });

ViewRequestsButton.propTypes = {
  mutator: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  resources: PropTypes.object.isRequired,
};

export default ViewRequestsButton;
