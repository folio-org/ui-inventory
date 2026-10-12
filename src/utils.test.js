import '../test/jest/__mock__';

import { FormattedMessage } from 'react-intl';

import { updateTenant } from '@folio/stripes/core';

import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import {
  hasMemberTenantPermission,
  validateRequiredField,
  validateFieldLength,
  validateNumericField,
  validateAlphaNumericField,
  switchAffiliation,
  parseEmptyFormValue,
  redirectToMarcEditPage,
  sendCalloutOnAffiliationChange,
  checkIfCentralOrderingIsActive,
  omitCurrentAndCentralTenants,
  marshalInstance,
  getIsVersionHistoryEnabled,
} from './utils';
import { VERSION_HISTORY_ENABLED_SETTING } from './constants';

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

describe('checkIfCentralOrderingIsActive', () => {
  const inactiveCenralOrdering = {
    settings: [{
      value: 'false',
    }],
  };

  const activeCenralOrdering = {
    settings: [{
      value: 'true',
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

describe('marshalInstance', () => {
  describe('when dates are present and date type is missing', () => {
    it('should add a default date type', () => {
      const instance = {
        title: 'test',
        dates: {
          date1: '1234',
          date2: '1235',
        },
      };

      const instanceDateTypesByCode = {
        '|': {
          id: 'date-type-id',
        },
      };

      expect(marshalInstance(instance, {}, instanceDateTypesByCode)).toEqual(expect.objectContaining({
        ...instance,
        dates: {
          date1: '1234',
          date2: '1235',
          dateTypeId: 'date-type-id',
        },
      }));
    });
  });
});

describe('hasMemberTenantPermission', () => {
  it('returns false without permissions', () => {
    expect(hasMemberTenantPermission('foo', 'tenant')).toBe(false);
  });

  it('returns false with empty permissions', () => {
    expect(hasMemberTenantPermission('foo', 'tenant', [])).toBe(false);
  });

  it('returns false if tenant does not match', () => {
    expect(hasMemberTenantPermission(
      'foo',
      'tenant',
      [{ permissionNames: [{ permissionName: 'foo' }], tenantId: 'asdf' }]
    )).toBe(false);
  });

  describe('when tenant matches', () => {
    it('returns true if matching permissionName is present', () => {
      expect(hasMemberTenantPermission(
        'foo',
        'tenant',
        [{ permissionNames: [{ permissionName: 'foo' }], tenantId: 'tenant' }]
      )).toBe(true);
    });

    it('returns true if matching subPermissions entry is present', () => {
      expect(hasMemberTenantPermission(
        'foo',
        'tenant',
        [{ permissionNames: [{ permissionName: 'bar', subPermissions: ['foo'] }], tenantId: 'tenant' }]
      )).toBe(true);
    });

    it('returns false if no matching permissions entry is present', () => {
      expect(hasMemberTenantPermission(
        'foo',
        'tenant',
        [{ permissionNames: [{ permissionName: 'bar' }], tenantId: 'tenant' }]
      )).toBe(false);
    });
  });
});

describe('getIsVersionHistoryEnabled', () => {
  it('should return true when version history setting is enabled', () => {
    const settings = [{ key: VERSION_HISTORY_ENABLED_SETTING, value: true }];

    expect(getIsVersionHistoryEnabled(settings)).toBe(true);
  });

  it('should return false when version history setting is disabled', () => {
    const settings = [{ key: VERSION_HISTORY_ENABLED_SETTING, value: false }];

    expect(getIsVersionHistoryEnabled(settings)).toBe(false);
  });
});
