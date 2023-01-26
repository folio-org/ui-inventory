import '../../test/jest/__mock__';
import validateNameAndCode from './validateNameAndCode';

describe('ValidateNameAndCode', () => {
  it('should return errors when code & name are empty', () => {
    const item = {};
    const errors = validateNameAndCode(item);
    expect(JSON.stringify(errors.code)).toMatch(/ui-inventory.fillIn/i);
    expect(JSON.stringify(errors.name)).toMatch(/ui-inventory.fillIn/i);
  });
  it('check return value is defined', () => {
    const item = {
      code: 'testCode',
      name: 'testName'
    };
    const errors = validateNameAndCode(item);
    expect(errors).toMatchObject({});
  });
});
