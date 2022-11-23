import { reduce } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  getQueryTemplate,
} from './utils';
import {
  browseConfig,
  getFilterConfig,
} from './filterConfig';
import {
  DEFAULT_FILTERS_NUMBER,
  FACETS,
  FACETS_TO_REQUEST,
  FACETS_ENDPOINTS,
  CQL_FIND_ALL,
  browseModeOptions,
  browseModeMap,
} from './constants';

function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const queryIndex = queryParams?.qindex ?? 'all';
  const { indexes, filters } = browseModeMap[queryIndex] ? browseConfig : getFilterConfig(queryParams.segment);
  const queryTemplate = getQueryTemplate(queryIndex, indexes);

  // reset qindex otherwise makeQueryFunction does not use queryTemplate
  // https://github.com/folio-org/stripes-smart-components/blob/e918a620ad2ac2c5b06ce121cd0e061a03bcfdf6/lib/SearchAndSort/makeQueryFunction.js#L46
  // https://issues.folio.org/browse/UIIN-2189
  resourceData.query = { ...resourceData.query, qindex: '' };

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
      activeFilters: PropTypes.object,
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
          !facetName.match(/createdDate/i) &&
          !facetName.match(/updatedDate/i)
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

      // Browse page does not use query resource: query params are stored in "activeFilters" of "useLocationFilters" hook
      const query = resources.query || this.props.activeFilters;

      // temporary query value
      const params = { query: 'id = *' };
      const cqlQuery = buildQuery(query, {}, { ...data, query }, { log: () => null }) || '';
      const facetName = facetToOpen || onMoreClickedFacet || focusedFacet;
      const facetNameToRequest = FACETS_TO_REQUEST[facetName];
      const paramsUrl = new URLSearchParams(window.location.search);
      const queryIndex = paramsUrl.get('qindex') || query?.qindex;

      if (facetName === FACETS.NAME_TYPE) {
        params.query = 'contributorNameTypeId=*';
      } else if (cqlQuery && queryIndex === browseModeOptions.CALL_NUMBERS) {
        params.query = 'callNumber=""';
      } else if (cqlQuery && queryIndex !== browseModeOptions.CALL_NUMBERS) {
        params.query = cqlQuery;
      }

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
        const requestPath = FACETS_ENDPOINTS[facetName] || 'search/instances/facets';
        await GET({ path: requestPath, params });
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
