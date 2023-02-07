import { render } from '@testing-library/react';
import { Heading, Message } from './Confirmation';

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


describe('Confirmation', () => {
  it('should render remote confirmation heading', () => {
    const { getByText } = render(<Heading />);
    expect(getByText('ui-inventory.remote.confirmation.heading')).toBeInTheDocument();
  });
  it('should render remote confirmation message with count props', () => {
    const { getByText } = render(<Message count={2} />);
    expect(getByText(/ui-inventory.remote.confirmation.message something : ui-inventory.remote.items 2/i)).toBeInTheDocument();
  });
  it('should render remote confirmation message without count props', () => {
    const { getByText } = render(<Message />);
    expect(getByText(/ui-inventory.remote.confirmation.message something : ui-inventory.remote.items 1/i)).toBeInTheDocument();
  });
});
