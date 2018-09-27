// Access properties of an instance, irrespective of whether the data
// is from stripes-connect or Apollo GraphQL.

import ApolloConnectedInstance from './ApolloConnectedInstance';
import StripesConnectedInstance from './StripesConnectedInstance';

// Factory creates the appropriate kind of ConnectedInstance for the props we have
function makeConnectedInstance(props, logger) {
  if (props.data) {
    return new ApolloConnectedInstance(props, logger);
  } else if (props.resources) {
    return new StripesConnectedInstance(props, logger);
  } else {
    // eslint-disable-next-line no-console
    console.warn('makeConnectedInstance: no data or resources');
    return null;
  }
}

export default makeConnectedInstance;
