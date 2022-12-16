import '../../test/jest/__mock__';
import validateNameAndCode from './validateNameAndCode';

describe('ValidateNameAndCode', () => {
  it('should return errors when code & name are empty', () => {
    const item = {};
    const errors = validateNameAndCode(item);
    expect(JSON.stringify(errors.code)).toMatch(/ui-inventory.fillIn/i);
    expect(JSON.stringify(errors.name)).toMatch(/ui-inventory.fillIn/i);
  });
  it('should return empty with name & code values present', () => {
    const item = {
      code: 'codeTest',
      name: 'codeTest'
    };
    const errors = validateNameAndCode(item);
    expect(errors).toBeDefined();
  });
});
