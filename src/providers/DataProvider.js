import keyBy from 'lodash/keyBy';
import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { DataContext } from '../contexts';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
}) => {
  const { manifest } = DataProvider;
  const dataRef = useRef();

  const isLoading = useMemo(() => {
    // eslint-disable-next-line guard-for-in
    for (const key in manifest) {
      const resource = resources?.[key] ?? {};
      // if the resource is in pending mode (which means it is currently trying to finalize the request)
      // or if the resource hasn't started at all yet (all flags are still set to false)
      // then return true indicating that the resource is still pending
      const isResourceLoading = resource.isPending || (!resource.hasLoaded && !resource.failed && !resource.isPending);

      if (manifest[key].type === 'okapi' && isResourceLoading) {
        return true;
      }
    }

    return false;
  }, [resources, manifest]);

  useEffect(() => {
    if (isLoading || dataRef.current) {
      return;
    }

    const loadedData = {};

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    const {
      locations,
      identifierTypes,
      holdingsSources,
      instanceRelationshipTypes,
      statisticalCodeTypes,
      statisticalCodes,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');
    loadedData.identifierTypesById = keyBy(identifierTypes, 'id');
    loadedData.identifierTypesByName = keyBy(identifierTypes, 'name');
    loadedData.holdingsSourcesByName = keyBy(holdingsSources, 'name');
    loadedData.instanceRelationshipTypesById = keyBy(instanceRelationshipTypes, 'id');
    const statisticalCodeTypesById = keyBy(statisticalCodeTypes, 'id');

    // attach full statisticalCodeType object to each statisticalCode
    loadedData.statisticalCodes = statisticalCodes.map(sc => {
      sc.statisticalCodeType = statisticalCodeTypesById[sc.statisticalCodeTypeId];
      return sc;
    });

    dataRef.current = loadedData;
  }, [resources, manifest, isLoading, dataRef]);

  if (isLoading) {
    return null;
  }

  return (
    <DataContext.Provider value={dataRef.current}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  resources: PropTypes.object.isRequired,
  children: PropTypes.object,
};

DataProvider.manifest = {
  identifierTypes: {
    type: 'okapi',
    records: 'identifierTypes',
    path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  contributorTypes: {
    type: 'okapi',
    records: 'contributorTypes',
    path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  contributorNameTypes: {
    type: 'okapi',
    records: 'contributorNameTypes',
    path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
    resourceShouldRefresh: true,
  },
  instanceFormats: {
    type: 'okapi',
    records: 'instanceFormats',
    path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  instanceTypes: {
    type: 'okapi',
    records: 'instanceTypes',
    path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  classificationTypes: {
    type: 'okapi',
    records: 'classificationTypes',
    path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  alternativeTitleTypes: {
    type: 'okapi',
    records: 'alternativeTitleTypes',
    path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  locations: {
    type: 'okapi',
    records: 'locations',
    path: 'locations',
    params: {
      limit: (q, p, r, l, props) => props?.stripes?.config?.maxUnpagedResourceCount || 1000,
      query: 'cql.allRecords=1 sortby name',
    },
    resourceShouldRefresh: true,
  },
  instanceRelationshipTypes: {
    type: 'okapi',
    records: 'instanceRelationshipTypes',
    path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  instanceStatuses: {
    type: 'okapi',
    records: 'instanceStatuses',
    path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  modesOfIssuance: {
    type: 'okapi',
    records: 'issuanceModes',
    path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
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
  },
  electronicAccessRelationships: {
    type: 'okapi',
    records: 'electronicAccessRelationships',
    path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  statisticalCodeTypes: {
    type: 'okapi',
    records: 'statisticalCodeTypes',
    path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  statisticalCodes: {
    type: 'okapi',
    records: 'statisticalCodes',
    path: 'statistical-codes?limit=2000&query=cql.allRecords=1 sortby name',
    resourceShouldRefresh: true,
  },
  illPolicies: {
    type: 'okapi',
    path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'illPolicies',
    resourceShouldRefresh: true,
  },
  holdingsTypes: {
    type: 'okapi',
    path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsTypes',
    resourceShouldRefresh: true,
  },
  callNumberTypes: {
    type: 'okapi',
    path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'callNumberTypes',
    resourceShouldRefresh: true,
  },
  holdingsNoteTypes: {
    type: 'okapi',
    path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsNoteTypes',
    resourceShouldRefresh: true,
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
  },
  itemDamagedStatuses: {
    type: 'okapi',
    path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'itemDamageStatuses',
    resourceShouldRefresh: true,
  },
  natureOfContentTerms: {
    type: 'okapi',
    path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'natureOfContentTerms',
    resourceShouldRefresh: true,
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
  }
};

export default stripesConnect(DataProvider);
