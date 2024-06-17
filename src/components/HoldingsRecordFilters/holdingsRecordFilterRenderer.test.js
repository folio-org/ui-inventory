import { BrowserRouter as Router } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import holdingsRecordFilterRenderer from './holdingsRecordFilterRenderer';
import HoldingsRecordFilters from './HoldingsRecordFilters';

jest.mock('./HoldingsRecordFilters', () => jest.fn(() => <div>HoldingsRecordFilters</div>));

const onChangeMock = jest.fn();

const DATA = {
  locations: [],
  statisticalCodes: [],
  holdingsSources: [],
  holdingsTypes: [],
  tags: [],
  query: { filters: '' },
  consortiaTenants: [],
  filterConfig: {},
};

const renderFilters = (data = DATA, onChange = onChangeMock) => renderWithIntl(
  <Router>{holdingsRecordFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
);


describe('holdingsRecordFilterRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be called with correct props', () => {
    renderFilters();

    const expectedData = {
      locations: DATA.locations,
      statisticalCodes: DATA.statisticalCodes,
      holdingsSources: DATA.holdingsSources,
      holdingsTypes: DATA.holdingsTypes,
      tagsRecords: DATA.tags,
      query: DATA.query,
      consortiaTenants: DATA.consortiaTenants,
    };

    expect(HoldingsRecordFilters).toHaveBeenCalledWith({
      filterConfig: DATA.filterConfig,
      data: expectedData,
      onChange: onChangeMock,
      onClear: expect.any(Function),
    }, {});
  });
});



