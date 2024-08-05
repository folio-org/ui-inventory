import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { segments } from '@folio/stripes-inventory-components';

import FilterNavigation from './FilterNavigation';
import { renderWithIntl, translationsProperties } from '../../../test/jest/helpers';
import { useLastSearchTerms } from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLastSearchTerms: jest.fn(),
}));

const mockOnChange = jest.fn();

const defaultHistory = createMemoryHistory();

const renderFilterNavigation = ({ history, ...props } = {}) => renderWithIntl(
  <Router history={history || defaultHistory}>
    <FilterNavigation
      segment={segments.instances}
      onChange={mockOnChange}
      {...props}
    />
  </Router>,
  translationsProperties
);

describe('Given FilterNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLastSearchTerms.mockReturnValue({
      getLastSearch: jest.fn(() => '?filters=staffSuppress.false&segment=instances&sort=title'),
    });
  });

  describe('when pressing the current segment', () => {
    it('should not fire onChange', () => {
      const { getByRole } = renderFilterNavigation();

      const instanceSegment = getByRole('button', { name: 'Instance' });
      fireEvent.click(instanceSegment);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('when clicking another segment', () => {
    it('should fire onChange', () => {
      const { getByRole } = renderFilterNavigation();

      const holdingsSegment = getByRole('button', { name: 'Holdings' });
      fireEvent.click(holdingsSegment);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
