import { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import useInstanceCustomLinks from './useInstanceCustomLinks';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceCustomLinks', () => {
  const defaultCustomLinks = [{
    name: 'Internal Name 1|2',
    linkText: 'Library OPAC',
    link: 'https://link1.example.com/view/{{UUID}}?id={{UUID}}',
    show: true,
  }, {
    name: 'Internally Named 3&4',
    linkText: 'Graph Viewer',
    link: 'https://link-2.example.com/graph/resource/{{HRID}}',
    show: true,
  }, {
    name: 'Incomplete!',
    linkText: 'Not Ready',
    link: 'https://hidden.example.com',
    show: false,
  }, {
    name: 'Inside Namer 5*6',
    linkText: 'Popular Search',
    link: 'https://search.example.com/q?title={{indexTitle}}',
    show: true,
  }];
  const defaultInstance = {
    id: 'aaaa-bbbb-cccc-ddddddd',
    hrid: 'a1234567890',
    title: 'Lorem ipsum dolor {sit amet}',
  };

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve(defaultCustomLinks),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should filter out non-show custom links', async () => {
    const { result } = renderHook(() => useInstanceCustomLinks(defaultInstance), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.customLinks.length).toBe(3);
  });

  it('should generate DOM-friendly ids from names', async () => {
    const { result } = renderHook(() => useInstanceCustomLinks(defaultInstance), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.customLinks[0].id).toBe('internal-name-1-2aaaa-bbbb-cccc-ddddddd');
    expect(result.current.customLinks[1].id).toBe('internally-named-3-4aaaa-bbbb-cccc-ddddddd');
    expect(result.current.customLinks[2].id).toBe('inside-namer-5-6aaaa-bbbb-cccc-ddddddd');
  });

  it('should pass through link text', async () => {
    const { result } = renderHook(() => useInstanceCustomLinks(defaultInstance), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.customLinks[0].label).toBe('Library OPAC');
    expect(result.current.customLinks[1].label).toBe('Graph Viewer');
    expect(result.current.customLinks[2].label).toBe('Popular Search');
  });

  it('should interpolate UUID and HRID', async () => {
    const { result } = renderHook(() => useInstanceCustomLinks(defaultInstance), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.customLinks[0].link).toBe('https://link1.example.com/view/aaaa-bbbb-cccc-ddddddd?id=aaaa-bbbb-cccc-ddddddd');
    expect(result.current.customLinks[1].link).toBe('https://link-2.example.com/graph/resource/a1234567890');
  });

  it('should interpolate and encode indexTitle', async () => {
    const { result } = renderHook(() => useInstanceCustomLinks(defaultInstance), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.customLinks[2].link).toBe('https://search.example.com/q?title=Lorem%20ipsum%20dolor%20%7Bsit%20amet%7D');
  });
});
