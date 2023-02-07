import { render } from '@testing-library/react';
import { ForItems, ForHoldings } from './Warning';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id, values }) => {
      if (typeof values === 'object') {
        if (Object.keys(values)[0] === 'something') {
          if (values.something.props) {
            if (values.something.props.values) {
              return `${id} ${Object.keys(values)} : ${(values.something.props.id)} ${Object.values(values.something.props.values)}`;
            } else {
              return `${id} ${Object.keys(values)} : ${(values.something.props.id)}`;
            }
          }
        }
        if (Object.keys(values)[0] === 'count') {
          return `${id} ${Object.keys(values)} : ${Object.values(values)}`;
        }
      }
      return id;
    },
  };
  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, values, children }) => {
      if (children) {
        return children([intl.formatMessage({ id, values })]);
      }
      return intl.formatMessage({ id, values });
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});


describe('Warning', () => {
  test('should render ForItems with count props ', () => {
    const { getByText } = render(<ForItems count={2} />);
    expect(getByText(/ui-inventory.remote.warning.common.items something : ui-inventory.remote.items 2/i)).toBeInTheDocument();
  });
  test('should render ForItems without count props ', () => {
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
