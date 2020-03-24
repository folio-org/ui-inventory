import React from 'react';
import PropTypes from 'prop-types';
import {
  flowRight,
  get,
  map,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  requestStatuses,
} from '../constants';
import withData from './withData';
import withLocation from '../withLocation';
import { ItemView } from '../views';
import { PaneLoading } from '../components';

const requestsStatusString = map(requestStatuses, requestStatus => `"${requestStatus}"`).join(' or ');
const getRequestsPath = `circulation/requests?query=(itemId==:{itemid}) and status==(${requestsStatusString}) sortby requestDate desc`;

class ItemRoute extends React.Component {
  static propTypes = {
    isLoading: PropTypes.func,
    getData: PropTypes.func,
  };

  static manifest = Object.freeze({
    query: {},
    items: {
      type: 'okapi',
      path: 'inventory/items/:{itemid}',
      POST: { path: 'inventory/items' },
      resourceShouldRefresh: true,
    },
    markItemAsWithdrawn: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-withdrawn',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
    },
    servicePoints: {
      type: 'okapi',
      path: 'service-points',
      records: 'servicepoints',
      params: (_q, _p, _r, _l, props) => {
        const servicePointId = get(props.resources, 'items.records[0].lastCheckIn.servicePointId', '');

        const query = servicePointId && `id==${servicePointId}`;

        return query ? { query } : null;
      },
      resourceShouldRefresh: true,
    },
    staffMembers: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      params: (_q, _p, _r, _l, props) => {
        const staffMemberId = get(props.resources, 'items.records[0].lastCheckIn.staffMemberId', '');

        const query = staffMemberId && `id==${staffMemberId}`;

        return query ? { query } : null;
      },
      resourceShouldRefresh: true,
    },
    requests: {
      type: 'okapi',
      path: getRequestsPath,
      records: 'requests',
      PUT: { path: 'circulation/requests/%{requestOnItem.id}' },
    },
    openLoans: {
      type: 'okapi',
      path: 'circulation/loans',
      params: {
        query: 'status.name=="Open" and itemId==:{itemid}',
      },
      records: 'loans',
    },
    requestOnItem: {},
  });

  onClose = () => {
    const {
      goTo,
      match: {
        params: { id },
      },
      location: { pathname, search }
    } = this.props;

    // extract instance url
    const [path] = pathname.match(new RegExp(`(.*)${id}`));

    goTo(`${path}${search}`);
  }

  isLoading = () => {
    const {
      isLoading,
      resources: {
        items,
        holdingsRecords,
        instances1,
      },
    } = this.props;

    if (!items?.hasLoaded ||
      !instances1?.hasLoaded ||
      !holdingsRecords?.hasLoaded ||
      isLoading()) {
      return true;
    }

    return false;
  }

  render() {
    const { getData } = this.props;

    if (this.isLoading()) {
      return <PaneLoading defaultWidth="100%" />;
    }

    return (
      <ItemView
        {...this.props}
        onCloseViewItem={this.onClose}
        referenceTables={getData()}
      />
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
  withData,
)(ItemRoute);
