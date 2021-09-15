import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

import { FACETS } from '../../constants';

const useFacets = (
  segmentAccordions,
  segmentOptions,
  selectedFacetFilters,
  getNewRecords,
  data,
) => {
  const {
    query: { query, filters = '' },
    onFetchFacets,
    parentResources: { facets },
  } = data;

  const records = facets.records[0];

  const location = useLocation();
  const [accordions, setAccordions] = useState(segmentAccordions);
  const [accordionsData, setAccordionsData] = useState({});
  const [facetsOptions, setFacetsOptions] = useState(segmentOptions);
  const [facetSettings, setFacetSettings] = useState({});
  const [facetNameToOpen, setFacetNameToOpen] = useState('');
  const [showLoadingForAllFacets, setShowLoadingForAllFacets] = useState(false);

  const prevAccordionsState = useRef(accordions);
  const prevFilters = useRef({});
  const prevUrl = useRef({});
  const prevQuery = useRef('');

  const onToggleSection = useCallback(({ id }) => {
    setAccordions(curState => {
      const newState = _.cloneDeep(curState);
      newState[id] = !curState[id];
      return newState;
    });
  }, []);

  const handleFilterSearch = useCallback((filter) => {
    const {
      name,
      value,
    } = filter;

    setFacetSettings(prevFacetSettings => ({
      ...prevFacetSettings,
      [name]: {
        ...prevFacetSettings[name],
        value,
      },
    }));
  }, []);

  const processFilterChange = (selectedFilters, facetName) => {
    if (selectedFilters) {
      const isFilterChanged = prevFilters.current[facetName]?.length !== selectedFilters.length;
      if (isFilterChanged) {
        prevFilters.current[facetName] = selectedFilters;

        setAccordionsData(prevAccordionsData => ({
          ...prevAccordionsData,
          [facetName]: {
            ...prevAccordionsData[facetName],
            isSelected: true,
          },
        }));
      }
    } else {
      const isLastFilterRemoved = prevFilters.current[facetName]?.length && selectedFilters === undefined;
      if (isLastFilterRemoved) {
        prevFilters.current[facetName] = [];

        setAccordionsData(prevAccordionsData => ({
          ...prevAccordionsData,
          [facetName]: {
            ...prevAccordionsData[facetName],
            isSelected: false,
          },
        }));
      }
    }
  };

  const processOnMoreClicking = useCallback((onMoreClickedFacet) => {
    onFetchFacets({ onMoreClickedFacet });

    setFacetSettings(prevFacetSettings => ({
      ...prevFacetSettings,
      [onMoreClickedFacet]: {
        ...prevFacetSettings[onMoreClickedFacet],
        isOnMoreClicked: true,
      },
    }));
  }, [onFetchFacets]);

  const processAllFacets = useCallback(() => {
    const facetsData = { ...accordionsData };

    _.forEach(facetSettings, (settings, facet) => {
      facetsData[facet] = {
        ...facetsData[facet],
        ...settings,
      };
    });

    onFetchFacets({
      accordions,
      accordionsData: facetsData,
    });
  }, [
    accordions,
    accordionsData,
    facetSettings,
    onFetchFacets,
  ]);

  const handleFetchFacets = useCallback((property = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      facetToOpen,
      dateFacet,
    } = property;

    const facetName = facetToOpen || onMoreClickedFacet || focusedFacet || dateFacet;

    if (facetName) {
      setFacetNameToOpen(facetName);
      setShowLoadingForAllFacets(false);
    } else {
      setFacetNameToOpen('');
      setShowLoadingForAllFacets(true);
    }

    if (facetToOpen) {
      onFetchFacets({ facetToOpen });
    } else if (onMoreClickedFacet) {
      processOnMoreClicking(onMoreClickedFacet);
    } else if (focusedFacet) {
      onFetchFacets({ focusedFacet });
    } else {
      processAllFacets();
    }
  }, [
    onFetchFacets,
    processAllFacets,
    processOnMoreClicking
  ]);

  const getIsPending = useCallback((facetName) => {
    return facets.isPending && (showLoadingForAllFacets || facetNameToOpen === facetName);
  }, [
    facets.isPending,
    facetNameToOpen,
    showLoadingForAllFacets
  ]);

  useEffect(() => {
    if (!_.isEmpty(records)) {
      const newRecords = getNewRecords(records);
      setFacetsOptions(prevFacetOptions => ({ ...prevFacetOptions, ...newRecords }));
    }
  }, [records]);

  useEffect(() => {
    let facetToOpen = '';
    let facetToClose = '';

    const isFacetOpened = _.some(prevAccordionsState.current, (prevFacetValue, facetName) => {
      const curFacetValue = accordions[facetName];

      if (curFacetValue !== prevFacetValue) {
        if (curFacetValue) {
          facetToOpen = facetName;
        } else {
          facetToClose = facetName;
        }
        return curFacetValue;
      }
      return false;
    });

    const isUrlChanged = prevUrl.current[facetToOpen] !== location.search;

    if (
      isFacetOpened &&
      isUrlChanged &&
      facetToOpen !== FACETS.CREATED_DATE &&
      facetToOpen !== FACETS.UPDATED_DATE
    ) {
      handleFetchFacets({ facetToOpen });
    } else {
      prevUrl.current[facetToClose] = location.search;
    }

    prevAccordionsState.current = { ...accordions };
  }, [accordions]);

  useEffect(() => {
    if (!_.isEmpty(accordionsData)) {
      const isNoFilterSelected = _.every(accordionsData, value => !value?.isSelected);
      if (!query && prevQuery.current && isNoFilterSelected) return;

      handleFetchFacets();
    }
  }, [accordionsData]);

  useEffect(() => {
    _.forEach(selectedFacetFilters, (selectedFilters, facetName) => {
      processFilterChange(selectedFilters, facetName);
    });
  }, [filters]);

  useEffect(() => {
    const isSomeFacetOpened = _.some(accordions, isFacetOpened => isFacetOpened);
    const isValidQuery = (query && query !== prevQuery.current) || (query !== undefined && prevQuery.current);

    if (isSomeFacetOpened) {
      if (isValidQuery) {
        prevQuery.current = query;
        handleFetchFacets();
      }
    } else if (isValidQuery) {
      prevQuery.current = query;
    }
  }, [query]);

  return [
    accordions,
    onToggleSection,
    handleFetchFacets,
    handleFilterSearch,
    facetsOptions,
    getIsPending,
  ];
};

export default useFacets;
