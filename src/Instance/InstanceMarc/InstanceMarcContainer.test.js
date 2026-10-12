import React from 'react';
import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import InstanceMarcContainer from './InstanceMarcContainer';

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  ViewSource: () => 'ViewSource',
}));
jest.mock('../../common/hooks/useInstance', () => (instanceId) => ({
  instance: { id: instanceId },
  isLoading: false,
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
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render InstanceMarcContainer component', () => {
    renderInstanceMarcContainer();
    expect(screen.getByText('ViewSource')).toBeInTheDocument();
  });
});
