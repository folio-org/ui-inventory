import { BrowserRouter as Router } from 'react-router-dom';

import itemFilterRenderer from './itemFilterRenderer';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ItemFilters from './ItemFilters';
import { itemStatuses } from '../../constants';

jest.mock('./ItemFilters', () => jest.fn(() => <div>ItemFilters</div>));

const DATA = {
  materialTypes: [],
  statisticalCodes: [],
  locations: [],
  tags: [],
  consortiaTenants: [],
  query: {},
  filterConfig: {},
};

const mockOnChange = jest.fn();

const renderFilters = (data = DATA, onChange = mockOnChange) => (renderWithIntl(
  <Router>{itemFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
));

describe('itemFilterRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be called with correct props', () => {
    renderFilters();

    const expectedData = {
      materialTypes: DATA.materialTypes,
      itemStatuses,
      statisticalCodes: DATA.statisticalCodes,
      locations: DATA.locations,
      tagsRecords: DATA.tags,
      query: DATA.query,
      consortiaTenants: DATA.consortiaTenants,
    };

    expect(ItemFilters).toHaveBeenCalledWith({
      data: expectedData,
      filterConfig: DATA.filterConfig,
      onChange: mockOnChange,
      onClear: expect.any(Function),
    }, {});
  });
});
