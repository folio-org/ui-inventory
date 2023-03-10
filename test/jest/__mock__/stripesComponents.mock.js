import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: () => <div>LoadingView</div>,
  LoadingPane: () => <div>LoadingPane</div>,
}), { virtual: true });
