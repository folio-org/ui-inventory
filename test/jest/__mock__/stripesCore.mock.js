
const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: Comp => Comp,
  config: {},
  currency: 'USD',
  hasInterface: jest.fn().mockReturnValue(true),
  hasPerm: jest.fn().mockReturnValue(true),
  locale: 'en-US',
  logger: {
    log: () => { },
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => { },
  setCurrency: () => { },
  setLocale: () => { },
  setSinglePlugin: () => { },
  setTimezone: () => { },
  setToken: () => { },
  store: {
    getState: () => { },
    dispatch: () => { },
    subscribe: () => { },
    replaceReducer: () => { },
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
      consortium: {
        centralTenantId: 'consortia',
      },
    },
  },
  withOkapi: true,
  ...otherProperties,
});

const STRIPES = buildStripes();

const mockStripesCore = {
  stripesConnect: Component => ({ mutator, resources, stripes, ...rest }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest || {}).reduce((acc, mutatorName) => {
      const returnValue = Component.manifest[mutatorName].records ? [] : {};

      acc[mutatorName] = {
        GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
        PUT: jest.fn().mockReturnValue(Promise.resolve()),
        POST: jest.fn().mockReturnValue(Promise.resolve()),
        DELETE: jest.fn().mockReturnValue(Promise.resolve()),
        reset: jest.fn(),
        update: jest.fn(),
        replace: jest.fn(),
      };

      return acc;
    }, {});

    const fakeResources = resources || Object.keys(Component.manifest || {}).reduce((acc, resourceName) => {
      acc[resourceName] = {
        records: [],
      };

      return acc;
    }, {});

    const fakeStripes = stripes || STRIPES;

    return <Component {...rest} mutator={fakeMutator} resources={fakeResources} stripes={fakeStripes} />;
  },

  useOkapiKy: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    extend: jest.fn().mockReturnValue(this),
  }),

  useStripes: jest.fn(() => STRIPES),

  withStripes: Component => ({ stripes, ...rest }) => {
    const fakeStripes = stripes || STRIPES;

    return <Component {...rest} stripes={fakeStripes} />;
  },

  // eslint-disable-next-line react/prop-types
  Pluggable: props => <>{props.children}</>,

  // eslint-disable-next-line react/prop-types
  IfPermission: jest.fn(props => <>{props.children}</>),

  withOkapiKy: jest.fn((Component) => (props) => <Component {...props} />),

  // eslint-disable-next-line react/prop-types
  IfInterface: jest.fn(props => <>{props.children}</>),

  useNamespace: jest.fn(() => ['@folio/inventory']),

  useCallout: jest.fn().mockReturnValue({
    sendCallout: jest.fn(),
  }),

  TitleManager: ({ children }) => <>{children}</>,

  checkIfUserInMemberTenant: jest.fn(() => true),

  checkIfUserInCentralTenant: jest.fn(() => false),

  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetched: true,
    isFetching: false,
    isLoading: false,
  }),

  updateTenant: jest.fn(() => {}),

  validateUser: jest.fn(() => {}),

  useSettings: jest.fn(() => ({ settings: {} })),
};

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  ...mockStripesCore
}), { virtual: true });

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  ...mockStripesCore
}), { virtual: true });

export default buildStripes;
