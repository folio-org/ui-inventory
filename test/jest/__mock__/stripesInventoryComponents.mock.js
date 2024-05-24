jest.mock('@folio/stripes-inventory-components', () => ({
  ...jest.requireActual('@folio/stripes-inventory-components'),
  getSearchTerm: jest.fn(),
  deleteFacetStates: jest.fn(),
  resetFacetStates: jest.fn(),
  resetFacetSearchValue: jest.fn(),
  useFacetStates: jest.fn(() => () => {}),
  useResetFacetStates: jest.fn(() => () => {}),
  useSearchValue: jest.fn(() => () => {}),
}));
