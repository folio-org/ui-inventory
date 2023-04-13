import StripesConnectedInstance from './StripesConnectedInstance';

describe('StripesConnectedInstance', () => {
  it('return the selected instance when id matches', () => {
    const props = {
      match: {
        params: { id: '123' }
      },
      selectedInstance: {
        id: '123',
        name: 'Instance 123'
      }
    };
    const logger = { log: jest.fn() };
    const instance = new StripesConnectedInstance(props, logger);
    expect(instance.instance()).toEqual({
      id: '123',
      name: 'Instance 123'
    });
  });
  it('return null when id does not match', () => {
    const props = {
      match: {
        params: { id: '456' }
      },
      selectedInstance: {
        id: '123',
        name: 'Instance 123'
      }
    };
    const logger = { log: jest.fn() };
    const instance = new StripesConnectedInstance(props, logger);
    expect(instance.instance()).toBeNull();
  });
  it('return null when selectedInstance is not defined', () => {
    const props = {
      match: {
        params: { id: '456' }
      },
      selectedInstance: null
    };
    const logger = { log: jest.fn() };
    const instance = new StripesConnectedInstance(props, logger);
    expect(instance.instance()).toBeNull();
  });
});
