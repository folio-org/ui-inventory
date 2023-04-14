import { renderHook } from '@testing-library/react-hooks';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesComponents.mock';
import '../../../test/jest/__mock__/currencyData.mock';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useMoveItemsMutation } from './useMoveItemsMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn().mockImplementation(() => ({
    post: jest.fn().mockReturnValue({ nonUpdatedIds: [] }),
  }))
    .mockImplementationOnce(() => ({
      post: jest.fn().mockReturnValue({ nonUpdatedIds: ['testId-1'] }),
    })),
}));

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
const onSuccess = jest.fn();
const onError = jest.fn();

describe('useMoveItemsMutation', () => {
  it('Triggering mutate function with variables', async () => {
    const itemIds = ['itemId1'];
    const { result } = renderHook(() => useMoveItemsMutation({ onError, onSuccess }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe('idle');
    expect(result.current.isIdle).toBe(true);

    await result.current.mutate({ itemIds });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe('loading');
    expect(result.current.isIdle).toBe(false);
    expect(result.current.variables).toEqual({ itemIds: ['itemId1'] });
  });
  it('Triggering mutateAsync function with nonUpdatedIds is empty', async () => {
    const { result } = renderHook(() => useMoveItemsMutation({ onError, onSuccess }), { wrapper });

    await result.current.mutateAsync();

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.status).toBe('success');
    expect(result.current.isIdle).toBe(false);
    expect(result.current.data).toEqual({ nonUpdatedIds: [] });
  });
});
