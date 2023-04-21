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

import InstanceFilters from './InstanceFilters';
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

describe('InstanceFilters', () => {
  beforeEach(() => {
    renderInstanceFilters();
  });

  it('Should Triger effectiveLocation button', () => {
    const effectiveLocation = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(effectiveLocation[0]);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(effectiveLocation[0]).toBeEnabled();
  });

  it('Should Triger language button', () => {
    const language = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(language[1]);
    expect(onClear).toHaveBeenCalledTimes(2);
    expect(language[1]).toBeEnabled();
  });

  it('Should Triger resource button', () => {
    const resource = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(resource[2]);
    expect(onClear).toHaveBeenCalledTimes(3);
    expect(resource[2]).toBeEnabled();
  });

  it('Should Triger format button', () => {
    const format = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(format[3]);
    expect(onClear).toHaveBeenCalledTimes(4);
    expect(format[3]).toBeEnabled();
  });

  it('Should Triger mode button', () => {
    const mode = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(mode[4]);
    expect(onClear).toHaveBeenCalledTimes(5);
    expect(mode[4]).toBeEnabled();
  });

  it('Should Triger natureOfContent button', () => {
    const natureOfContent = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(natureOfContent[5]);
    expect(onClear).toHaveBeenCalledTimes(6);
    expect(natureOfContent[5]).toBeEnabled();
  });

  it('Should Triger staffSuppress button', () => {
    const staffSuppress = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(staffSuppress[6]);
    expect(onClear).toHaveBeenCalledTimes(7);
    expect(staffSuppress[6]).toBeEnabled();
  });

  it('Should Triger instancesDiscoverySuppress button', () => {
    const instancesDiscoverySuppress = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(instancesDiscoverySuppress[7]);
    expect(onClear).toHaveBeenCalledTimes(8);
    expect(instancesDiscoverySuppress[7]).toBeEnabled();
  });

  it('Should Triger statisticalCodeIds button', () => {
    const statisticalCodeIds = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(statisticalCodeIds[8]);
    expect(onClear).toHaveBeenCalledTimes(9);
    expect(statisticalCodeIds[8]).toBeEnabled();
  });

  it('Should Triger createdDate button', () => {
    const createdDate = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(createdDate[9]);
    expect(onClear).toHaveBeenCalledTimes(10);
    expect(createdDate[9]).toBeEnabled();
  });

  it('Should Triger updatedDate button', () => {
    const updatedDate = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(updatedDate[10]);
    expect(onClear).toHaveBeenCalledTimes(11);
    expect(updatedDate[10]).toBeEnabled();
  });

  it('Should Triger instanceStatus button', () => {
    const instanceStatus = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(instanceStatus[11]);
    expect(onClear).toHaveBeenCalledTimes(12);
    expect(instanceStatus[11]).toBeEnabled();
  });

  it('Should Triger source button', () => {
    const source = screen.getAllByRole('button', { name: 'onClearFilter' });
    userEvent.click(source[12]);
    expect(onClear).toHaveBeenCalledTimes(13);
    expect(source[12]).toBeEnabled();
  });
});
