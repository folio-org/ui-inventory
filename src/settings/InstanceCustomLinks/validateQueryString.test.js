import validateQueryString from './validateQueryString';

describe('validateQueryString', () => {
  it('returns no errors when queryString is missing', () => {
    const errors = validateQueryString({});

    expect(errors).toEqual({});
  });

  it('returns no errors when queryString is an empty string', () => {
    const errors = validateQueryString({ queryString: '' });

    expect(errors).toEqual({});
  });

  it.each(['{{UUID}}', '{{HRID}}', '{{indexTitle}}'])(
    'returns no errors when queryString contains the placeholder %s and is within length limit',
    (placeholder) => {
      const errors = validateQueryString({ queryString: `?id=${placeholder}` });

      expect(errors).toEqual({});
    }
  );

  it('returns a "parameter" error when queryString does not contain a valid placeholder', () => {
    const errors = validateQueryString({ queryString: '?id=123' });

    expect(errors.queryString.props.id).toBe('ui-inventory.instanceCustomLink.error.queryStringParameter');
  });

  it('returns a "too long" error when queryString exceeds 150 characters', () => {
    const queryString = `{{UUID}}${'a'.repeat(150)}`;
    const errors = validateQueryString({ queryString });

    expect(errors.queryString.props.id).toBe('ui-inventory.instanceCustomLink.error.queryStringTooLong');
  });

  it('returns a "too long" error when queryString is both invalid and over 150 characters', () => {
    const errors = validateQueryString({ queryString: 'a'.repeat(151) });

    expect(errors.queryString.props.id).toBe('ui-inventory.instanceCustomLink.error.queryStringTooLong');
  });
});
