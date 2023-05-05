import '../../test/jest/__mock__';

import { queryIndexes } from '../constants';
import { instanceIndexes } from '../filterConfig';
import { buildManifestObject, buildQuery } from './buildManifestObject';

const getQueryTemplate = (qindex) => instanceIndexes.find(({ value }) => value === qindex).queryTemplate;

const getBuildQueryArgs = ({
  queryParams = {},
  pathComponents = {},
  resourceData = {},
  logger = { log: jest.fn() },
} = {}) => {
  const resData = { query: { ...queryParams }, ...resourceData };

  return [queryParams, pathComponents, resData, logger];
};

const defaultQueryParamsMap = {
  [queryIndexes.CALL_NUMBER]: { qindex: queryIndexes.CALL_NUMBER, query: 'Some call number query' },
  [queryIndexes.CONTRIBUTOR]: { qindex: queryIndexes.CONTRIBUTOR, query: 'Some contributor query' },
  [queryIndexes.SUBJECT]: { qindex: queryIndexes.SUBJECT, query: 'Some subject query' },
};

describe('buildQuery', () => {
  afterEach(() => jest.clearAllMocks());
  describe('build query based on selected browse record', () => {
    it('should build query for \'Call numbers\' browse option', () => {
      const qindex = queryIndexes.CALL_NUMBER;
      const queryParams = {
        ...defaultQueryParamsMap[qindex],
        selectedBrowseResult: true,
      };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

      expect(cql).toEqual(expect.stringContaining(`itemEffectiveShelvingOrder==/string "${defaultQueryParamsMap[qindex].query}"`));
    });

    it('should build query for \'Contributors\' browse option', () => {
      const qindex = queryIndexes.CONTRIBUTOR;
      const queryParams = {
        ...defaultQueryParamsMap[qindex],
        selectedBrowseResult: true,
      };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

      expect(cql).toEqual(expect.stringContaining(`contributors.name==/string "${defaultQueryParamsMap[qindex].query}"`));
    });

    it('should build query for \'Subjects\' browse option', () => {
      const qindex = queryIndexes.SUBJECT;
      const queryParams = {
        ...defaultQueryParamsMap[qindex],
        selectedBrowseResult: true,
      };
      buildQuery(...getBuildQueryArgs({ queryParams }));
      expect('(subjects.value==/string "Some subject query") sortby title').toBeTruthy();
    });
  });
  describe('build query for inventory search', () => {
    it('queryParams with no qindex ', () => {
      const queryParams = { ...defaultQueryParamsMap };
      buildQuery(...getBuildQueryArgs({ queryParams }));
      expect(buildQuery).toBeTruthy();
    });
    it('should build query for \'ISBN or ISSN\' search option', () => {
      const queryIndex = 'isbn';
      const qindex = 'isbn';
      const defaultQueryParams = {
        [queryIndex]: { qindex: queryIndex, query: 'isbn' },
      };
      const queryParams = { ...defaultQueryParams[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));
      const queryTemplate = getQueryTemplate(qindex);
      expect(cql).toEqual(expect.stringContaining(`${queryTemplate.match('isbn', defaultQueryParamsMap[qindex])}`));
    });
    it('queryIndex && queryValue should render', () => {
      const queryValue = jest.fn().mockResolvedValue('sortby');
      const queryIndex = 'querySearch';
      const qindex = 'querySearch';
      const defaultQueryParams = {
        [queryIndex]: { qindex: queryIndex, query: 'querySearch', queryValue },
      };
      const queryParams = { ...defaultQueryParams[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));
      expect(cql).toEqual(expect.stringContaining(`${defaultQueryParams[qindex].query}`));
    });
    it('should build query for \'Effective call number (item), shelving order\' search option', () => {
      const qindex = queryIndexes.CALL_NUMBER;
      const queryParams = { ...defaultQueryParamsMap[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));
      expect(cql).toEqual(expect.stringContaining(`${defaultQueryParamsMap[qindex].query}`));
    });

    it('should build query for \'Contributor\' search option', () => {
      const qindex = queryIndexes.CONTRIBUTOR;
      const queryParams = { ...defaultQueryParamsMap[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));
      expect(cql).toEqual(expect.stringContaining(`${defaultQueryParamsMap[qindex].query}`));
    });

    it('should build query for \'Subject\' search option', () => {
      const qindex = queryIndexes.SUBJECT;
      const queryParams = { ...defaultQueryParamsMap[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));
      expect(cql).toEqual(expect.stringContaining(`${defaultQueryParamsMap[qindex].query}`));
    });
  });
});
describe('buildManifestObject', () => {
  const mockLocation = { key: 'mock-location-key', search: '?query=test' };
  const mockResources = { resultOffset: 0 };
  const mockProps = { location: mockLocation, resources: mockResources };
  describe('getFetchProp', () => {
    it('should return true on query', () => {
      const fetchProp = buildManifestObject().records.fetch;
      const result = fetchProp(mockProps);
      expect(result).toBeTruthy();
    });
    it('expect values to be equal to prevResult', () => {
      const fetchProp = buildManifestObject().records.fetch;
      const prevResult = fetchProp(mockProps);
      const result = fetchProp(mockProps);
      expect(result).toEqual(prevResult);
    });
  });
  describe('buildRecordsManifest function', () => {
    it('GET params query function', () => {
      const result = buildManifestObject().records.GET.params.query;
      expect(result).toBeTruthy();
    });
    it('memoizeGetFetch function should be true', () => {
      const result = buildManifestObject().records.fetch;
      expect(result).toBeTruthy();
    });
  });
});
