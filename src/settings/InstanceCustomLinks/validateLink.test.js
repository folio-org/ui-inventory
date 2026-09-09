import validateLink from './validateLink';

describe('validateLink', () => {
  it('returns no errors when link uses https://', () => {
    const errors = validateLink({ link: 'https://example.com' });

    expect(errors).toEqual({});
  });

  it('returns no errors when link uses http://', () => {
    const errors = validateLink({ link: 'http://example.com' });

    expect(errors).toEqual({});
  });

  it('returns a "required" error when link is missing', () => {
    const errors = validateLink({});

    expect(errors.link.props.id).toBe('ui-inventory.instanceCustomLink.error.linkRequired');
  });

  it('returns a "required" error when link is an empty string', () => {
    const errors = validateLink({ link: '' });

    expect(errors.link.props.id).toBe('ui-inventory.instanceCustomLink.error.linkRequired');
  });

  it('returns a "protocol" error when link does not start with http:// or https://', () => {
    const errors = validateLink({ link: 'ftp://example.com' });

    expect(errors.link.props.id).toBe('ui-inventory.instanceCustomLink.error.linkProtocol');
  });

  it.each(['{{UUID}}', '{{HRID}}', '{{indexTitle}}'])(
    'returns no errors when link contains the placeholder %s',
      (placeholder) => {
      const errors = validateLink({ link: `http://example.com/?id=${placeholder}` });
      expect(errors).toEqual({});
    }
  );

  it('returns a "parameter" error when link does not contain a valid placeholder', () => {
    const errors = validateLink({ link: 'http://example.com/?id={{ID}}' });

    expect(errors.link.props.id).toBe('ui-inventory.instanceCustomLink.error.linkParameter');
  });
});
