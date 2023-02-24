import React from 'react';
import { render } from '@testing-library/react';

import Harness from './Harness';

let rtlApi;

const renderWithIntl = (children, translations = [], options = {}) => {
  const renderFn = options.rerender ? rtlApi.rerender : render;
  rtlApi = renderFn(
    <Harness translations={translations}>
      {children}
    </Harness>
  );
  return rtlApi;
};

export default renderWithIntl;
