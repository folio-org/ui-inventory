import ApolloConnectedInstance from './ApolloConnectedInstance';

describe('ApolloConnectedInstance', () => {
  it('store the props and logger in instance variables', () => {
    const props = { data: { instance: { id: 1, name: 'Test instance' } } };
    const logger = { log: jest.fn() };
    const instance = new ApolloConnectedInstance(props, logger);
    expect(instance.props).toEqual(props);
    expect(instance.logger).toEqual(logger);
  });
  it('return the instance object from the props', () => {
    const props = { data: { instance: { id: 1, name: 'Test instance' } } };
    const logger = { log: jest.fn() };
    const instance = new ApolloConnectedInstance(props, logger);
    expect(instance.instance()).toEqual(props.data.instance);
    expect(logger.log).toHaveBeenCalledWith('instance', 'instance:', props.data.instance);
  });
});
