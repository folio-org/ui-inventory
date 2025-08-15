import '../../test/jest/__mock__';

import {
  queryIndexes,
  buildSearchQuery,
} from '@folio/stripes-inventory-components';

import { applyDefaultStaffSuppressFilter } from './buildManifestObject';

import buildStripes from '../../test/jest/__mock__/stripesCore.mock';

jest.unmock('@folio/stripes-inventory-components');

const defaultProps = {
  stripes: buildStripes(),
  mutator: {
    requestUrlQuery: { replace: jest.fn() },
  },
};

const getBuildQueryArgs = ({
  queryParams = {},
  pathComponents = {},
  resourceData = {},
  logger = { log: jest.fn() },
  props = defaultProps,
} = {}) => {
  const resData = { query: { ...queryParams }, ...resourceData };

  return [queryParams, pathComponents, resData, logger, props];
};

describe('buildSearchQuery', () => {
  describe('build query for inventory search', () => {
    describe('when query is empty', () => {
      it('should return empty query and filters', () => {
        const queryParams = {
          qindex: queryIndexes.SUBJECT,
          query: '',
          filters: '',
        };

        const cql = buildSearchQuery(applyDefaultStaffSuppressFilter)(...getBuildQueryArgs({ queryParams }));

        expect(cql).toEqual(null);
      });
    });

    describe('when a user does not have staff suppress permissions', () => {
      it('should apply staffSuppress.false facet', () => {
        const queryParams = {
          qindex: queryIndexes.SUBJECT,
          query: 'test',
          filters: '',
        };
        const buildQueryArgs = getBuildQueryArgs({
          queryParams,
          props: {
            ...defaultProps,
            stripes: {
              hasPerm: () => false,
            },
          },
        });

        const cql = buildSearchQuery(applyDefaultStaffSuppressFilter)(...buildQueryArgs);

        expect(cql).toEqual('((subjects.value==/string "test") and staffSuppress=="false") sortby title');
      });
    });
  });
});
