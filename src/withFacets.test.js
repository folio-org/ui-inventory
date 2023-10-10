import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import withFacets from './withFacets';
import {
  FACETS,
  queryIndexes,
  FACETS_CQL,
  browseCallNumberOptions,
} from './constants';

const WrappedComponent = ({
  fetchFacets,
  data = {},
  properties = {},
}) => {
  return (
    <button
      type="button"
      onClick={() => fetchFacets(data)(properties)}
    >
      fetchFacetsButton
    </button>
  );
};

const FacetsHoc = withFacets(WrappedComponent);

const mutator = {
  facets: {
    reset: jest.fn(),
    GET: jest.fn().mockResolvedValue(),
  },
};

describe('withFacets', () => {
  describe('when opening a contributots shared facet', () => {
    it('should make a request with correct params', () => {
      const resources = {
        query: {
          qindex: queryIndexes.CONTRIBUTOR,
          query: '',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
          query: 'name=*',
        },
      }));
    });
  });

  describe('when opening a subjects shared facet', () => {
    it('should make a request with correct params', () => {
      const resources = {
        query: {
          qindex: queryIndexes.SUBJECT,
          query: '',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: FACETS.SUBJECTS_SHARED }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
          query: 'value=*',
        },
      }));
    });
  });

  describe('when using call numbers browse', () => {
    it('should make a request with correct params', () => {
      const resources = {
        query: {
          qindex: browseCallNumberOptions.CALL_NUMBERS,
          query: 'test',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: FACETS.SHARED }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.SHARED}:6`,
          query: 'id = *',
        },
      }));
    });
  });

  describe('when using call numbers sub-type browse', () => {
    it('should make a request with correct params', () => {
      const resources = {
        query: {
          qindex: browseCallNumberOptions.DEWEY,
          query: 'test',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: FACETS.SHARED }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.SHARED}:6`,
          query: 'callNumberType="dewey"',
        },
      }));
    });
  });

  describe('when Advanced search is used', () => {
    it('should fetch facets with the correct params', async () => {
      const resources = {
        query: {
          qindex: queryIndexes.ADVANCED_SEARCH,
          query: 'isbn containsAll test1 or title exactPhrase test2 or keyword startsWith test3',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: 'source' }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: 'source:6',
          query: 'isbn="*test1*" or title=="test2" or keyword all "test3*"',
        },
      }));
    });
  });
});
