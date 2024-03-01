import React from 'react';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { resources, resources2 } from '../../test/fixtures/DataProviders';
import Harness from '../../test/jest/helpers/Harness';
import '../../test/jest/__mock__';

import DataProvider from './DataProvider';

const Children = () => (
  <h1>DataProvider</h1>
);
const data = resources;
const data2 = resources2;

const renderDataProvider = (props) => render(
  <Harness translations={[]}>
    <DataProvider {...props}><Children /></DataProvider>
  </Harness>
);

describe('DataProvider', () => {
  it('Component should render properly', () => {
    renderDataProvider({ resources: data });

    expect(screen.getByText('DataProvider')).toBeInTheDocument();
  });

  it('Component should be empty', () => {
    const { container } = renderDataProvider({ resources: data2 });

    expect(container).toBeEmptyDOMElement();
  });
});
