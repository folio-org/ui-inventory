import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useStaffSuppressInitialValue from './useStaffSuppressInitialValue';
import { FACETS } from '../../constants';

const mockOnChange = jest.fn();

describe('useStaffSuppressInitialValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when query.filters is empty', () => {
    it('should not call onChange', () => {
      const query = { filters: '' };
      renderHook(() => useStaffSuppressInitialValue(mockOnChange, query));

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    describe('when hook re-renders with set query.filters', () => {
      it('should call onChange', () => {
        const query = { filters: '' };
        const { rerender } = renderHook(({ onChange, query: _query }) => useStaffSuppressInitialValue(onChange, _query), { initialProps: { onChange: mockOnChange, query } });

        expect(mockOnChange).not.toHaveBeenCalled();

        rerender({ onChange: mockOnChange, query: { filters: 'language.eng' } });
        rerender({ onChange: mockOnChange, query: { filters: 'language.eng' } });

        expect(mockOnChange).toHaveBeenCalledWith({
          name: FACETS.STAFF_SUPPRESS,
          values: ['false'],
        });
      });
    });
  });

  describe('when query.filters is not empty', () => {
    it('should call onChange', () => {
      const query = { filters: 'language.eng' };
      renderHook(() => useStaffSuppressInitialValue(mockOnChange, query));

      expect(mockOnChange).toHaveBeenCalledWith({
        name: FACETS.STAFF_SUPPRESS,
        values: ['false'],
      });
    });
  });
});
