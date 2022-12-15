import '../../test/jest/__mock__';
import { BrowserRouter as Router } from 'react-router-dom';
import Confirmation from './Confirmation';

const defaultProps = {
  count: 1,
};

const renderConfirmation = (props = {}) => (
  <Router>
    <Confirmation
      {...defaultProps}
      {...props}
    />
  </Router>
);

describe('Confirmation', () => {
  it('should render remote confirmation message', () => {
    renderConfirmation();
    expect(document.querySelector('#ui-inventory.remote.confirmation.heading')).not.toBeInTheDocument();
  });
  it('should render remote items message', () => {
    renderConfirmation();
    expect(document.querySelector('#ui-inventory.remote.items')).not.toBeInTheDocument();
  });
});
