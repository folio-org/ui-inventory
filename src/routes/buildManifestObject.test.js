import '../../test/jest/__mock__';

import { queryIndexes } from '../constants';
import { instanceIndexes } from '../filterConfig';
import { buildQuery } from './buildManifestObject';

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
  describe('build query for inventory search', () => {
    it('should build query for \'Effective call number (item), shelving order\' search option', () => {
      const qindex = queryIndexes.CALL_NUMBER;
      const queryParams = { ...defaultQueryParamsMap[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

      const queryTemplate = getQueryTemplate(qindex);
      expect(cql).toEqual(expect.stringContaining(`${queryTemplate.replace('%{query.query}', defaultQueryParamsMap[qindex].query)}`));
    });

    it('should build query for \'Contributor\' search option', () => {
      const qindex = queryIndexes.CONTRIBUTOR;
      const queryParams = { ...defaultQueryParamsMap[qindex] };
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

      const queryTemplate = getQueryTemplate(qindex);
      expect(cql).toEqual(expect.stringContaining(`${queryTemplate.replace('%{query.query}', defaultQueryParamsMap[qindex].query)}`));
    });

    describe('\'Subject\' search option', () => {
      describe('when there in no an authorityId in query params', () => {
        it('should build query', () => {
          const qindex = queryIndexes.SUBJECT;
          const queryParams = { ...defaultQueryParamsMap[qindex] };
          const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

          const queryTemplate = getQueryTemplate(qindex);
          expect(cql).toEqual(expect.stringContaining(queryTemplate(queryParams)));
        });
      });

      describe('when there in an authorityId in query params', () => {
        it('should build query with the authorityId', () => {
          const qindex = queryIndexes.SUBJECT;
          const queryParams = { ...defaultQueryParamsMap[qindex], authorityId: 'UUID' };
          const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

          const queryTemplate = getQueryTemplate(qindex);
          expect(cql).toEqual(expect.stringContaining(queryTemplate(queryParams)));
        });
      });
    });
  });

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
      const cql = buildQuery(...getBuildQueryArgs({ queryParams }));

      expect(cql).toEqual(expect.stringContaining(`subjects.value==/string "${defaultQueryParamsMap[qindex].query}"`));
    });
  });
});
