import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import keyBy from 'lodash/keyBy';

import { stripesConnect } from '@folio/stripes/core';
import { useCommonData } from '@folio/stripes-inventory-components';

import {
  useCallNumberBrowseConfig,
  useClassificationBrowseConfig,
} from '../hooks';
import { DataContext } from '../contexts';

// Provider which loads dictionary data used in various places in ui-inventory.
// The data is fetched once when the ui-inventory module is loaded.
const DataProvider = ({
  children,
  resources,
}) => {
  const { manifest } = DataProvider;

  const { commonData, isCommonDataLoading } = useCommonData();
  const { classificationBrowseConfig, isLoading: isBrowseConfigLoading } = useClassificationBrowseConfig();
  const { callNumberBrowseConfig, isCallNumberConfigLoading } = useCallNumberBrowseConfig();

  const areOtherDataLoading = isCommonDataLoading || isBrowseConfigLoading || isCallNumberConfigLoading;

  const isLoading = useMemo(() => {
    if (areOtherDataLoading) {
      return true;
    }
    // eslint-disable-next-line guard-for-in
    for (const key in manifest) {
      const isResourceLoading = !resources?.[key]?.hasLoaded && !resources?.[key]?.failed && resources?.[key]?.isPending;

      if (manifest[key].type === 'okapi' && isResourceLoading) {
        return true;
      }
    }

    return false;
  }, [resources, manifest, areOtherDataLoading]);

  const data = useMemo(() => {
    const loadedData = {
      ...commonData,
    };

    Object.keys(manifest).forEach(key => {
      loadedData[key] = resources?.[key]?.records ?? [];
    });

    const {
      identifierTypes,
      instanceRelationshipTypes,
      instanceDateTypes,
    } = loadedData;

    loadedData.locationsById = keyBy(loadedData.locations, 'id');
    loadedData.identifierTypesById = keyBy(identifierTypes, 'id');
    loadedData.identifierTypesByName = keyBy(identifierTypes, 'name');
    loadedData.instanceDateTypesByCode = keyBy(instanceDateTypes, 'code');
    loadedData.holdingsSourcesByName = keyBy(commonData.holdingsSources, 'name');
    loadedData.instanceRelationshipTypesById = keyBy(instanceRelationshipTypes, 'id');
    loadedData.classificationBrowseConfig = classificationBrowseConfig;
    loadedData.callNumberBrowseConfig = callNumberBrowseConfig;

    return loadedData;
  }, [
    resources,
    manifest,
    commonData,
    classificationBrowseConfig,
    callNumberBrowseConfig,
  ]);

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
  resources: PropTypes.object.isRequired,
  children: PropTypes.object,
};

DataProvider.manifest = {
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
  instanceRelationshipTypes: {
    type: 'okapi',
    records: 'instanceRelationshipTypes',
    path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
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
  illPolicies: {
    type: 'okapi',
    path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'illPolicies',
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
  subjectSources: {
    type: 'okapi',
    path: 'subject-sources?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'subjectSources',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
  subjectTypes: {
    type: 'okapi',
    path: 'subject-types?limit=1000&query=cql.allRecords=1 sortby name',
    records: 'subjectTypes',
    resourceShouldRefresh: true,
    throwErrors: false,
  },
};

export default stripesConnect(DataProvider);
