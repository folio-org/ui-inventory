import { render } from '@testing-library/react';

import MultiSelectionFacet from './MultiSelectionFacet';
import Harness from '../../../test/jest/helpers/Harness';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  MultiSelection: () => <div>MultiSelection</div>,
}));

const mockOnFilterChange = jest.fn();
const mockOnClearFilter = jest.fn();

const renderMultiSelectionFacet = (props = {}) => render(
  <Harness>
    <MultiSelectionFacet
      id="filter-name"
      name="filter-name"
      label="filter-label"
      closedByDefault
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
  it('should render multiselect', () => {
    const { getByText } = renderMultiSelectionFacet();

    expect(getByText('MultiSelection')).toBeDefined();
  });
});
