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

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Accordion: (props) => {
    const { onClearFilter, name, children } = props;
    const component =
      <div>
        <button type="button" name={name} onClick={() => onClearFilter()}>{name}</button>
        <div>{children}</div>
      </div>;
    return (component);
  },
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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Contains a filter for creation date ', () => {
    renderHoldingsRecordFilters();
    expect(document.querySelector('[name="holdingsCreatedDate"]')).toBeInTheDocument();
  });

  it('Contains a filter for update date ', () => {
    renderHoldingsRecordFilters();
    expect(document.querySelector('[name="holdingsUpdatedDate"]')).toBeInTheDocument();
  });

  it('Should Triger effectiveLocation button', () => {
    renderHoldingsRecordFilters();
    const effectiveLocation = screen.getByRole('button', { name: 'effectiveLocation' });
    userEvent.click(effectiveLocation);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(effectiveLocation).toBeEnabled();
  });

  it('Should Triger holdingsPermanentLocation button', () => {
    renderHoldingsRecordFilters();
    const holdingsPermanentLocation = screen.getByRole('button', { name: 'holdingsPermanentLocation' });
    userEvent.click(holdingsPermanentLocation);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsPermanentLocation).toBeEnabled();
  });

  it('Should Triger holdingsType button', () => {
    renderHoldingsRecordFilters();
    const holdingsType = screen.getByRole('button', { name: 'holdingsType' });
    userEvent.click(holdingsType);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsType).toBeEnabled();
  });

  it('Should Triger holdingsDiscoverySuppress button', () => {
    renderHoldingsRecordFilters();
    const holdingsDiscoverySuppress = screen.getByRole('button', { name: 'holdingsDiscoverySuppress' });
    userEvent.click(holdingsDiscoverySuppress);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsDiscoverySuppress).toBeEnabled();
  });

  it('Should Triger holdingsStatisticalCodeIds button', () => {
    renderHoldingsRecordFilters();
    const holdingsStatisticalCodeIds = screen.getByRole('button', { name: 'holdingsStatisticalCodeIds' });
    userEvent.click(holdingsStatisticalCodeIds);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsStatisticalCodeIds).toBeEnabled();
  });

  it('Should Triger holdingsCreatedDate button', () => {
    renderHoldingsRecordFilters();
    const holdingsCreatedDate = screen.getByRole('button', { name: 'holdingsCreatedDate' });
    userEvent.click(holdingsCreatedDate);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsCreatedDate).toBeEnabled();
  });

  it('Should Triger holdingsUpdatedDate button', () => {
    renderHoldingsRecordFilters();
    const holdingsUpdatedDate = screen.getByRole('button', { name: 'holdingsUpdatedDate' });
    userEvent.click(holdingsUpdatedDate);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsUpdatedDate).toBeEnabled();
  });

  it('Should Triger holdingsSource button', () => {
    renderHoldingsRecordFilters();
    const holdingsSource = screen.getByRole('button', { name: 'holdingsSource' });
    userEvent.click(holdingsSource);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(holdingsSource).toBeEnabled();
  });
});
