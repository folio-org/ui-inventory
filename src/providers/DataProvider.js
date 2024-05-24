import React, {
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import keyBy from 'lodash/keyBy';

import {
  stripesConnect,
  useStripes,
} from '@folio/stripes/core';

import { useLocationsForTenants } from '../hooks';
import { DataContext } from '../contexts';
import { OKAPI_TENANT_HEADER } from '../constants';
import { isUserInConsortiumMode } from '../utils';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
  mutator,
}) => {
  const { manifest } = DataProvider;
  const stripes = useStripes();

  const { consortium } = stripes.user.user;

  useEffect(() => {
    if (!consortium) {
      return;
    }

    mutator.consortiaTenants.GET({
      path: `consortia/${consortium?.id}/tenants?limit=1000`,
      headers: {
        [OKAPI_TENANT_HEADER]: consortium?.centralTenantId,
      },
    });
  }, [consortium?.id]);

  const tenantIds = resources.consortiaTenants.records.map(tenant => tenant.id);

  const { isLoading: isLoadingAllLocations, data: locationsOfAllTenants } = useLocationsForTenants({ tenantIds });

  useEffect(() => {
    if (isUserInConsortiumMode(stripes)) {
      return;
    }

    mutator.locations.GET({ tenant: stripes.okapi.tenant });
  }, [stripes.okapi.tenant]);

  const isLoading = useMemo(() => {
    // eslint-disable-next-line guard-for-in
    for (const key in manifest) {
      if (isLoadingAllLocations) {
        return true;
      }

      const isResourceLoading = !resources?.[key]?.hasLoaded && !resources?.[key]?.failed && resources?.[key]?.isPending;

      if (manifest[key].type === 'okapi' && isResourceLoading) {
        return true;
      }
    }

    return false;
  }, [resources, manifest, isLoadingAllLocations]);

  const data = useMemo(() => {
    const loadedData = {};

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    if (isUserInConsortiumMode(stripes)) {
      loadedData.locations = locationsOfAllTenants;
    }

    const {
      locations,
      identifierTypes,
      holdingsSources,
      instanceRelationshipTypes,
      statisticalCodeTypes,
      statisticalCodes,
      consortiaTenants,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');
    loadedData.identifierTypesById = keyBy(identifierTypes, 'id');
    loadedData.identifierTypesByName = keyBy(identifierTypes, 'name');
    loadedData.holdingsSourcesByName = keyBy(holdingsSources, 'name');
    loadedData.instanceRelationshipTypesById = keyBy(instanceRelationshipTypes, 'id');
    loadedData.consortiaTenantsById = keyBy(consortiaTenants, 'id');
    const statisticalCodeTypesById = keyBy(statisticalCodeTypes, 'id');

    // attach full statisticalCodeType object to each statisticalCode
    loadedData.statisticalCodes = statisticalCodes.map(sc => {
      sc.statisticalCodeType = statisticalCodeTypesById[sc.statisticalCodeTypeId];
      return sc;
    });

    return loadedData;
  }, [resources, manifest, locationsOfAllTenants]);

  if (isLoading) {
    return null;
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  children: PropTypes.object,
};

DataProvider.manifest = {
  consortiaTenants: {
    type: 'okapi',
    records: 'tenants',
    accumulate: true,
    throwErrors: false,
  },
  identifierTypes: {
    type: 'okapi',
    records: 'identifierTypes',
    path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  contributorTypes: {
    type: 'okapi',
    records: 'contributorTypes',
    path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  contributorNameTypes: {
    type: 'okapi',
    records: 'contributorNameTypes',
    path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  instanceFormats: {
    type: 'okapi',
    records: 'instanceFormats',
    path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  instanceTypes: {
    type: 'okapi',
    records: 'instanceTypes',
    path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  classificationTypes: {
    type: 'okapi',
    records: 'classificationTypes',
    path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  alternativeTitleTypes: {
    type: 'okapi',
    records: 'alternativeTitleTypes',
    path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  locations: {
    type: 'okapi',
    records: 'locations',
    path: 'locations',
    params: {
      limit: (q, p, r, l, props) => props?.stripes?.config?.maxUnpagedResourceCount || 1000,
      query: 'cql.allRecords=1 sortby name',
    },
    accumulate: true,
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  instanceRelationshipTypes: {
    type: 'okapi',
    records: 'instanceRelationshipTypes',
    path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  instanceStatuses: {
    type: 'okapi',
    records: 'instanceStatuses',
    path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  modesOfIssuance: {
    type: 'okapi',
    records: 'issuanceModes',
    path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  instanceNoteTypes: {
    type: 'okapi',
    path: 'instance-note-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'instanceNoteTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  electronicAccessRelationships: {
    type: 'okapi',
    records: 'electronicAccessRelationships',
    path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  statisticalCodeTypes: {
    type: 'okapi',
    records: 'statisticalCodeTypes',
    path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  statisticalCodes: {
    type: 'okapi',
    records: 'statisticalCodes',
    path: 'statistical-codes?limit=2000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  illPolicies: {
    type: 'okapi',
    path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'illPolicies',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  holdingsTypes: {
    type: 'okapi',
    path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  callNumberTypes: {
    type: 'okapi',
    path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'callNumberTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  holdingsNoteTypes: {
    type: 'okapi',
    path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsNoteTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  itemNoteTypes: {
    type: 'okapi',
    path: 'item-note-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'itemNoteTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  itemDamagedStatuses: {
    type: 'okapi',
    path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'itemDamageStatuses',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  natureOfContentTerms: {
    type: 'okapi',
    path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'natureOfContentTerms',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'mtypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  loanTypes: {
    type: 'okapi',
    path: 'loan-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'loantypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  tags: {
    path: 'tags?limit=10000',  // the same as Tags component in stripes-smart-components
    records: 'tags',
    throwErrors: false,
    type: 'okapi',
    resourceShouldRefresh: true,
  },
  holdingsSources: {
    type: 'okapi',
    path: 'holdings-sources',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'holdingsRecordsSources',
    resourceShouldRefresh: true,
    throwErrors: false,
  }
};

export default stripesConnect(DataProvider);
