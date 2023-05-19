import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { browseModeOptions } from '../../constants';
import useBrowseValidation from './useBrowseValidation';

const VALID_CONTRIBUTORS_QUERY = 'James';
const INVALID_CONTRIBUTORS_QUERY = 'James*';

describe('useBrowseValidation', () => {
  it('should return "true" if browse query is valid', async () => {
    const { result } = renderHook(() => useBrowseValidation(browseModeOptions.CONTRIBUTORS));

    expect(result.current.validateDataQuery(VALID_CONTRIBUTORS_QUERY)).toBeTruthy();
  });

  it('should return "false" if browse query is not valid', async () => {
    const { result } = renderHook(() => useBrowseValidation(browseModeOptions.CONTRIBUTORS));

    expect(result.current.validateDataQuery(INVALID_CONTRIBUTORS_QUERY)).toBeFalsy();
  });
});
