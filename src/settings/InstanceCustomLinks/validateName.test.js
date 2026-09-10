import validateName from './validateName';

describe('validateName', () => {
  it('returns no errors when name is present and within length limit', () => {
    const errors = validateName({ name: 'Discovery layer' });

    expect(errors).toEqual({});
  });

  it('returns a "fill in" error when name is missing', () => {
    const errors = validateName({});

    expect(errors.name.props.id).toBe('ui-inventory.fillIn');
  });

  it('returns a "fill in" error when name is an empty string', () => {
    const errors = validateName({ name: '' });

    expect(errors.name.props.id).toBe('ui-inventory.fillIn');
  });

  it('returns a "name too long" error when name exceeds 150 characters', () => {
    const errors = validateName({ name: 'a'.repeat(151) });

    expect(errors.name.props.id).toBe('ui-inventory.instanceCustomLink.error.nameTooLong');
  });

  it('returns no errors when name is exactly 150 characters', () => {
    const errors = validateName({ name: 'a'.repeat(150) });

    expect(errors).toEqual({});
  });
});
