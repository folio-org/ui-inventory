import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react-hooks';

import usePiecesMutation from './usePiecesMutation';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePiecesMutation', () => {
  it('should call the mutation function with the correct arguments', () => {
    const mockMutation = jest.fn();
    const mockOptions = { onSuccess: jest.fn() };
    const { result } = renderHook(() => usePiecesMutation(mockOptions), { wrapper });

    act(() => {
      result.current(mockMutation);
    });

    expect(mockMutation).toHaveBeenCalledWith(mockOptions);
  });
});
