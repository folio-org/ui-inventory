import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from './Harness';

const renderWithIntl = (children, translations = [], renderer = render) => renderer(
  <Harness translations={translations}>
    {children}
  </Harness>
);

export default renderWithIntl;
