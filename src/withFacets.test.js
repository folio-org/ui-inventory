import { render, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import withFacets from './withFacets';
import { queryIndexes } from './constants';

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

describe('withFacets', () => {
  describe('when Advanced search is used', () => {
    it('should fetch facets with the correct params', async () => {
      const mutator = {
        facets: {
          reset: jest.fn(),
          GET: jest.fn().mockResolvedValue(),
        },
      };

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
          query: 'isbn="*test1*" or title==/string "test2" or keyword all "test3*"',
        },
      }));
    });
  });
});
