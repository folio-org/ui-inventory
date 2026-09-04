import validateLinkText from './validateLinkText';

describe('validateLinkText', () => {
  it('returns no errors when linkText is present and within length limit', () => {
    const errors = validateLinkText({ linkText: 'View in discovery' });

    expect(errors).toEqual({});
  });

  it('returns a "required" error when linkText is missing', () => {
    const errors = validateLinkText({});

    expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextRequired');
  });

  it('returns a "required" error when linkText is an empty string', () => {
    const errors = validateLinkText({ linkText: '' });

    expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextRequired');
  });

  it('returns a "too long" error when linkText exceeds 40 characters', () => {
    const errors = validateLinkText({ linkText: 'a'.repeat(41) });

    expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextTooLong');
  });

  it('returns no errors when linkText is exactly 40 characters', () => {
    const errors = validateLinkText({ linkText: 'a'.repeat(40) });

    expect(errors).toEqual({});
  });
});
