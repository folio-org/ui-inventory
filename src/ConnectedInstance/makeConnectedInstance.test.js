import ApolloConnectedInstance from './ApolloConnectedInstance';
import StripesConnectedInstance from './StripesConnectedInstance';
import makeConnectedInstance from './makeConnectedInstance';

describe('checking properties of ConnectedInstance for the props', () => {
  it('Should return new ApolloConnectedInstance when data is present', () => {
    const props = {
      data: {
        id: 'testID'
      },
      resources: {
        name: 'Test Name'
      },
    };
    const logger = 'test Logger';
    const instance = makeConnectedInstance(props, logger);
    expect(instance).toBeInstanceOf(ApolloConnectedInstance);
  });
  it('Should return new StripesConnectedInstance when only resources is present', () => {
    const props = {
      resources: {
        name: 'Test Name'
      },
      match: {
        params: {
          id: 'Test Params ID '
        }
      }
    };
    const logger = 'test Logger';
    const instance = makeConnectedInstance(props, logger);
    expect(instance).toBeInstanceOf(StripesConnectedInstance);
  });
  it('Should return Null when no data or resources are present', () => {
    const props = {};
    const logger = 'test Logger';
    const instance = makeConnectedInstance(props, logger);
    expect(instance).toBe(null);
  });
});
