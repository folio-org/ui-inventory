import {
  cleanup,
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import MultiSelectionFacet from './MultiSelectionFacet';
import Harness from '../../../test/jest/helpers/Harness';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  MultiSelection: () => <div>MultiSelection</div>,
}));

const mockOnFilterChange = jest.fn();
const mockOnClearFilter = jest.fn();
const mockFacetOptionFormatter = jest.fn();

const renderMultiSelectionFacet = (props = {}) => render(
  <Harness translations={[]}>
    <MultiSelectionFacet
      id="filter-name"
      name="filter-name"
      label="filter-label"
      closedByDefault
      formatter={mockFacetOptionFormatter}
      valueFormatter
      onClearFilter={mockOnClearFilter}
      onFilterChange={mockOnFilterChange}
      displayClearButton
      options={[{
        id: 'option-1',
        totalRecords: 10,
      }, {
        id: 'option-2',
        totalRecords: 30,
      }, {
        id: 'option-3',
        totalRecords: 20,
      }]}
      selectedValues={[]}
      {...props}
    />
  </Harness>
);

describe('Given MultiSelectionFacet', () => {
  afterEach(cleanup);

  it('Contains a filter for multiselect', () => {
    renderMultiSelectionFacet();

    expect(document.querySelector('#filter-name')).toBeInTheDocument();
  });

  it('should call onClearFilter handler if clear btn is clicked', () => {
    renderMultiSelectionFacet();

    fireEvent.click(screen.getAllByLabelText('Clear selected filters for "filter-label"')[0]);

    expect(mockOnClearFilter).toHaveBeenCalled();
  });
});
