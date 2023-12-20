import { FormattedMessage } from 'react-intl';
import {
  getFacetOptions,
  getSuppressedOptions,
  getSourceOptions,
  getItemStatusesOptions,
  processStatisticalCodes,
  processFacetOptions,
  processItemsStatuses,
} from './facetUtils';
import {FACETS} from "./constants";

describe('getFacetOptions', () => {
  it('getFacetOptions returns the expected options with valid input', () => {
    const selectedFiltersId = ['filter1', 'filter2'];
    const entries = [
      { id: 'filter1', totalRecords: 2 },
      { id: 'filter3', totalRecords: 4 },
    ];
    const facetData = [
      { id: 'filter1', name: 'Filter 1' },
      { id: 'filter2', name: 'Filter 2' },
      { id: 'filter3', name: 'Filter 3' },
    ];
    const key = 'id';
    const expectedOptions = [
      { label: 'Filter 1', value: 'filter1', count: 2 },
      { label: 'Filter 3', value: 'filter3', count: 4 },
      { label: 'Filter 2', value: 'filter2', count: 0 },
    ];
    expect(getFacetOptions(selectedFiltersId, entries, facetData, key)).toEqual(expectedOptions);
  });
  it('getFacetOptions handles invalid id values in entries correctly', () => {
    const selectedFiltersId = ['filter1', 'filter2'];
    const entries = [
      { id: 'filter1', totalRecords: 2 },
      { id: 'invalid', totalRecords: 4 },
    ];
    const facetData = [
      { id: 'filter1', name: 'Filter 1' },
      { id: 'filter2', name: 'Filter 2' },
      { id: 'filter3', name: 'Filter 3' },
    ];
    const key = 'id';
    const expectedOptions = [
      { label: 'Filter 1', value: 'filter1', count: 2 },
      { id: 'invalid', isDeleted: true },
      { label: 'Filter 2', value: 'filter2', count: 0 },
    ];
    expect(getFacetOptions(selectedFiltersId, entries, facetData, key)).toEqual(expectedOptions);
  });
});

describe('getSuppressedOptions', () => {
  it('returns an array of objects with the correct selectedFiltersId & suppressedOptionsRecords', () => {
    const selectedFiltersId = [];
    const suppressedOptionsRecords = [{ id: 'foo', totalRecords: 10 }];
    const result = getSuppressedOptions(selectedFiltersId, suppressedOptionsRecords);
    expect(result).toEqual([
      {
        label: expect.any(Object),
        value: expect.any(String),
        count: expect.any(Number),
      },
    ]);
  });
  it('should return the correct options when <no> filters are selected', () => {
    const selectedFiltersId = [];
    const suppressedOptionsRecords = [
      { id: 'on_order', totalRecords: 5 },
      { id: 'suppressed', totalRecords: 0 },
    ];
    const expectedOptions = [
      {
        label: <FormattedMessage id="ui-inventory.no" />,
        value: expect.any(String),
        count: 5,
      },
    ];
    expect(getSuppressedOptions(selectedFiltersId, suppressedOptionsRecords)).toEqual(expectedOptions);
  });
  it('should return the correct options when some filters are selected', () => {
    const selectedFiltersId = ['on_order', 'suppressed'];
    const suppressedOptionsRecords = [
      { id: 'on_order', totalRecords: 5 },
      { id: 'suppressed', totalRecords: 10 },
    ];
    const expectedOptions = [
      {
        label: <FormattedMessage id="ui-inventory.no" />,
        value: expect.any(String),
        count: 5,
      },
      {
        label: <FormattedMessage id="ui-inventory.no" />,
        value: expect.any(String),
        count: 10,
      },
    ];
    expect(getSuppressedOptions(selectedFiltersId, suppressedOptionsRecords)).toEqual(expectedOptions);
  });
});

describe('getSourceOptions', () => {
  it('returns an array of options with the correct shape for each source record with a totalRecords property', () => {
    const sourceRecords = [
      { id: 'source1', totalRecords: 10 },
      { id: 'source2', totalRecords: 20 },
      { id: 'source3', totalRecords: 30 },
    ];
    const selectedFiltersId = ['source1'];
    const expectedOptions = [
      { label: 'source1', value: 'source1', count: 10 },
      { label: 'source2', value: 'source2', count: 20 },
      { label: 'source3', value: 'source3', count: 30 },
    ];
    expect(getSourceOptions(selectedFiltersId, sourceRecords)).toEqual(expectedOptions);
  });
  it('returns an array of options with the correct shape for each selected filter ID that is not in the source records array', () => {
    const sourceRecords = [
      { id: 'source1', totalRecords: 10 },
      { id: 'source2', totalRecords: 20 },
      { id: 'source3', totalRecords: 30 },
    ];
    const selectedFiltersId = ['source1', 'source4'];
    const expectedOptions = [
      { label: 'source1', value: 'source1', count: 10 },
      { label: 'source2', value: 'source2', count: 20 },
      { label: 'source3', value: 'source3', count: 30 },
      { label: 'source4', value: 'source4', count: 0 },
    ];
    expect(getSourceOptions(selectedFiltersId, sourceRecords)).toEqual(expectedOptions);
  });
  it('returns an empty array when both the sourceRecords and selectedFiltersId parameters are empty arrays', () => {
    const sourceRecords = [];
    const selectedFiltersId = [];
    expect(getSourceOptions(selectedFiltersId, sourceRecords)).toEqual([]);
  });
});

