import '../../test/jest/__mock__';

import {
  queryIndexes,
  buildSearchQuery,
} from '@folio/stripes-inventory-components';

import buildStripes from '../../test/jest/__mock__/stripesCore.mock';
import { applyDefaultStaffSuppressFilter } from './buildManifestObject';

jest.unmock('@folio/stripes-inventory-components');

const getBuildQueryArgs = ({
  queryParams = {},
  pathComponents = {},
  resourceData = {},
  logger = { log: jest.fn() },
  props = { stripes: buildStripes() }
} = {}) => {
  const resData = { query: { ...queryParams }, ...resourceData };

  return [queryParams, pathComponents, resData, logger, props];
};

describe('buildSearchQuery', () => {
  describe('build query for inventory search', () => {
    describe('when query is empty and filters only contain staff suppress', () => {
      describe('when user did not touch staff suppress', () => {
        it('should return empty query and filters', () => {
          const queryParams = {
            qindex: queryIndexes.SUBJECT,
            query: '',
            filters: 'staffSuppress.false',
          };

          const cql = buildSearchQuery(applyDefaultStaffSuppressFilter)(...getBuildQueryArgs({ queryParams }));

          expect(cql).toEqual(null);
        });
      });

      describe('when user did not touch staff suppress', () => {
        beforeEach(() => {
          global.Storage.prototype.getItem = jest.fn().mockReturnValue('true');
        });

        it('should return empty query and filters', () => {
          const queryParams = {
            qindex: queryIndexes.SUBJECT,
            query: '',
            filters: 'staffSuppress.false',
          };

          const cql = buildSearchQuery(applyDefaultStaffSuppressFilter)(...getBuildQueryArgs({ queryParams }));

          expect(cql).toEqual('(staffSuppress=="false") sortby title');
        });
      });
    });
  });
});
