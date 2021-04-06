import keyBy from 'lodash/keyBy';
import React, { useCallback, useMemo } from 'react';
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

  const isLoading = useCallback(() => {
    for (const key in manifest) {
      if (manifest[key].type === 'okapi' && !(resources?.[key]?.hasLoaded)) {
        return true;
      }
    }

    return false;
  }, [resources, manifest]);

  const data = useMemo(() => {
    const loadedData = {};

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    const {
      locations,
      identifierTypes,
      holdingsSources,
      instanceRelationshipTypes,
    } = loadedData;

    loadedData.locationsById = keyBy(locations, 'id');
    loadedData.identifierTypesById = keyBy(identifierTypes, 'id');
    loadedData.identifierTypesByName = keyBy(identifierTypes, 'name');
    loadedData.holdingsSourcesByName = keyBy(holdingsSources, 'name');
    loadedData.instanceRelationshipTypesById = keyBy(instanceRelationshipTypes, 'id');

    return loadedData;
  }, [resources, manifest]);

  if (isLoading()) {
    return null;
  }

  return (
    <DataContext.Provider value={data}>
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
  },
  contributorTypes: {
    type: 'okapi',
    records: 'contributorTypes',
    path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
  },
  contributorNameTypes: {
    type: 'okapi',
    records: 'contributorNameTypes',
    path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
  },
  instanceFormats: {
    type: 'okapi',
    records: 'instanceFormats',
    path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
  },
  instanceTypes: {
    type: 'okapi',
    records: 'instanceTypes',
    path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  classificationTypes: {
    type: 'okapi',
    records: 'classificationTypes',
    path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  alternativeTitleTypes: {
    type: 'okapi',
    records: 'alternativeTitleTypes',
    path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  locations: {
    type: 'okapi',
    records: 'locations',
    path: 'locations?limit=1000&query=cql.allRecords=1 sortby name',
  },
  instanceRelationshipTypes: {
    type: 'okapi',
    records: 'instanceRelationshipTypes',
    path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  instanceStatuses: {
    type: 'okapi',
    records: 'instanceStatuses',
    path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
  },
  modesOfIssuance: {
    type: 'okapi',
    records: 'issuanceModes',
    path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
  },
  instanceNoteTypes: {
    type: 'okapi',
    path: 'instance-note-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'instanceNoteTypes',
  },
  electronicAccessRelationships: {
    type: 'okapi',
    records: 'electronicAccessRelationships',
    path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
  },
  statisticalCodeTypes: {
    type: 'okapi',
    records: 'statisticalCodeTypes',
    path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
  statisticalCodes: {
    type: 'okapi',
    records: 'statisticalCodes',
    path: 'statistical-codes?limit=2000&query=cql.allRecords=1 sortby name',
  },
  illPolicies: {
    type: 'okapi',
    path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'illPolicies',
  },
  holdingsTypes: {
    type: 'okapi',
    path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsTypes',
  },
  callNumberTypes: {
    type: 'okapi',
    path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'callNumberTypes',
  },
  holdingsNoteTypes: {
    type: 'okapi',
    path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'holdingsNoteTypes',
  },
  itemNoteTypes: {
    type: 'okapi',
    path: 'item-note-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'itemNoteTypes',
  },
  itemDamagedStatuses: {
    type: 'okapi',
    path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'itemDamageStatuses',
  },
  natureOfContentTerms: {
    type: 'okapi',
    path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'natureOfContentTerms',
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'mtypes',
  },
  loanTypes: {
    type: 'okapi',
    path: 'loan-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'loantypes',
  },
  tags: {
    path: 'tags?limit=10000',  // the same as Tags component in stripes-smart-components
    records: 'tags',
    throwErrors: false,
    type: 'okapi',
  },
  holdingsSources: {
    type: 'okapi',
    path: 'holdings-sources',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'holdingsRecordsSources',
  }
};

export default stripesConnect(DataProvider);
