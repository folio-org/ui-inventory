import { BrowserRouter as Router } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import instanceFilterRenderer from './instanceFilterRenderer';
import InstanceFilters from './InstanceFilters';

jest.mock('./InstanceFilters', () => jest.fn(() => <div>InstanceFilters</div>));

const onChangeMock = jest.fn();

const DATA = {
  consortiaTenants: ['tenant'],
  locations: ['Location 1', 'Location 2'],
  instanceTypes: ['Book', 'CD'],
  instanceFormats: ['Physical', 'Electronic'],
  instanceStatuses: ['Available', 'Checked Out'],
  modesOfIssuance: ['Monograph', 'Serial'],
  natureOfContentTerms: ['Fiction', 'Non-fiction'],
  statisticalCodes: [],
  query: {
    filters: 'locations.id,instanceTypes.id',
  },
  tags: [],
  filterConfig: {},
};

const renderFilters = (data = DATA, onChange = onChangeMock) => renderWithIntl(
  <Router>{instanceFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
);

describe('instanceFilterRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be called with correct props', () => {
    renderFilters();

    const expectedData = {
      consortiaTenants: DATA.consortiaTenants,
      instanceFormats: DATA.instanceFormats,
      instanceStatuses: DATA.instanceStatuses,
      locations: DATA.locations,
      modesOfIssuance: DATA.modesOfIssuance,
      natureOfContentTerms: DATA.natureOfContentTerms,
      query: DATA.query,
      instanceTypes: DATA.instanceTypes,
      statisticalCodes: DATA.statisticalCodes,
      tagsRecords: DATA.tags,
    };

    expect(InstanceFilters).toHaveBeenCalledWith({
      data: expectedData,
      filterConfig: DATA.filterConfig,
      onChange: onChangeMock,
      onClear: expect.any(Function),
    }, {});
  });
});
