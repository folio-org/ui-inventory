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
  browseCallNumberIndexToId: {
    callNumbers: 'all',
    dewey: 'dewey',
    lc: 'lc',
    local: 'local',
    nlm: 'nlm',
    other: 'other',
    sudoc: 'sudoc',
  },
  FACETS: {
    SHARED: 'shared',
    CALL_NUMBERS_SHARED: 'callNumbersShared',
    CLASSIFICATION_SHARED: 'classificationShared',
    CONTRIBUTORS_SHARED: 'contributorsShared',
    SUBJECTS_SHARED: 'subjectsShared',
    HELD_BY: 'tenantId',
    CONTRIBUTORS_HELD_BY: 'contributorsTenantId',
    SUBJECTS_HELD_BY: 'subjectsTenantId',
    CALL_NUMBERS_HELD_BY: 'callNumbersTenantId',
    NEW_CALL_NUMBERS_HELD_BY: 'newCallNumbersTenantId',
    EFFECTIVE_LOCATION: 'effectiveLocation',
    CALL_NUMBERS_EFFECTIVE_LOCATION: 'callNumbersEffectiveLocation',
    LANGUAGE: 'language',
    RESOURCE: 'resource',
    FORMAT: 'format',
    MODE: 'mode',
    NATURE_OF_CONTENT: 'natureOfContent',
    STAFF_SUPPRESS: 'staffSuppress',
    INSTANCES_DISCOVERY_SUPPRESS: 'instancesDiscoverySuppress',
    STATISTICAL_CODE_IDS: 'statisticalCodeIds',
    HOLDINGS_STATISTICAL_CODE_IDS: 'holdingsStatisticalCodeIds',
    ITEMS_STATISTICAL_CODE_IDS: 'itemsStatisticalCodeIds',
    ITEMS_DISCOVERY_SUPPRESS: 'itemsDiscoverySuppress',
    HOLDINGS_DISCOVERY_SUPPRESS: 'holdingsDiscoverySuppress',
    DATE_RANGE: 'dateRange',
    CREATED_DATE: 'createdDate',
    UPDATED_DATE: 'updatedDate',
    HOLDINGS_CREATED_DATE: 'holdingsCreatedDate',
    HOLDINGS_UPDATED_DATE: 'holdingsUpdatedDate',
    ITEMS_CREATED_DATE: 'itemsCreatedDate',
    ITEMS_UPDATED_DATE: 'itemsUpdatedDate',
    SOURCE: 'source',
    STATUS: 'instanceStatus',
    INSTANCES_TAGS: 'instancesTags',
    HOLDINGS_TAGS: 'holdingsTags',
    ITEMS_TAGS: 'itemsTags',
    MATERIAL_TYPE: 'materialType',
    ITEM_STATUS: 'itemStatus',
    HOLDINGS_PERMANENT_LOCATION: 'holdingsPermanentLocation',
    HOLDINGS_SOURCE: 'holdingsSource',
    NAME_TYPE: 'nameType',
    SEARCH_CONTRIBUTORS: 'searchContributors',
    SEARCH_SUBJECT_SOURCE: 'searchSubjectSource',
    SEARCH_SUBJECT_TYPE: 'searchSubjectType',
    HOLDINGS_TYPE: 'holdingsType',
    AUTHORITY_ID: 'authorityId',
    SUBJECT_SOURCE: 'subjectSource',
    SUBJECT_TYPE: 'subjectType',
  },
}));
