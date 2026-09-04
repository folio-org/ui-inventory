import validateBaseUrl from './validateBaseUrl';

describe('validateBaseUrl', () => {
  it('returns no errors when baseUrl uses https://', () => {
    const errors = validateBaseUrl({ baseUrl: 'https://example.com' });

    expect(errors).toEqual({});
  });

  it('returns no errors when baseUrl uses http://', () => {
    const errors = validateBaseUrl({ baseUrl: 'http://example.com' });

    expect(errors).toEqual({});
  });

  it('returns a "required" error when baseUrl is missing', () => {
    const errors = validateBaseUrl({});

    expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlRequired');
  });

  it('returns a "required" error when baseUrl is an empty string', () => {
    const errors = validateBaseUrl({ baseUrl: '' });

    expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlRequired');
  });

  it('returns a "protocol" error when baseUrl does not start with http:// or https://', () => {
    const errors = validateBaseUrl({ baseUrl: 'ftp://example.com' });

    expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlProtocol');
  });
});
