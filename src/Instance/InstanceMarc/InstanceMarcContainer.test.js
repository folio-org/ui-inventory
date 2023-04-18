import React from 'react';
import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import InstanceMarcContainer from './InstanceMarcContainer';

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  ViewSource: () => 'ViewSource',
}));

const mutator = {};
const instanceId = 'its me instanceId';

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderInstanceMarcContainer = (props = {}) => render(
  <InstanceMarcContainer
    instanceId={instanceId}
    mutator={mutator}
    {...props}
  />,
  { wrapper },
);

describe('InstanceMarcContainer', () => {
  it('should render InstanceMarcContainer component', () => {
    renderInstanceMarcContainer();
    expect(screen.getByText('ViewSource')).toBeInTheDocument();
  });
});
