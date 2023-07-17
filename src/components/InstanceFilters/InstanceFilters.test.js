import React from 'react';
import '../../../test/jest/__mock__';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import {
  FACETS
} from '../../constants';
import InstanceFilters from './InstanceFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.mock('../CheckboxFacet/CheckboxFacet', () => jest.fn().mockReturnValue('CheckboxFacet'));

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
}));

const activeFilters = {
  [FACETS.EFFECTIVE_LOCATION]: ['loc1'],
  [FACETS.ITEM_STATUS]: ['ITEM_STATUS1'],
  [FACETS.RESOURCE]: ['RESOURCE1'],
  [FACETS.FORMAT]: ['Format1'],
  [FACETS.MODE]: ['Mode1'],
  [FACETS.NATURE_OF_CONTENT]: ['NATUREOFCONTENT1'],
  [FACETS.STAFF_SUPPRESS]: ['STAFFSUPPRESS1'],
  [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: ['DISCOVERYSUPPRESS1'],
  [FACETS.STATISTICAL_CODE_IDS]: ['STATISTICALCODEIDS1'],
  [FACETS.CREATED_DATE]: ['2022-01-01'],
  [FACETS.UPDATED_DATE]: ['2022-01-01'],
  [FACETS.STATUS]: ['STATUS1'],
  [FACETS.SOURCE]: ['SOURCE1']
};

const resources = {
  facets: {
    hasLoaded: true,
    resource: 'facets',
    records: [{
      'items.effectiveLocationId': 'effectiveLocationId1',
      'languages': 'languages',
      'statisticalCodeIds': 'statisticalCodeIds1',
      'discoverySuppress': 'discoverySuppress1',
      'source': 'source1',
      'instanceTags': 'instanceTags1',
      'statusId': 'statusId1',
      'staffSuppress': 'staffSuppress1',
      'natureOfContentTermIds': 'natureOfContentTermIds1',
      'modeOfIssuanceId': 'modeOfIssuanceId1',
      'instanceFormatIds': 'instanceFormatIds1',
      'instanceTypeId': 'instanceTypeId1',
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
const renderInstanceFilters = () => {
  return renderWithIntl(
    <Router>
      <ModuleHierarchyProvider module="@folio/inventory">
        <InstanceFilters
          activeFilters={activeFilters}
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

describe('InstanceFilters', () => {
  it('Should Clear selected filters for effective Location', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[1]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });
  it('Should Clear selected filters for language', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[3]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for resource', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[5]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for format', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[7]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for mode', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[9]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for nature Of Content', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[11]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for staffSuppress', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[13]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Suppress from discovery', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[15]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Statistical code filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[17]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Date created filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[19]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Date updated filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[26]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Instance status filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[33]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });

  it('Should Clear selected filters for Source filter list', async () => {
    renderInstanceFilters();
    const Clearselectedfilters = screen.getAllByRole('button');
    userEvent.click(Clearselectedfilters[35]);
    await waitFor(() => {
      expect(onClear).toBeCalled();
    });
  });
});
