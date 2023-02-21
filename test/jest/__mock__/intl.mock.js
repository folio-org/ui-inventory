jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id, values }) => {
      if (values) {
        if (values.something.props) {
          return `${id} ${(values.something.props.id)} ${Object.values(values.something.props.values)}`;
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
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});
