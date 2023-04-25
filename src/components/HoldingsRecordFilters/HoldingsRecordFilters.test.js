import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';

import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import userEvent from '@testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import HoldingsRecordFilters from './HoldingsRecordFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.mock('../CheckboxFacet/CheckboxFacet', () => jest.fn().mockReturnValue('CheckboxFacet'));

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
}));

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [{
      'items.effectiveLocationId': 'effectiveLocationId1',
      'holdings.permanentLocationId': 'permanentLocationId1',
      'holdings.statisticalCodeIds': 'statisticalCodeIds1',
      'holdings.discoverySuppress': 'discoverySuppress1',
      'holdings.sourceId': 'sourceId1',
      'holdingsTags': 'holdingsTags1',
      'holdings.holdingsTypeId': 'holdingsTypeId1',
    }],
    other: { totalRecords: 0 }
  },
};

const data = {
  locations: [],
  resourceTypes: [],
  instanceFormats: [],
  modesOfIssuance: [],
  statisticalCodes: [],
  tagsRecords: [],
  natureOfContentTerms: [],
  query: [],
  onFetchFacets: jest.fn(),
  parentResources: resources,
};
const onChange = jest.fn();
const onClear = jest.fn();
const renderHoldingsRecordFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <HoldingsRecordFilters
          activeFilters={{ 'language': ['eng'] }}
          data={data}
          onChange={onChange}
          onClear={onClear}
          parentResources={resources}
        />
      </ModuleHierarchyProvider>
    </Router>,
    translationsProperties
  );
};

describe('HoldingsRecordFilters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Triger effectiveLocation button', () => {
    renderHoldingsRecordFilters();
    const effectiveLocation = screen.getByRole('button', { name: 'Effective location (item) filter list' });
    userEvent.click(effectiveLocation);
    expect(onClear).toBeCalled();
    expect(effectiveLocation).toBeEnabled();
  });

  it('Should Triger holdingsPermanentLocation button', () => {
    renderHoldingsRecordFilters();
    const holdingsPermanentLocation = screen.getByRole('button', { name: 'Holdings permanent location filter list' });
    userEvent.click(holdingsPermanentLocation);
    expect(onClear).toBeCalled();
    expect(holdingsPermanentLocation).toBeEnabled();
  });

  it('Should Triger holdingsType button', () => {
    renderHoldingsRecordFilters();
    const holdingsType = screen.getByRole('button', { name: 'Holdings type filter list' });
    userEvent.click(holdingsType);
    expect(onClear).toBeCalled();
    expect(holdingsType).toBeEnabled();
  });

  it('Should Triger holdingsDiscoverySuppress button', () => {
    renderHoldingsRecordFilters();
    const holdingsDiscoverySuppress = screen.getByRole('button', { name: 'Suppress from discovery filter list' });
    userEvent.click(holdingsDiscoverySuppress);
    expect(onClear).toBeCalled();
    expect(holdingsDiscoverySuppress).toBeEnabled();
  });

  it('Should Triger holdingsStatisticalCodeIds button', () => {
    renderHoldingsRecordFilters();
    const holdingsStatisticalCodeIds = screen.getByRole('button', { name: 'Statistical code filter list' });
    userEvent.click(holdingsStatisticalCodeIds);
    expect(onClear).toBeCalled();
    expect(holdingsStatisticalCodeIds).toBeEnabled();
  });

  it('Should Triger holdingsCreatedDate button', () => {
    renderHoldingsRecordFilters();
    const holdingsCreatedDate = screen.getByRole('button', { name: 'Date created filter list' });
    userEvent.click(holdingsCreatedDate);
    expect(onClear).toBeCalled();
    expect(holdingsCreatedDate).toBeEnabled();
  });

  it('Should Triger holdingsUpdatedDate button', () => {
    renderHoldingsRecordFilters();
    const holdingsUpdatedDate = screen.getByRole('button', { name: 'Date updated filter list' });
    userEvent.click(holdingsUpdatedDate);
    expect(onClear).toBeCalled();
    expect(holdingsUpdatedDate).toBeEnabled();
  });

  it('Should Triger holdingsSource button', () => {
    renderHoldingsRecordFilters();
    const holdingsSource = screen.getByRole('button', { name: 'Source filter list' });
    userEvent.click(holdingsSource);
    expect(onClear).toBeCalled();
    expect(holdingsSource).toBeEnabled();
  });
});
