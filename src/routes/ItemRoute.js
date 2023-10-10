import React from 'react';
import PropTypes from 'prop-types';
import {
  flowRight,
  get,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { requestsStatusString } from '../Instance/ViewRequests/utils';

import withLocation from '../withLocation';
import { ItemView } from '../views';
import { PaneLoading } from '../components';
import { DataContext } from '../contexts';
import { getItem } from '../storage';
import {
  TENANT_IDS_KEY,
  updateAffiliation,
} from '../utils';

const getRequestsPath = `circulation/requests?query=(itemId==:{itemid}) and status==(${requestsStatusString}) sortby requestDate desc&limit=1`;

class ItemRoute extends React.Component {
  static manifest = Object.freeze({
    query: {},
    itemsResource: {
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
    markItemAsMissing: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-missing',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsInProcess: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-in-process',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsInProcessNonRequestable: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-in-process-non-requestable',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsIntellectualItem: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-intellectual-item',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsLongMissing: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-long-missing',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsRestricted: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-restricted',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsUnavailable: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-unavailable',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsUnknown: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-unknown',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    instanceRecords: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      resourceShouldRefresh: true,
    },
    servicePoints: {
      type: 'okapi',
      path: 'service-points',
      records: 'servicepoints',
      params: (_q, _p, _r, _l, props) => {
        // Only one service point is of interest here: the SP used for the item's last check-in
        // (if the item has a check-in). Iff that service point ID is found, add a query param
        // to filter down to that one service point in the records returned.
        const servicePointId = get(props.resources, 'itemsResource.records[0].lastCheckIn.servicePointId', '');
        const query = servicePointId && `id==${servicePointId}`;
        return query ? { query } : {};
      },
      resourceShouldRefresh: true,
    },
    staffMembers: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      params: (_q, _p, _r, _l, props) => {
        const staffMemberId = get(props.resources, 'itemsResource.records[0].lastCheckIn.staffMemberId', '');
        const query = staffMemberId && `id==${staffMemberId}`;

        return query ? { query } : null;
      },
      resourceShouldRefresh: true,
    },
    // return a count of the requests matching the given item and status
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
    tagSettings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==TAGS and configName==tags_enabled)',
    },
  });

  goBack = () => {
    const {
      match: { params: { id } },
      location: { search },
    } = this.props;

    window.location.href = `/inventory/view/${id}${search}`;
  }

  onClose = () => {
    const { stripes: { okapi } } = this.props;
    const tenantIds = getItem(TENANT_IDS_KEY);

    const tenantFrom = tenantIds ? tenantIds.tenantFrom : okapi.tenant;

    updateAffiliation(okapi, tenantFrom, this.goBack);
  }

  isLoading = () => {
    const {
      resources: {
        itemsResource,
        holdingsRecords,
        instanceRecords,
      },
    } = this.props;

    if (!itemsResource?.hasLoaded ||
      !instanceRecords?.hasLoaded ||
      !holdingsRecords?.hasLoaded) {
      return true;
    }

    return false;
  }

  render() {
    if (this.isLoading()) {
      return <PaneLoading defaultWidth="100%" />;
    }

    return (
      <DataContext.Consumer>
        {data => (
          <ItemView
            {...this.props}
            onCloseViewItem={this.onClose}
            referenceTables={data}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

ItemRoute.propTypes = {
  goTo: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.object,
  tenantFrom: PropTypes.string,
};

export default flowRight(
  stripesConnect,
  withLocation,
)(ItemRoute);
