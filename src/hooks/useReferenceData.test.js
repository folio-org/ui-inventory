import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { DataContext } from '../contexts';
import useReferenceData from './useReferenceData';

describe('useReferenceData', () => {
  it('return the data from the DataContext', () => {
    const data = { foo: 'dataFoo' };
    const wrapper = ({ children }) => (
      <DataContext.Provider value={data}>{children}</DataContext.Provider>
    );
    const { result } = renderHook(() => useReferenceData(), { wrapper });
    expect(result.current).toEqual(data);
  });
});
