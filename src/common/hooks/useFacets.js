import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

import { useFacetSettings } from '@folio/stripes-inventory-components';

// Facets behavior (useFacets and withFacets):
// - when the user opens a facet, the first 6 options must be fetched for it;
// - when the user clicks the "+More" button under the options, all options for that facet must be fetched;
// - when the user places the cursor in a facet's input field, all options for it must be fetched;
// - when multiple facets are open and the user enters a value in the search box, options must be fetched for all open facets.
// - when multiple facets are open and the user selects an option of any facet, options must be fetched for all open facets.
// - when a facet option is selected, and then another is selected from another facet, the first selected facet option may
// become with count 0, and it should still be visible and moved to the bottom of the provided options. This is done in `getFacetOptions`.
// - the "Contributor" search utilizes distinct queries for the "Search" lookup and the "Browse" search. When a user
// selects a contributor record from the "Browse" search, they are redirected to the "Search" lookup. This redirection
// request uses one specific query. If the user then clicks the search button again, without making any changes,
// a different query is generated because the `selectedBrowseResult` parameter is removed. Therefore, even if the only
// change made is to the `selectedBrowseResult`, all open facets need to be fetched.

const useFacets = (
  segmentAccordions,
  segmentOptions,
  selectedFacetFilters,
  getNewRecords,
  data,
  isFetchFacetsAfterReset = true,
) => {
  const {
    query: {
      query,
      qindex,
      filters = '',
      selectedBrowseResult,
    },
    onFetchFacets,
    parentResources: { facets },
  } = data;

  const records = facets.records[0];

  const location = useLocation();
  const [accordions, setAccordions] = useState(segmentAccordions);
  const [accordionsData, setAccordionsData] = useState({});
  const [facetsOptions, setFacetsOptions] = useState(segmentOptions);
  const [facetSettings, setFacetSettings] = useFacetSettings();
  const [facetNameToOpen, setFacetNameToOpen] = useState('');
  const [showLoadingForAllFacets, setShowLoadingForAllFacets] = useState(false);

  const prevAccordionsState = useRef(accordions);
  const prevFilters = useRef({});
  const prevUrl = useRef({});
  const prevQindex = useRef('');
  const isSearchOptionChanged = useRef(false);
  const isReset = useRef(false);

  const onToggleSection = useCallback(({ id }) => {
    setAccordions(curState => {
      const newState = _.cloneDeep(curState);
      newState[id] = !curState[id];
      return newState;
    });
  }, []);

  const onUnregisterAccordion = useCallback((id) => {
    setAccordions(curState => {
      const newState = _.cloneDeep(curState);
      newState[id] = false;
      return newState;
    });
    delete prevUrl.current[id];
  }, []);

  const handleFilterSearch = useCallback((filter) => {
    const {
      name,
      value,
    } = filter;
    setFacetSettings(name, { value });
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

    setFacetSettings(onMoreClickedFacet, { isOnMoreClicked: true });
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
    isSearchOptionChanged.current = !query && !filters && qindex && prevQindex.current && qindex !== prevQindex.current;
    isReset.current = !query && !filters && !qindex;
    prevQindex.current = qindex;
  }, [qindex, filters, query]);

  useEffect(() => {
    if (!_.isEmpty(records)) {
      const newRecords = getNewRecords(records);
      setFacetsOptions(prevFacetOptions => ({ ...prevFacetOptions, ...newRecords }));
    }
  }, [records]);

  useEffect(() => {
    let facetToOpen = '';

    const isFacetOpened = _.some(prevAccordionsState.current, (prevFacetValue, facetName) => {
      const curFacetValue = accordions[facetName];

      if (curFacetValue !== prevFacetValue && curFacetValue) {
        facetToOpen = facetName;
        return curFacetValue;
      }
      return false;
    });

    const isUrlChanged = prevUrl.current[facetToOpen] !== location.search;

    if (
      isFacetOpened &&
      isUrlChanged &&
      !facetToOpen.match(/createdDate/i) &&
      !facetToOpen.match(/updatedDate/i)
    ) {
      handleFetchFacets({ facetToOpen });
      prevUrl.current[facetToOpen] = location.search;
    }

    prevAccordionsState.current = { ...accordions };
  }, [accordions]);

  useEffect(() => {
    if (!_.isEmpty(accordionsData)) {
      // When there is a value in the search box and any facet option is selected and the user resets the search,
      // and `isFetchFacetsAfterReset` is true, then two useEffects are called, one is tracking `query` and another is
      // tracking `accordionsData`, hence 2 calls are fired, so let's check url to make only 1 call.
      const areOpenFacetsAlreadyFetched = prevUrl.current.all === location.search;

      if (isSearchOptionChanged.current || (!isFetchFacetsAfterReset && isReset.current) || areOpenFacetsAlreadyFetched) {
        return;
      }
      handleFetchFacets();
      prevUrl.current.all = location.search;
    }
  }, [accordionsData]);

  useEffect(() => {
    _.forEach(selectedFacetFilters, (selectedFilters, facetName) => {
      processFilterChange(selectedFilters, facetName);
    });
  }, [filters]);

  useEffect(() => {
    const isSomeFacetOpened = _.some(accordions, isFacetOpened => isFacetOpened);

    if (isSearchOptionChanged.current || (!isFetchFacetsAfterReset && isReset.current)) {
      return;
    }

    if (isSomeFacetOpened) {
      handleFetchFacets();
      prevUrl.current.all = location.search;
    }
  }, [query, selectedBrowseResult]);

  return [
    accordions,
    onToggleSection,
    handleFetchFacets,
    handleFilterSearch,
    facetsOptions,
    getIsPending,
    onUnregisterAccordion,
  ];
};

export default useFacets;
