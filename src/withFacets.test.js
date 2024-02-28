import React from 'react';

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
  browseModeOptions,
} from './constants';

const WrappedComponent = ({
  fetchFacets,
  data = {},
  properties = {},
  isBrowseLookup,
}) => {
  return (
    <button
      type="button"
      onClick={() => fetchFacets(data, isBrowseLookup)(properties)}
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when query contains sort parameter', () => {
    it('should remove the sort parameter from request', () => {
      const resources = {
        query: {
          qindex: browseModeOptions.CONTRIBUTORS,
          query: '',
          sort: 'relevance',
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
          isBrowseLookup
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
          query: '(cql.allRecords=1)',
        },
        path: 'search/contributors/facets',
      }));
    });
  });

  describe('when active filters contain sort parameter', () => {
    it('should remove the sort parameter from request', () => {
      const activeFilters = {
        qindex: browseModeOptions.CONTRIBUTORS,
        query: '',
        sort: 'relevance',
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={{}}
          activeFilters={activeFilters}
          properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
          isBrowseLookup
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
          query: '(cql.allRecords=1)',
        },
        path: 'search/contributors/facets',
      }));
    });
  });

  describe('when opening a contributors shared facet', () => {
    describe('and there are no selected options in other facets', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.CONTRIBUTORS,
            query: '',
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: '(cql.allRecords=1)',
          },
          path: 'search/contributors/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.CONTRIBUTORS,
            query: '',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/contributors/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet and there is a value in the search box', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.CONTRIBUTORS,
            query: 'Marc Twain',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.CONTRIBUTORS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/contributors/facets',
        }));
      });
    });
  });

  describe('when opening a subjects shared facet', () => {
    describe('and there are no selected options in other facets', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.SUBJECTS,
            query: '',
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SUBJECTS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: '(cql.allRecords=1)',
          },
          path: 'search/subjects/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.SUBJECTS,
            query: '',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SUBJECTS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/subjects/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet and there is a value in the search box', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseModeOptions.SUBJECTS,
            query: 'Marc Twain',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SUBJECTS_SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.INSTANCES_SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/subjects/facets',
        }));
      });
    });
  });

  describe('when opening call numbers browse shared facet', () => {
    describe('and there are no selected options in other facets', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.CALL_NUMBERS,
            query: '',
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: '(cql.allRecords=1)',
          },
          path: 'search/instances/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.CALL_NUMBERS,
            query: '',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/instances/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet and there is a value in the search box', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.CALL_NUMBERS,
            query: 'Marc Twain',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: 'instances.tenantId==("college")',
          },
          path: 'search/instances/facets',
        }));
      });
    });
  });

  describe('when opening call numbers sub-type browse shared facet', () => {
    describe('and there are no selected options in other facets', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.DEWEY,
            query: '',
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: '(callNumberType="dewey")',
          },
          path: 'search/instances/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.DEWEY,
            query: '',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: '(callNumberType="dewey") and instances.tenantId==("college")',
          },
          path: 'search/instances/facets',
        }));
      });
    });

    describe('and there is a selected option in another facet and there is a value in the search box', () => {
      it('should make a request with correct request options', () => {
        const resources = {
          query: {
            qindex: browseCallNumberOptions.DEWEY,
            query: 'Marc Twain',
            contributorsTenantId: ['college'],
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={{ facetToOpen: FACETS.SHARED }}
            isBrowseLookup
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6`,
            query: '(callNumberType="dewey") and instances.tenantId==("college")',
          },
          path: 'search/instances/facets',
        }));
      });
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

  describe('when user opens a facet', () => {
    it('should fetch only 6 options for this facet', () => {
      const resources = {
        query: {},
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
        path: 'search/instances/facets',
      }));
    });
  });

  describe('when user clicks the "+More" button under options', () => {
    it('should fetch all options for this facet', () => {
      const resources = {
        query: {},
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ onMoreClickedFacet: FACETS.RESOURCE }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCE_TYPE}`,
          query: 'id = *',
        },
        path: 'search/instances/facets',
      }));
    });
  });

  describe('when user places the cursor in the facet`s input field', () => {
    it('should fetch all options for this facet', () => {
      const resources = {
        query: {},
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={{ focusedFacet: FACETS.RESOURCE }}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCE_TYPE}`,
          query: 'id = *',
        },
        path: 'search/instances/facets',
      }));
    });
  });

  describe('when several facets are open and user enters a value in the search box', () => {
    it('should fetch options for all open facets', () => {
      const resources = {
        query: {
          qindex: 'title',
          query: 'Marc',
        },
      };

      const properties = {
        accordions: { resource: true, format: true },
        accordionsData: {},
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={properties}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCE_TYPE}:6,${FACETS_CQL.INSTANCE_FORMAT}:6`,
          query: 'title all "Marc"',
        },
        path: 'search/instances/facets',
      }));
    });
  });

  describe('when several facets are open and user selects an option of any facet', () => {
    it('should fetch options for all open facets', () => {
      const resources = {
        query: {
          query: '',
          filters: 'resource.6312d172-f0cf-40f6-b27d-9fa8feaf332f',
        },
      };

      const properties = {
        accordions: { resource: true, format: true },
        accordionsData: {
          resource: { isSelected: true },
        },
      };

      const { getByText } = render(
        <FacetsHoc
          mutator={mutator}
          resources={resources}
          properties={properties}
        />
      );

      fireEvent.click(getByText('fetchFacetsButton'));

      expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
        params: {
          facet: `${FACETS_CQL.INSTANCE_TYPE},${FACETS_CQL.INSTANCE_FORMAT}:6`,
          query: 'instanceTypeId=="6312d172-f0cf-40f6-b27d-9fa8feaf332f"',
        },
        path: 'search/instances/facets',
      }));
    });
  });

  describe('when several facets are open and user selects an option of one facet', () => {
    describe('and for another one the "+More" button is clicked', () => {
      it('should fetch all options for the facet with selected option and for the facet with +More clicked', () => {
        const resources = {
          query: {
            query: '',
            filters: 'format.8d511d33-5e85-4c5d-9bce-6e3c9cd0c324',
          },
        };

        const properties = {
          accordions: { shared: true, resource: true, format: true },
          accordionsData: {
            resource: { isOnMoreClicked: true },
            format: { isSelected: true },
          },
        };

        const { getByText } = render(
          <FacetsHoc
            mutator={mutator}
            resources={resources}
            properties={properties}
          />
        );

        fireEvent.click(getByText('fetchFacetsButton'));

        expect(mutator.facets.GET).toHaveBeenCalledWith(expect.objectContaining({
          params: {
            facet: `${FACETS_CQL.SHARED}:6,${FACETS_CQL.INSTANCE_TYPE},${FACETS_CQL.INSTANCE_FORMAT}`,
            query: expect.anything(),
          },
        }));
      });
    });
  });

  describe('when user has staff suppress facet permission', () => {
    it('should not apply staffSuppress.false facet by default', () => {
      const resources = {
        query: {},
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
        path: 'search/instances/facets',
      }));
    });
  });
});
