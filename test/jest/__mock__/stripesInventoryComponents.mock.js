jest.mock('@folio/stripes-inventory-components', () => ({
  ...jest.requireActual('@folio/stripes-inventory-components'),
  getSearchTerm: jest.fn(),
  deleteFacetStates: jest.fn(),
  resetFacetStates: jest.fn(),
  resetFacetSearchValue: jest.fn(),
  useFacetStates: jest.fn(() => () => {}),
  useResetFacetStates: jest.fn(() => () => {}),
  useSearchValue: jest.fn(() => () => {}),
  useLocationsQuery: jest.fn().mockReturnValue({
    locations: [],
    isLoading: false,
  }),
  useCommonData: jest.fn().mockReturnValue({
    commonData: [],
    isCommonDataLoading: false,
  }),
  InstanceFilters: jest.fn(() => <div>InstanceFilters</div>),
  HoldingsRecordFilters: jest.fn(() => <div>HoldingsRecordFilters</div>),
  ItemFilters: jest.fn(() => <div>ItemFilters</div>),
  buildSearchQuery: jest.fn(),
  SORT_OPTIONS: {
    TITLE: 'title',
    CONTRIBUTORS: 'contributors',
    RELEVANCE: 'relevance',
  },
}));
