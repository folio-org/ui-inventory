import '../../test/jest/__mock__/intl.mock';
import { render } from '@testing-library/react';
import { Heading, Message } from './Confirmation';

describe('Confirmation', () => {
  it('should render remote confirmation heading', () => {
    const { getByText } = render(<Heading />);
    expect(getByText('ui-inventory.remote.confirmation.heading')).toBeInTheDocument();
  });
  it('should render remote confirmation message with count props', () => {
    const { getByText } = render(<Message count={2} />);
    expect(getByText(/ui-inventory.remote.confirmation.message ui-inventory.remote.items 2/i)).toBeInTheDocument();
  });
  it('should render remote confirmation message without count props', () => {
    const { getByText } = render(<Message />);
    expect(getByText(/ui-inventory.remote.confirmation.message ui-inventory.remote.items 1/i)).toBeInTheDocument();
  });
});
