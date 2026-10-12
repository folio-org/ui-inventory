import errorResponseNotifications from './errorResponseNotifications';

const mockSendCallout = jest.fn();
const mockCallout = {
  sendCallout: mockSendCallout,
};

describe('getCustomErrorMessages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows no callouts when response contains no errors', () => {
    errorResponseNotifications(mockCallout, []);

    expect(mockSendCallout).not.toHaveBeenCalled();
  });

  it('shows the generic case callout when response contains a field-specific unique error for an unrecognized field', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'unique',
      parameters: [{ key: 'description', value: 'Foo' }],
      message: 'description must be unique',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    expect(mockSendCallout).toHaveBeenCalledWith({ type: 'error', message: 'description must be unique (description)' });
  });

  it('shows the callout for name uniqueness error', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'unique',
      parameters: [{ key: 'name', value: 'Foo' }],
      message: 'name must be unique',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    const { type, message } = mockSendCallout.mock.calls[0][0];
    expect(type).toBe('error');
    expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.nameUnique');
  });

  it('shows the callout for linkText uniqueness error', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'unique',
      parameters: [{ key: 'linkText', value: 'Bar' }],
      message: 'linkText must be unique',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    const { type, message } = mockSendCallout.mock.calls[0][0];
    expect(type).toBe('error');
    expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkTextUnique');
  });

  it('shows the callout for link uniqueness error', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'unique',
      parameters: [{ key: 'link', value: 'https://example.com' }],
      message: 'link must be unique',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    const { type, message } = mockSendCallout.mock.calls[0][0];
    expect(type).toBe('error');
    expect(message.props.id).toBe('ui-inventory.instanceCustomLinks.error.linkUnique');
  });

  it('shows the callout for a generic, non-uniqueness related error', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'genericError',
      message: 'Something went wrong',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    expect(mockSendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' });
  });

  it('shows the callout for a generic, non-uniqueness related error unrelated to any field', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'genericError',
      parameters: [],
      message: 'Something went wrong',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    expect(mockSendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong' });
  });

  it('shows the callout for a generic, non-uniqueness related error including the relevant field', () => {
    errorResponseNotifications(mockCallout, [{
      code: 'genericError',
      parameters: [{ key: 'name', value: 'Foo' }],
      message: 'Something went wrong',
    }]);

    expect(mockSendCallout).toHaveBeenCalledTimes(1);
    expect(mockSendCallout).toHaveBeenCalledWith({ type: 'error', message: 'Something went wrong (name)' });
  });
});
