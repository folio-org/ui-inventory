import React from 'react';
import { screen, render } from '@testing-library/react';
import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import HoldingsList from './HoldingsList';

jest.mock('./Holding/HoldingContainer', () => jest.fn().mockReturnValue('HoldingContainer'));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderHoldingsList = (props = {}) => render(
  <HoldingsList
    instance={{ id:'test' }}
    holding={{ id:'123' }}
    holdings={[{ id:'2' }]}
    draggable={false}
    droppable={false}
    {...props}
  />,
  { wrapper },
);
describe('HoldingsList', () => {
  it('should render component', () => {
    renderHoldingsList();
    expect(screen.getByText('HoldingContainer')).toBeInTheDocument();
  });
});
