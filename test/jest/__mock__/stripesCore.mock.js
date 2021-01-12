import React from 'react';

jest.mock('@folio/stripes-core/src/stripesConnect', () => Component => props => <Component {...props} />);
