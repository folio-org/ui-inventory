import '../test/jest/__mock__';

import { FormattedMessage } from 'react-intl';

import { updateTenant } from '@folio/stripes/core';
import { OKAPI_TENANT_HEADER } from '@folio/stripes-inventory-components';

import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import {
  validateRequiredField,
  validateFieldLength,
  validateNumericField,
  validateAlphaNumericField,
  switchAffiliation,
  setRecordForDeletion,
  parseEmptyFormValue,
  redirectToMarcEditPage,
  sendCalloutOnAffiliationChange,
  batchQueryIntoSmaller,
  checkIfCentralOrderingIsActive,
  omitCurrentAndCentralTenants,
} from './utils';
import {
  CONTENT_TYPE_HEADER,
  OKAPI_TOKEN_HEADER,
} from './constants';

describe('validateRequiredField', () => {
  const expectedResult = <FormattedMessage id="ui-inventory.hridHandling.validation.enterValue" />;

  it('should return undefined when field is set int', () => {
    const value = '20';
    expect(validateRequiredField(value)).toBe(undefined);
  });

  it('should return undefined when field is set numeric', () => {
    const value = 20.5;
    expect(validateRequiredField(value)).toBe(undefined);
  });

  it('should return validation error when field is undefined', () => {
    const value = undefined;
    expect(validateRequiredField(value)).toEqual(expectedResult);
  });

  it('should return validation error when field none numeric', () => {
    const value = 'abc32';
    expect(validateRequiredField(value)).toEqual(expectedResult);
  });

  it('should return validation error when field is set empty string', () => {
    const value = '';
    expect(validateRequiredField(value)).toEqual(expectedResult);
  });
});

describe('validateFieldLength', () => {
  const value = '1234567890';

  it('should return undefined when field length is lower then maxlength', () => {
    const maxLength = 20;
    expect(validateFieldLength(value, maxLength)).toBe(undefined);
  });

  it('should return undefined when field length is exactly as maxlength', () => {
    const maxLength = 10;
    expect(validateFieldLength(value, maxLength)).toBe(undefined);
  });

  it('should return undefined when field length is empty', () => {
    expect(validateFieldLength('', 10)).toBe(undefined);
  });

  it('should return undefined when field length is undefined', () => {
    expect(validateFieldLength(undefined, 10)).toBe(undefined);
  });

  it('should return undefined when field length and maxlength is undefined ', () => {
    expect(validateFieldLength(undefined, undefined)).toBe(undefined);
  });

  it('should return validation error when field length is longer then maxlength', () => {
    const maxLength = 5;
    const expectedResult = <FormattedMessage id="ui-inventory.hridHandling.validation.maxLength" values={{ maxLength }} />;

    expect(validateFieldLength(value, maxLength)).toEqual(expectedResult);
  });
});

describe('validateNumericField', () => {
  it('should return undefined when field is numeric', () => {
    const value = 20;
    expect(validateNumericField(value)).toBe(undefined);
  });

  it('should return undefined when field is numeric string', () => {
    const value = '20';
    expect(validateNumericField(value)).toBe(undefined);
  });


  it('should return undefined when field undefined', () => {
    const value = undefined;
    expect(validateNumericField(value)).toBe(undefined);
  });

  it('should return validation error when field is not numeric', () => {
    const value = 'ABC';
    const expectedResult = <FormattedMessage id="ui-inventory.hridHandling.validation.startWithField" />;
    expect(validateNumericField(value)).toEqual(expectedResult);
  });
});

describe('validateAlphaNumericField', () => {
  const alphaNumeric = '1234567890qwertyuiopasdfghjklzxcvbnm?!$\'()[]{};:.,-';
  const nonAlphaNumeric = 'abc@gmail.com#';

  it('should return undefined when field is alphaNumeric', () => {
    expect(validateAlphaNumericField(alphaNumeric)).toBe(undefined);
  });

  it('should return validation error when field is none alphaNumeric', () => {
    const expectedResult = <FormattedMessage id="ui-inventory.hridHandling.validation.assignPrefixField" />;
    expect(validateAlphaNumericField(nonAlphaNumeric)).toEqual(expectedResult);
  });
});

describe('switchAffiliation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const moveMock = jest.fn();
  const stripes = buildStripes({
    okapi: {
      tenant: 'college',
      token: 'testToken',
    },
  });

  describe('when current tenant is the same as tenant to switch', () => {
    it('should only move to the next page', () => {
      switchAffiliation(stripes, 'college', moveMock);

      expect(moveMock).toHaveBeenCalled();
    });
  });

  describe('when current tenant is not the same as tenant to switch', () => {
    it('should switch affiliation', () => {
      switchAffiliation(stripes, 'university', moveMock);

      expect(updateTenant).toHaveBeenCalled();
    });
  });
});

describe('setRecordForDeletion', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  const instanceId = 'testInstanceId';
  const tenantId = 'testTenantId';
  const okapi = {
    token: 'token',
    url: 'url/test',
  };

  describe('when the request was fulfilled successfuly', () => {
    it('should return the appropriate response', () => {
      global.fetch = jest.fn().mockReturnValue({ ok: true });

      setRecordForDeletion(okapi, instanceId, tenantId);

      expect(global.fetch).toHaveBeenCalledWith(
        `${okapi.url}/inventory/instances/${instanceId}/mark-deleted`,
        {
          credentials: 'include',
          headers: expect.objectContaining({
            [OKAPI_TENANT_HEADER]: tenantId,
            [OKAPI_TOKEN_HEADER]: okapi.token,
            [CONTENT_TYPE_HEADER]: 'application/json',
          }),
          method: 'DELETE',
        },
      );

      expect(global.fetch.mock.results[0].value.ok).toBe(true);
    });
  });

  describe('when the request was fulfilled with an error', () => {
    it('should return the appropriate response', async () => {
      global.fetch = jest.fn().mockReturnValue({ ok: false });

      try {
        await setRecordForDeletion(okapi, instanceId, tenantId);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.ok).toBe(false);

        expect(global.fetch).toHaveBeenCalledWith(
          `${okapi.url}/inventory/instances/${instanceId}/mark-deleted`,
          {
            credentials: 'include',
            headers: expect.objectContaining({
              [OKAPI_TENANT_HEADER]: tenantId,
              [OKAPI_TOKEN_HEADER]: okapi.token,
              [CONTENT_TYPE_HEADER]: 'application/json',
            }),
            method: 'DELETE',
          },
        );
      }
    });
  });
});

