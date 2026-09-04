import validateResponse from './validateResponse';

describe('validateResponse', () => {
  it('returns no errors when responses is empty', () => {
    const errors = validateResponse({ name: 'Foo' }, []);

    expect(errors).toEqual({});
  });

  it('returns no errors when response code is not "unique"', () => {
    const responses = [{ code: 'other', parameters: [{ key: 'name', value: 'Foo' }] }];
    const errors = validateResponse({ name: 'Foo' }, responses);

    expect(errors).toEqual({});
  });

  it('returns no errors when a response has no parameters', () => {
    const responses = [{ code: 'unique' }];
    const errors = validateResponse({ name: 'Foo' }, responses);

    expect(errors).toEqual({});
  });

  it('returns a "linkText unique" error when item.linkText matches the response value', () => {
    const responses = [{ code: 'unique', parameters: [{ key: 'linkText', value: 'View in discovery' }] }];
    const errors = validateResponse({ linkText: 'View in discovery' }, responses);

    expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextUnique');
  });

  it('returns no "linkText unique" error when item.linkText does not match the response value', () => {
    const responses = [{ code: 'unique', parameters: [{ key: 'linkText', value: 'View in discovery' }] }];
    const errors = validateResponse({ linkText: 'Something else' }, responses);

    expect(errors).toEqual({});
  });

  it('returns a "baseUrl unique" error when item.baseUrl matches the response value', () => {
    const responses = [{ code: 'unique', parameters: [{ key: 'baseUrl', value: 'https://example.com' }] }];
    const errors = validateResponse({ baseUrl: 'https://example.com' }, responses);

    expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlUnique');
  });

  it('returns a "name unique" error when item.name matches the response value and key is "name"', () => {
    const responses = [{ code: 'unique', parameters: [{ key: 'name', value: 'Discovery layer' }] }];
    const errors = validateResponse({ name: 'Discovery layer' }, responses);

    expect(errors.name.props.id).toBe('ui-inventory.instanceCustomLink.error.nameUnique');
  });

  it('returns no error when the parameter key is unrecognized', () => {
    const responses = [{ code: 'unique', parameters: [{ key: 'somethingElse', value: 'Discovery layer' }] }];
    const errors = validateResponse({ name: 'Discovery layer' }, responses);

    expect(errors).toEqual({});
  });

  it('accumulates errors across multiple responses', () => {
    const responses = [
      { code: 'unique', parameters: [{ key: 'linkText', value: 'View in discovery' }] },
      { code: 'unique', parameters: [{ key: 'baseUrl', value: 'https://example.com' }] },
    ];
    const errors = validateResponse(
      { linkText: 'View in discovery', baseUrl: 'https://example.com' },
      responses
    );

    expect(errors.linkText.props.id).toBe('ui-inventory.instanceCustomLink.error.linkTextUnique');
    expect(errors.baseUrl.props.id).toBe('ui-inventory.instanceCustomLink.error.baseUrlUnique');
  });
});
