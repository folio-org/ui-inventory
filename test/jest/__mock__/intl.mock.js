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
