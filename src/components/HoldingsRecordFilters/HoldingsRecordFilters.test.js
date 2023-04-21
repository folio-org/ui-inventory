import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
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
    const { onClearFilter, children } = props;
    const component =
      <div>
        <button type="button" onClick={() => onClearFilter()}>onClearFilter</button>
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
    renderHoldingsRecordFilters();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should Render effectiveLocation button', async () => {
    const effectiveLocation = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(effectiveLocation[0]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(effectiveLocation[0]).toBeEnabled();
  });

  it('Should Render holdingsPermanentLocation button', async () => {
    const holdingsPermanentLocation = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsPermanentLocation[1]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsPermanentLocation[1]).toBeEnabled();
  });

  it('Should Render holdingsType button', async () => {
    const holdingsType = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsType[2]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsType[2]).toBeEnabled();
  });

  it('Should Render holdingsDiscoverySuppress button', async () => {
    const holdingsDiscoverySuppress = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsDiscoverySuppress[3]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsDiscoverySuppress[3]).toBeEnabled();
  });

  it('Should Render holdingsStatisticalCodeIds button', async () => {
    const holdingsStatisticalCodeIds = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsStatisticalCodeIds[4]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsStatisticalCodeIds[4]).toBeEnabled();
  });

  it('Should Render holdingsCreatedDate button', async () => {
    const holdingsCreatedDate = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsCreatedDate[5]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsCreatedDate[5]).toBeEnabled();
  });

  it('Should Render holdingsUpdatedDate button', async () => {
    const holdingsUpdatedDate = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsUpdatedDate[6]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsUpdatedDate[6]).toBeEnabled();
  });

  it('Should Render holdingsSource button', async () => {
    const holdingsSource = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(holdingsSource[7]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
    expect(holdingsSource[7]).toBeEnabled();
  });
});
