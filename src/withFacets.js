import { reduce } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  getQueryTemplate,
} from './utils';
import {
  getFilterConfig,
} from './filterConfig';
import {
  DEFAULT_FILTERS_NUMBER,
  FACETS,
  FACETS_TO_REQUEST,
  CQL_FIND_ALL
} from './constants';

function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, filters } = getFilterConfig(queryParams.segment);
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryTemplate = getQueryTemplate(queryIndex, indexes);

  const cql = makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    {},
    filters,
    2,
    null,
    false,
  )(queryParams, pathComponents, resourceData, logger, props);

  return cql === undefined
    ? CQL_FIND_ALL
    : cql;
}

function withFacets(WrappedComponent) {
  class FacetsHoc extends React.Component {
    static manifest = Object.freeze(
      {
        ...WrappedComponent.manifest,
        facets: {
          type: 'okapi',
          records: 'facets',
          path: 'search/instances/facets',
          fetch: false,
          accumulate: true,
          throwErrors: false,
        },
      },
    );

    static propTypes = {
      resources: PropTypes.shape({
        query: PropTypes.object,
        facets: PropTypes.object,
      }),
      mutator: PropTypes.shape({
        facets: PropTypes.shape({
          GET: PropTypes.func.isRequired,
          reset: PropTypes.func,
        }),
      }),
    };

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
        if (facets) {
          params.facet = facets;
        } else {
          return;
        }
      }

      try {
        reset();
        await GET({ params });
      } catch (error) {
        throw new Error(error);
      }
    };

    render() {
      return (
        <WrappedComponent
          fetchFacets={this.fetchFacets}
          {...this.props}
        />
      );
    }
  }

  return FacetsHoc;
}

export default withFacets;
