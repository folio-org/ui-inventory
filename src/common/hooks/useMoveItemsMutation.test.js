import '../../../test/jest/__mock__';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useMoveItemsMutation } from './useMoveItemsMutation';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Data and variables should pass with values', async () => {
    const mockPost = jest.fn().mockReturnValue({ nonUpdatedIds: ['testId-1'] });
    useOkapiKy.mockClear().mockReturnValue({
      post: mockPost,
    });
    const itemIds = ['itemId1'];
    const { result } = renderHook(() => useMoveItemsMutation({ onError, onSuccess }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe('idle');
    expect(result.current.isIdle).toBe(true);

    await result.current.mutateAsync({ itemIds });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.status).toBe('success');
    expect(result.current.isIdle).toBe(false);
    expect(result.current.data).toEqual({ nonUpdatedIds: ['testId-1'] });
    expect(result.current.variables).toEqual({ itemIds: ['itemId1'] });
  });
  it('Data and variables should pass with empty values', async () => {
    const mockPost = jest.fn().mockReturnValue({ nonUpdatedIds: [] });
    useOkapiKy.mockClear().mockReturnValue({
      post: mockPost,
    });
    const itemIds = [];
    const { result } = renderHook(() => useMoveItemsMutation({ onError, onSuccess }), { wrapper });

    await result.current.mutateAsync({ itemIds });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.status).toBe('success');
    expect(result.current.isIdle).toBe(false);
    expect(result.current.data).toEqual({ nonUpdatedIds: [] });
    expect(result.current.variables).toEqual({ itemIds: [] });
  });
});
