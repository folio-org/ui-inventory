import '../../test/jest/__mock__';
import validateNameAndCode from './validateNameAndCode';

describe('ValidateNameAndCode', () => {
  it('should return errors when code & name are empty', () => {
    const item = {};
    const errors = validateNameAndCode(item);
    expect(errors).toBeTruthy();
  });
  it('should return empty with name & code values present', () => {
    const item = {
      code: 'test',
      name: 'test'
    };
    const errors = validateNameAndCode(item);
    expect(errors).toBeDefined();
  });
});
