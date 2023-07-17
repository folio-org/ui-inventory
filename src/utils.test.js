import '../test/jest/__mock__';

import { FormattedMessage } from 'react-intl';
import {
  validateRequiredField,
  validateFieldLength,
  validateNumericField,
  validateAlphaNumericField,
  getQueryTemplate,
} from './utils';
import { browseModeOptions } from './constants';

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

describe('getQueryTemplate', () => {
  const indexes = [
    {
      label: 'ui-inventory.browse.callNumbers',
      queryTemplate: '%{query.query}',
      subIndexes: [
        { label: 'ui-inventory.browse.callNumbersAll', value: browseModeOptions.CALL_NUMBERS },
        { label: 'ui-inventory.browse.dewey', value: browseModeOptions.DEWEY },
        { label: 'ui-inventory.browse.libOfCongress', value: browseModeOptions.LIBRARY_OF_CONGRESS },
        { label: 'ui-inventory.browse.local', value: browseModeOptions.LOCAL },
        { label: 'ui-inventory.browse.natLibOfMed', value: browseModeOptions.NATIONAL_LIBRARY_OF_MEDICINE },
        { label: 'ui-inventory.browse.other', value: browseModeOptions.OTHER },
        { label: 'ui-inventory.browse.superintendent', value: browseModeOptions.SUPERINTENDENT },
      ],
    },
    { label: 'ui-inventory.browse.contributors', value: browseModeOptions.CONTRIBUTORS, queryTemplate: '%{query.query}' },
    { label: 'ui-inventory.browse.subjects', value: browseModeOptions.SUBJECTS, queryTemplate: '%{query.query}' },
  ];

  describe('when a searchable index is in sub indexes', () => {
    it('should return a queryTemplate', () => {
      const queryIndex = browseModeOptions.DEWEY;
      expect(getQueryTemplate(queryIndex, indexes)).toBe('%{query.query}');
    });
  });

  describe('when a searchable index is not in sub indexes', () => {
    it('should return a queryTemplate', () => {
      const queryIndex = browseModeOptions.CONTRIBUTORS;
      expect(getQueryTemplate(queryIndex, indexes)).toBe('%{query.query}');
    });
  });
});