describe('getItemStatusesOptions', () => {
  it('returns an array of objects with the correct keys and values', () => {
    const selectedFiltersId = ['filter1', 'filter2'];
    const entries = [
      { id: 'filter1', totalRecords: 10 },
      { id: 'filter2', totalRecords: 20 },
    ];
    const facetData = [
      { value: 'filter1', label: 'Filter 1' },
      { value: 'filter2', label: 'Filter 2' },
    ];
    const intl = {
      formatMessage: jest.fn(() => 'Formatted message'),
    };
    const options = getItemStatusesOptions(selectedFiltersId, entries, facetData, intl);
    expect(intl.formatMessage).toHaveBeenCalledTimes(2);
    expect(options).toEqual([
      { label: 'Formatted message', value: 'filter1', count: 10 },
      { label: 'Formatted message', value: 'filter2', count: 20 },
    ]);
  });

  it('includes all filters in entries with a totalRecords value in the returned array', () => {
    const selectedFiltersId = ['filter1', 'filter2'];
    const entries = [
      { id: 'filter1', totalRecords: 10 },
      { id: 'filter2', totalRecords: 0 },
      { id: 'filter3', totalRecords: 20 },
    ];
    const facetData = [
      { value: 'filter1', label: 'Filter 1' },
      { value: 'filter2', label: 'Filter 2' },
      { value: 'filter3', label: 'Filter 3' },
    ];
    const intl = {
      formatMessage: jest.fn(() => 'Formatted message'),
    };
    const options = getItemStatusesOptions(selectedFiltersId, entries, facetData, intl);
    expect(options).toEqual([
      { label: 'Formatted message', value: 'filter1', count: 10 },
      { label: 'Formatted message', value: 'filter3', count: 20 },
    ]);
  });
});

describe('processStatisticalCodes', () => {
  const selectedFiltersId = new Set(['123', '456']);
  const facetData = [
    { id: '123', name: 'Statistical Code 1', code: 'SC1', statisticalCodeType: { name: 'Type A' } },
    { id: '456', name: 'Statistical Code 2', code: 'SC2', statisticalCodeType: { name: 'Type B' } },
    { id: '789', name: 'Statistical Code 3', code: 'SC3', statisticalCodeType: { name: 'Type C' } },
  ];
  const recordValues = [
    { id: '123', totalRecords: 100 },
    { id: '456', totalRecords: 50 },
    { id: '789', totalRecords: 0 },
  ];
  const allFilters = {};
  const name = 'statisticalCodes';
  const facetName = FACETS.EFFECTIVE_LOCATION;
  const handleFetchFacets = jest.fn();
  it('extracts statistical code options from facetData and recordValues', () => {
    processStatisticalCodes(facetName, selectedFiltersId, recordValues, facetData, allFilters, name, handleFetchFacets);
    expect(allFilters[name]).toHaveLength(0);
  });
  it('filters out statistical code options without totalRecords', () => {
    const options = getFacetOptions(selectedFiltersId, recordValues, facetData, 'id');
    expect(options).toHaveLength(2);
  });
  it('includes selected statistical code options without totalRecords', () => {
    const options = getFacetOptions(selectedFiltersId, recordValues, facetData, 'id');
    expect(options).toEqual([
      { count: 100, label: 'Statistical Code 1', value: '123' },
      { count: 50, label: 'Statistical Code 2', value: '456' },
    ]);
  });
  it('formats label for each statistical code option using statisticalCodeType and code', () => {
    const options = getFacetOptions(selectedFiltersId, recordValues, facetData, 'id');
    expect(options[0]).toHaveProperty('label', 'Statistical Code 1');
  });
  it('sets value and count properties for each statistical code option', () => {
    const options = getFacetOptions(selectedFiltersId, recordValues, facetData, 'id');
    expect(options[0]).toMatchObject({ value: '123', count: 100 });
  });
});

describe('processFacetOptions', () => {
  it('does not set allFilters[name] when facetData is not provided', () => {
    const selectedFiltersId = [];
    const recordValues = [];
    const facetData = null;
    const allFilters = {};
    const name = 'test';
    const facetName = FACETS.EFFECTIVE_LOCATION;
    const handleFetchFacets = jest.fn();
    processFacetOptions(facetName, selectedFiltersId, recordValues, facetData, allFilters, name, handleFetchFacets);
    expect(allFilters).not.toHaveProperty(name);
    expect(allFilters).toEqual({});
  });
});

describe('processItemsStatuses', () => {
  it('processes item statuses correctly', () => {
    const selectedFiltersId = ['status1', 'status2'];
    const itemStatuses = [
      { value: 'status1', label: 'Status 1' },
      { value: 'status2', label: 'Status 2' },
      { value: 'status3', label: 'Status 3' },
    ];
    const intl = {
      formatMessage: jest.fn(() => 'Status 1'),
    };
    const recordValues = [
      { id: 'status1', totalRecords: 5 },
      { id: 'status2', totalRecords: 10 },
      { id: 'status3', totalRecords: 0 },
    ];
    const accum = {};
    const name = 'itemStatuses';
    const facetName = FACETS.EFFECTIVE_LOCATION;
    const handleFetchFacets = jest.fn();
    processItemsStatuses(facetName, selectedFiltersId, itemStatuses, intl, recordValues, accum, name, handleFetchFacets);
    expect(accum).toEqual({
      itemStatuses: [
        { label: 'Status 1', value: 'status1', count: 5 },
        { label: 'Status 1', value: 'status2', count: 10 },
      ],
    });
  });
});
