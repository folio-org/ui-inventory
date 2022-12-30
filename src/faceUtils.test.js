import {
  getFacetOptions,
  getSuppressedOptions,
  getSourceOptions,
  getItemStatusesOptions,
  processStatisticalCodes,
  processFacetOptions,
  processItemsStatuses,
} from './facetUtils';
import '../test/jest/__mock__';

const parseOption = jest.fn().mockResolvedValueOnce();
describe('Facetutils', () => {
  it('getFacetOptions', () => {
    const selectedFiltersId = [1];
    const entries = [{ id: 1, totalRecords: 1 }];
    const facetData = [{ id: 1, name: '', value: '' }];
    const key = 'id';
    const parse = parseOption;
    expect(
      getFacetOptions(selectedFiltersId, entries, facetData, key, parse)
    ).toBeDefined();
    expect(selectedFiltersId).toStrictEqual([1]);
  });
  it('getFacetOptions passing values', () => {
    const selectedFiltersId = [1];
    const entries = [{ id: 2, totalRecords: 2 }];
    const facetData = [{ id: 1, name: null, label: null }];
    const key = 'id';
    const parse = parseOption;
    expect(
      getFacetOptions(selectedFiltersId, entries, facetData, key, parse)
    ).toBeDefined();
  });
  it('getSuppressedOptions', () => {
    const selectedFiltersId = [1];
    const suppressedOptionsRecords = [{ id: 'true', totalRecords: 1 }];
    expect(
      getSuppressedOptions(selectedFiltersId, suppressedOptionsRecords)
    ).toBeDefined();
  });
  it('getSuppressedOptions', () => {
    const selectedFiltersId = [1];
    const suppressedOptionsRecords = [{ id: 'true' }];
    expect(
      getSuppressedOptions(selectedFiltersId, suppressedOptionsRecords)
    ).toBeDefined();
  });
  it('getSourceOptions', () => {
    const selectedFiltersId = [1];
    const sourceRecords = [{ id: 1, totalRecords: 1 }];
    expect(getSourceOptions(selectedFiltersId, sourceRecords)).toBeDefined();
  });
  it('getSourceOptions with totalrecords', () => {
    const selectedFiltersId = [1];
    const sourceRecords = [{ id: 2 }];
    expect(getSourceOptions(selectedFiltersId, sourceRecords)).toBeDefined();
  });
  it('getItemStatusesOptions', () => {
    const selectedFiltersId = [1];
    const entries = [{ id: 1, totalRecords: 1 }];
    const facetData = [{ id: 1, name: '', value: 1, label: '' }];
    const intl = {
      formatMessage: jest.fn(),
    };
    expect(
      getItemStatusesOptions(selectedFiltersId, entries, facetData, intl)
    ).toBeDefined();
  });
  it('processStatisticalCodes', () => {
    const selectedFiltersId = [1];
    const recordValues = [{}];
    const facetData = [{ id: 1, name: '' }];
    const allFilters = { id: 1, name: '' };
    const name = '';
    expect(
      processStatisticalCodes(
        selectedFiltersId,
        recordValues,
        facetData,
        allFilters,
        name
      )
    ).toBeUndefined();
    expect(processStatisticalCodes(getFacetOptions)).toBeUndefined();
  });
  it('processFacetOptions', () => {
    const selectedFiltersId = [1];
    const recordValues = [{}];
    const facetData = [{ id: 1, name: '' }];
    const allFilters = { id: 1, name: '' };
    const name = '';
    const key = 'id';
    expect(
      processFacetOptions(
        selectedFiltersId,
        recordValues,
        facetData,
        allFilters,
        name,
        key
      )
    ).toBeUndefined();
    expect(processFacetOptions(getFacetOptions)).toBeUndefined();
  });
  it('processItemsStatuses', () => {
    const selectedFiltersId = [1];
    const itemStatuses = [{ id: 1, name: '', value: 1, label: '' }];
    const intl = {
      formatMessage: jest.fn(),
    };
    const recordValues = [{ value: '2' }];
    const accum = [{ id: 1, name: 'test' }];
    const name = '';
    expect(
      processItemsStatuses(
        selectedFiltersId,
        itemStatuses,
        intl,
        recordValues,
        accum,
        name
      )
    ).toBeUndefined();
    expect(processItemsStatuses(getItemStatusesOptions)).toBeUndefined();
  });
});
