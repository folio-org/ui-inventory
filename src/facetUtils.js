import React from 'react';
import { FormattedMessage } from 'react-intl';

const getFacetDataMap = (facetData, key = 'id') => {
  const facetDataMap = new Map();

  facetData.forEach(data => {
    const id = data[key];
    facetDataMap.set(id, data);
  });

  return facetDataMap;
};


const parseOption = (entry, totals) => {
  const {
    name = '',
    id,
    label = '',
  } = entry;

  const option = {
    label: name || label,
    value: id,
    count: totals,
  };

  return option;
};


const getSelectedFacetOptionsWithoutCount = (selectedFiltersId, entries, facetDataMap, parse = parseOption) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = entries.find(filter => filter.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const facet = facetDataMap.get(selectedFilterId);

        if (facet) {
          const option = parse(facetDataMap.get(selectedFilterId), 0);
          selectedFiltersWithoutCount.push(option);
        }
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getFacetOptions = (selectedFiltersId, entries, facetData, key, parse = parseOption) => {
  const facetDataMap = getFacetDataMap(facetData, key);

  const restFilters = entries.reduce((accum, entry) => {
    if (!entry.totalRecords) return accum;

    const facet = facetDataMap.get(entry.id);

    if (facet) {
      const option = parse(facetDataMap.get(entry.id), entry.totalRecords);
      accum.push(option);
    }
    return accum;
  }, []);

  return [
    ...restFilters,
    ...getSelectedFacetOptionsWithoutCount(selectedFiltersId, entries, facetDataMap, parse),
  ];
};

const getSuppressedLabel = (id) => (id === 'true' ? 'yes' : 'no');
const getSuppressedValue = (id) => (id === 'true' ? 'true' : 'false');

const getSelectedSuppressedOptionsWithoutCount = (selectedFiltersId, suppressedOptionsRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = suppressedOptionsRecords.find(record => record.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const option = {
          label: <FormattedMessage id={`ui-inventory.${getSuppressedLabel(selectedFilterId)}`} />,
          value: getSuppressedValue(selectedFilterId),
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getSuppressedOptions = (selectedFiltersId, suppressedOptionsRecords) => {
  const restFilter = suppressedOptionsRecords.reduce((accum, { id, totalRecords }) => {
    if (!totalRecords) return accum;

    const option = {
      label: <FormattedMessage id={`ui-inventory.${getSuppressedLabel(id)}`} />,
      value: getSuppressedValue(id),
      count: totalRecords,
    };
    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilter,
    ...getSelectedSuppressedOptionsWithoutCount(selectedFiltersId, suppressedOptionsRecords),
  ];
};

const getSelectedSourceOptionsWithoutCount = (selectedFiltersId, sourceRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = sourceRecords.find(record => record.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const option = {
          label: selectedFilterId,
          value: selectedFilterId,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getSourceOptions = (selectedFiltersId, sourceRecords) => {
  const restFilter = sourceRecords.reduce((accum, { id, totalRecords }) => {
    if (!totalRecords) return accum;

    const option = {
      label: id,
      value: id,
      count: totalRecords,
    };

    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilter,
    ...getSelectedSourceOptionsWithoutCount(selectedFiltersId, sourceRecords),
  ];
};

const getSelectedItemStatusOptions = (selectedFiltersId, entries, facetData, intl) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = entries.find(filter => filter.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const {
          value,
          label,
        } = facetData.find(facet => facet.value === selectedFilterId);

        const option = {
          label: intl.formatMessage({ id: label }),
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getItemStatusesOptions = (selectedFiltersId, entries, facetData, intl) => {
  const restFilters = entries.reduce((accum, entry) => {
    if (!entry.totalRecords) return accum;

    const {
      value,
      label,
    } = facetData.find(facet => facet.value === entry.id);

    const option = {
      label: intl.formatMessage({ id: label }),
      value,
      count: entry.totalRecords,
    };
    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilters,
    ...getSelectedItemStatusOptions(selectedFiltersId, entries, facetData, intl),
  ];
};

const parseStatisticalCodeOption = (entry, count) => {
  const {
    name = '',
    id: value,
    code,
    statisticalCodeType,
  } = entry;
  const label = `${statisticalCodeType?.name}:    ${code} - ${name}`;
  const option = {
    label,
    value,
    count,
  };

  return option;
};

export const processStatisticalCodes = (selectedFiltersId, recordValues, facetData, allFilters, name) => {
  if (facetData) {
    allFilters[name] = getFacetOptions(selectedFiltersId, facetData, recordValues, 'id', parseStatisticalCodeOption);
  }
};

/**
 * Turns facet data into an array of label/value/count representation used by UI
 *
 * @param {String} selectedFiltersId selected filters id (is this being used?)
 * @param {Array} recordValues all dictionary records for given filter
 * @param {Array} facetData ids of records returned from facets
 * @param {Object} allFilters object which holds currently active filters
 * @param {String} name name of the options key defined in https://github.com/folio-org/ui-inventory/blob/8c20a728d41dcf764c7d894a31c19d8d3215316a/src/constants.js#L245
 * @param {String} key - primiary key in dictionary (usually id)
 */
export const processFacetOptions = (selectedFiltersId, recordValues, facetData, allFilters, name, key) => {
  if (facetData) {
    allFilters[name] = getFacetOptions(selectedFiltersId, facetData, recordValues, key);
  }
};

export const processItemsStatuses = (selectedFiltersId, itemStatuses, intl, recordValues, accum, name) => {
  if (itemStatuses) {
    accum[name] = getItemStatusesOptions(selectedFiltersId, recordValues, itemStatuses, intl);
  }
};
