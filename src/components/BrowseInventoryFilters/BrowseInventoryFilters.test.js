import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import BrowseInventoryFilters from './BrowseInventoryFilters';
import { DataContext } from '../../contexts';
import { browseConfig } from '../../filterConfig';
import { InstanceFiltersBrowse } from '../InstanceFilters';

jest.mock('../InstanceFilters', () => ({
  InstanceFiltersBrowse: jest.fn(() => <div>InstanceFiltersBrowse</div>),
}));

const data = {
  consortiaTenants: [],
};

const query = {
  qindex: '',
};

const renderBrowseInventoryFilters = (props = {}) => renderWithIntl(
  <DataContext.Provider value={data}>
    <BrowseInventoryFilters
      applyFilters={jest.fn()}
      query={query}
      {...props}
    />
  </DataContext.Provider>,
  translationsProperties,
);

describe('BrowseInventoryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be called with correct props', () => {
    renderBrowseInventoryFilters();

    expect(InstanceFiltersBrowse).toHaveBeenCalledWith({
      filterConfig: browseConfig,
      data: { ...data, query },
      onChange: expect.any(Function),
      onClear: expect.any(Function),
    }, {});
  });
});