describe('parseEmptyFormValue', () => {
  it('should return the same value when not empty', () => {
    const value = 'test';

    expect(parseEmptyFormValue(value)).toEqual(value);
  });

  it('should return empty string when value is empty', () => {
    const value = '';

    expect(parseEmptyFormValue(value)).toEqual('');
  });

  it('should return null when value is null', () => {
    const value = null;

    expect(parseEmptyFormValue(value)).toEqual(null);
  });

  it('should return undefined when value is undefined', () => {
    const value = undefined;

    expect(parseEmptyFormValue(value)).toEqual(undefined);
  });
});

describe('redirectToMarcEditPage', () => {
  it('should call history.push with correct arguments', () => {
    const pathname = 'some-pathname';
    const instance = {
      shared: true,
    };
    const location = {
      search: '?someValue=test&relatedRecordVersion=1',
    };
    const history = {
      push: jest.fn(),
    };

    redirectToMarcEditPage(pathname, instance, location, history);

    expect(history.push).toHaveBeenCalledWith({
      pathname,
      search: 'someValue=test&shared=true',
    });
  });
});

describe('sendCalloutOnAffiliationChange', () => {
  const callout = {
    sendCallout: jest.fn(),
  };
  const tenantId = 'tenantId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When tenant changed', () => {
    const okapi = {
      tenant: 'okapiTenantId',
    };

    it('should send named informational notification callout', () => {
      const stripes = {
        user: {
          user: {
            tenants: [
              {
                id: tenantId,
                name: 'name',
              }
            ],
          },
        },
        okapi,
      };
      const expectedArgs = {
        type: 'info',
        message: (
          <FormattedMessage
            id="ui-inventory.affiliationChanging.namedNotification"
            values={{ name: stripes.user.user.tenants[0].name }}
          />
        ),
      };

      sendCalloutOnAffiliationChange(stripes, tenantId, callout);

      expect(callout.sendCallout).toHaveBeenCalledWith(expect.objectContaining(expectedArgs));
    });

    it('should send general informational notification callout', () => {
      const stripes = {
        user: {
          user: {
            tenants: [],
          },
        },
        okapi,
      };
      const expectedArgs = {
        type: 'info',
        message: <FormattedMessage id="ui-inventory.affiliationChanging.notification" />,
      };

      sendCalloutOnAffiliationChange(stripes, tenantId, callout);

      expect(callout.sendCallout).toHaveBeenCalledWith(expect.objectContaining(expectedArgs));
    });
  });

  describe('When tenant is not changed', () => {
    it('should not trigger callout', () => {
      const stripes = {
        user: {
          user: {
            tenants: [],
          },
        },
        okapi: {
          tenant: tenantId,
        },
      };

      sendCalloutOnAffiliationChange(stripes, tenantId, callout);

      expect(callout.sendCallout).not.toHaveBeenCalled();
    });
  });
});

describe('batchQueryIntoSmaller', () => {
  it('should split one query into several batches', () => {
    const originalQuery = 'item.effectiveLocationId==("id-1" or "id-2" or "id-3" or "id-4" or "id-5") or language==("en" or "de" or "sp" or "it" or "ua") sortby title';
    const queries = batchQueryIntoSmaller(originalQuery, 3);

    expect(queries).toEqual([
      'item.effectiveLocationId==("id-1" or "id-2" or "id-3") or language==("en" or "de" or "sp") sortby title',
      'item.effectiveLocationId==("id-1" or "id-2" or "id-3") or language==("it" or "ua") sortby title',
      'item.effectiveLocationId==("id-4" or "id-5") or language==("en" or "de" or "sp") sortby title',
      'item.effectiveLocationId==("id-4" or "id-5") or language==("it" or "ua") sortby title',
    ]);
  });
});

describe('checkIfCentralOrderingIsActive', () => {
  const inactiveCenralOrdering = {
    records: [{
      settings: [{
        value: 'false',
      }],
    }],
  };

  const activeCenralOrdering = {
    records: [{
      settings: [{
        value: 'true',
      }],
    }],
  };

  it('should return false, when central ordering is inactive', () => {
    expect(checkIfCentralOrderingIsActive(inactiveCenralOrdering)).toBeFalsy();
  });

  it('should return true, when central ordering is active', () => {
    expect(checkIfCentralOrderingIsActive(activeCenralOrdering)).toBeTruthy();
  });
});

describe('omitCurrentAndCentralTenants', () => {
  const stripes = {
    okapi: { tenant: 'college' },
    user: {
      user: {
        consortium: { centralTenantId: 'consortium' },
        tenants: [{
          id: 'college',
        }, {
          id: 'university'
        }, {
          id: 'consortium'
        }],
      },
    },
  };

  it('should omit current and central tenants', () => {
    expect(omitCurrentAndCentralTenants(stripes)).toEqual([{ id: 'university' }]);
  });
});
