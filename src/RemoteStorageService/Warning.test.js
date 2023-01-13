import { render } from '@testing-library/react';
import '../../test/jest/__mock__/intl.mock';
import { ForItems, ForHoldings } from './Warning';

describe('Warning', () => {
  it('should render ForItems with count props ', () => {
    const { getByText } = render(<ForItems count={2} />);
    expect(getByText(/ui-inventory.remote.warning.common.items something : ui-inventory.remote.items 2/i)).toBeInTheDocument();
  });
  it('should render ForItems without count props ', () => {
    const { getByText } = render(<ForItems />);
    expect(getByText(/ui-inventory.remote.warning.common.items something : ui-inventory.remote.items 1/i)).toBeInTheDocument();
  });
  it('should render ForHoldings with itemCount props', () => {
    const { getByText } = render(<ForHoldings itemCount={1} />);
    expect(getByText(/ui-inventory.remote.warning.common something : ui-inventory.remote.holdings/i)).toBeInTheDocument();
    expect(getByText(/ui-inventory.remote.warning.titles count : 1/i)).toBeInTheDocument();
  });
  it('should render ForHoldings without itemCount props', () => {
    const { getByText } = render(<ForHoldings />);
    expect(getByText(/ui-inventory.remote.warning.common something : ui-inventory.remote.holdings/i)).toBeInTheDocument();
    expect(getByText(/ui-inventory.remote.warning.titles count : 0/i)).toBeInTheDocument();
  });
});
