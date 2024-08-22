import '../../test/jest/__mock__';
import { validateUniqueness } from './validateUniqueness';

describe('validateUniqueness', () => {
  it('should return errors when name is not unique', () => {
    const item = { name: 'sourceName' };
    const items = [
      { name: 'sourceName' },
      { name: 'sourceName2' },
      { name: 'sourceName' },
    ];
    const error = validateUniqueness(0, item, items, 'name');

    expect(JSON.stringify(error)).toMatch(/ui-inventory.validation.error.mustBeUnique/i);
  });

  it('should return undefined when name is unique', () => {
    const item = { name: 'sourceName' };
    const items = [
      { name: 'sourceName' },
      { name: 'sourceName2' },
      { name: 'sourceName3' },
    ];
    const error = validateUniqueness(0, item, items, 'name');

    expect(error).toBeUndefined();
  });
});
