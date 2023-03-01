import '../../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import InstanceMovementDetailsContainer from './InstanceMovementDetailsContainer';

jest.mock('./InstanceMovementDetails', () => jest.fn().mockReturnValue('InstanceMovementDetails'));

const mutator = {
  marcRecord:{
    GET: jest.fn().mockImplementation(() => Promise.resolve())
  }
};
const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);
const instance = { source : 'MARC' };
const renderInstanceMovementDetailsContainer = (props = {}) => render(
  <InstanceMovementDetailsContainer
    instance={instance}
    onClose={jest.fn()}
    hasMarc
    id=""
    mutator={mutator}
    {...props}
  />,
  { wrapper },
);

describe('InstanceMovementDetailsContainer', () => {
  it('should render InstanceMovementDetailsContainer component', () => {
    renderInstanceMovementDetailsContainer();
    expect(screen.getByText('InstanceMovementDetails')).toBeInTheDocument();
  });
});
