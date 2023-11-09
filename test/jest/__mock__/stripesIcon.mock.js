import React from 'react';

jest.mock('@folio/stripes-components/lib/Icon', () => {
  return jest.fn(props => {
    return props.children ? props.children : <span />;
  });
});
