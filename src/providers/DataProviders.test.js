import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { resources, resources2 } from '../../test/fixtures/DataProviders';
import '../../test/jest/__mock__';

import DataProvider from './DataProvider';

const Children = () => (
  <h1>DataProvider</h1>
);
const data = resources;
const data2 = resources2;
describe('DataProvider', () => {
  it('Component should render properly', () => {
    render(<DataProvider resources={data}><Children /></DataProvider>);
    expect(screen.getByText('DataProvider')).toBeInTheDocument();
  });
  it('Component should be empty', () => {
    const { container } = render(<DataProvider resources={data2}><Children /></DataProvider>);
    expect(container).toBeEmptyDOMElement();
  });
});
