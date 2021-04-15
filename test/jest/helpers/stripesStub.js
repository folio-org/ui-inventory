import React from 'react';
import { noop } from 'lodash';

const stripesStub = {
  connect: Component => <Component />,
  hasPerm: () => true,
  hasInterface: () => true,
  logger: { log: noop },
  locale: 'en-US',
  plugins: {},
  okapi: { tenant: 'test' },
};

export default stripesStub;
