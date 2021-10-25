import React from 'react';
import PropTypes from 'prop-types';
import { flowRight, reduce } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withLocation from '../withLocation';
import { InstancesView } from '../views';
import {
  getFilterConfig,
} from '../filterConfig';
import {
  buildManifestObject,
  buildQuery
} from './buildManifestObject';
import { DataContext } from '../contexts';
import {
  DEFAULT_FILTERS_NUMBER,
  FACETS,
  FACETS_TO_REQUEST
} from '../constants';

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    getParams: PropTypes.func,
  };

  static defaultProps = {
    showSingleResult: false,
    browseOnly: false,
    disableRecordCreation: false,
  };

  static manifest = Object.freeze(buildManifestObject());

  getFacets = (accordions, accordionsData) => {
    let index = 0;

    return reduce(accordions, (accum, isFacetOpened, facetName) => {
      if (
        isFacetOpened &&
        facetName !== FACETS.UPDATED_DATE &&
        facetName !== FACETS.CREATED_DATE
      ) {
        const facetNameToRequest = FACETS_TO_REQUEST[facetName];
        const defaultFiltersNumber = `:${DEFAULT_FILTERS_NUMBER}`;
        const isFacetValue = accordionsData?.[facetName]?.value;
        const isFilterSelected = accordionsData?.[facetName]?.isSelected;
        const isOnMoreClicked = accordionsData?.[facetName]?.isOnMoreClicked;
        const isNeedAllFilters =
          isOnMoreClicked ||
          isFacetValue ||
          isFilterSelected;

        const symbol = index
          ? ','
          : '';

        index++;
        return `${accum}${symbol}${facetNameToRequest}${isNeedAllFilters ? '' : defaultFiltersNumber}`;
      }
      return accum;
    }, '');
  };

  fetchFacets = (data) => async (properties = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      accordions,
      accordionsData,
      facetToOpen,
    } = properties;
    const {
      resources,
      mutator,
    } = this.props;
    const {
      reset,
      GET,
    } = mutator.facets;
    const { query } = resources;

    // temporary query value
    const params = { query: 'id = *' };
    const cqlQuery = buildQuery(query, {}, { ...data, query }, { log: () => null }) || '';
    const facetName = facetToOpen || onMoreClickedFacet || focusedFacet;
    const facetNameToRequest = FACETS_TO_REQUEST[facetName];

    if (cqlQuery) params.query = cqlQuery;

    if (facetToOpen) {
      const defaultFiltersNumber = `:${DEFAULT_FILTERS_NUMBER}`;
      params.facet = `${facetNameToRequest}${defaultFiltersNumber}`;
    } else if (onMoreClickedFacet || focusedFacet) {
      params.facet = facetNameToRequest;
    } else {
      const facets = this.getFacets(accordions, accordionsData);
      if (facets) params.facet = facets;
    }

    try {
      reset();
      await GET({ params });
    } catch (error) {
      throw new Error(error);
    }
  };

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      getParams,
    } = this.props;
    const { segment } = getParams(this.props);
    const { indexes, renderer, indexesES, operators, booleanOperators } = getFilterConfig(segment);
    const { query } = resources;

    return (
      <DataContext.Consumer>
        {data => (
          <InstancesView
            parentResources={resources}
            parentMutator={mutator}
            data={{ ...data, query }}
            browseOnly={browseOnly}
            showSingleResult={showSingleResult}
            onSelectRow={onSelectRow}
            disableRecordCreation={disableRecordCreation}
            renderFilters={renderer({
              ...data,
              query,
              onFetchFacets: this.fetchFacets(data),
              parentResources: resources,
            })}
            segment={segment}
            searchableIndexes={indexes}
            searchableIndexesES={indexesES}
            operators={operators}
            booleanOperators={booleanOperators}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
)(InstancesRoute);
