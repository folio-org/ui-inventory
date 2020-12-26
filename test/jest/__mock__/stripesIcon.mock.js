import React from 'react';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  return props => {
    return props.children ? props.children : <span />;
  };
});
