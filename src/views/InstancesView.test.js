import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '../../test/jest/__mock__';
import InstancesView from './InstancesView';

jest.mock('../components/InstancesList/InstancesList', () => jest.fn().mockReturnValue('InstancesList'));

const prevProps = {
  data: {},
  parentResources: { records: [], facets: [] },
  segment: '',
};
const nextProps = {
  data: {},
  parentResources: { records: [], facets: [] },
  segment: '',
};

const props = {
  prevProps,
  nextProps
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderInstancesView = () => render(
  <InstancesView {...props} />,
  { wrapper },
);

describe('InstancesView', () => {
  it('should render the InstancesList component', () => {
    renderInstancesView();
    screen.debug();
    expect(screen.getByText(/InstancesList/i)).toBeInTheDocument();
    expect(screen.getByText(/InstancesList/i)).toHaveAttribute('data-test-inventory-instances', 'true');
  });
});
