import {
  reduce,
  omit,
} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { withStripes } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { buildFilterQuery } from '@folio/stripes-acq-components';

import {
  getQueryTemplate,
  getTemplateForSelectedFromBrowseRecord,
} from './utils';
import {
  browseConfig,
  getFilterConfig,
} from './filterConfig';
import {
  DEFAULT_FILTERS_NUMBER,
  FACETS_TO_REQUEST,
  CQL_FIND_ALL,
  browseModeOptions,
  browseModeMap,
  browseCallNumberOptions,
  queryIndexes,
} from './constants';
import { getAdvancedSearchTemplate } from './routes/buildManifestObject';

function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryValue = queryParams?.query ?? '';
  const { indexes, filters } = browseModeMap[queryIndex] ? browseConfig : getFilterConfig(queryParams.segment);
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  const template = getTemplateForSelectedFromBrowseRecord(queryParams, queryIndex, queryValue);

  if (template) {
    queryTemplate = template;
  }

  if (queryIndex === queryIndexes.ADVANCED_SEARCH) {
    queryTemplate = getAdvancedSearchTemplate(queryValue);
  }

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
      stripes: PropTypes.object.isRequired,
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

    getEndpoint = (queryIndex) => {
      if (queryIndex === browseModeOptions.CONTRIBUTORS) {
        return 'search/contributors/facets';
      }

      if (queryIndex === browseModeOptions.SUBJECTS) {
        return 'search/subjects/facets';
      }

      return 'search/instances/facets';
    }

    getCqlQuery = (isBrowseLookup, query, queryIndex, data) => {
      if (isBrowseLookup) {
        const normalizedFilters = {
          ...Object.entries(query).reduce((acc, [key, value]) => ({
            ...acc,
            [FACETS_TO_REQUEST[key] || key]: value,
          }), {}),
          query: query.query || undefined,
        };

        const otherFilters = omit(normalizedFilters, 'query', 'qindex');
        const hasSelectedFacetOption = Object.values(otherFilters).some(Boolean);

        let queryForBrowseFacets = '';

        const isTypedCallNumber = Object.values(browseCallNumberOptions).includes(queryIndex)
          && queryIndex !== browseCallNumberOptions.CALL_NUMBERS;

        if (hasSelectedFacetOption) {
          if (isTypedCallNumber) {
            queryForBrowseFacets = `callNumberType="${queryIndex}"`;
          }
        } else if (isTypedCallNumber) {
          queryForBrowseFacets = `callNumberType="${queryIndex}"`;
        } else {
          queryForBrowseFacets = 'cql.allRecords=1';
        }

        return buildFilterQuery(
          {
            query: queryForBrowseFacets,
            qindex: normalizedFilters.qindex,
            ...otherFilters,
          },
          _query => _query,
          undefined,
          false,
        );
      }

      return buildQuery(query, {}, { ...data, query }, { log: () => null }) || '';
    }

    fetchFacets = (data, isBrowseLookup) => async (properties = {}) => {
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
      const query = omit(resources.query || this.props.activeFilters, ['sort']);

      // temporary query value
      const params = { query: 'id = *' };
      const facetName = facetToOpen || onMoreClickedFacet || focusedFacet;
      const facetNameToRequest = FACETS_TO_REQUEST[facetName];
      const paramsUrl = new URLSearchParams(window.location.search);
      const queryIndex = query?.qindex || paramsUrl.get('qindex');
      const cqlQuery = this.getCqlQuery(isBrowseLookup, query, queryIndex, data);

      if (cqlQuery) {
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
        const requestPath = this.getEndpoint(queryIndex);
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

  return withStripes(FacetsHoc);
}

export default withFacets;
