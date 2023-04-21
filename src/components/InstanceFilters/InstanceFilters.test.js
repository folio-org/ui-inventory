import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';

import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesConnect.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import userEvent from '@testing-library/user-event';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import InstanceFilters from './InstanceFilters';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

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
  it('Contains a filter for creation date ', () => {
    renderInstanceFilters();
    expect(document.querySelector('[name="createdDate"]')).toBeInTheDocument();
  });

  it('Contains a filter for update date ', () => {
    renderInstanceFilters();
    expect(document.querySelector('[name="updatedDate"]')).toBeInTheDocument();
  });

  it('Should Triger effectiveLocation button', () => {
    renderInstanceFilters();
    const effectiveLocation = screen.getByRole('button', { name: 'effectiveLocation' });
    userEvent.click(effectiveLocation);
    screen.debug(undefined, Infinity);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(effectiveLocation).toBeEnabled();
  });

  it('Should Triger language button', () => {
    renderInstanceFilters();
    const language = screen.getByRole('button', { name: 'language' });
    userEvent.click(language);
    expect(onClear).toHaveBeenCalledTimes(2);
    expect(language).toBeEnabled();
  });

  it('Should Triger resource button', () => {
    renderInstanceFilters();
    const resource = screen.getByRole('button', { name: 'resource' });
    userEvent.click(resource);
    expect(onClear).toHaveBeenCalledTimes(3);
    expect(resource).toBeEnabled();
  });

  it('Should Triger format button', () => {
    renderInstanceFilters();
    const format = screen.getByRole('button', { name: 'format' });
    userEvent.click(format);
    expect(onClear).toHaveBeenCalledTimes(4);
    expect(format).toBeEnabled();
  });

  it('Should Triger mode button', () => {
    renderInstanceFilters();
    const mode = screen.getByRole('button', { name: 'mode' });
    userEvent.click(mode);
    expect(onClear).toHaveBeenCalledTimes(5);
    expect(mode).toBeEnabled();
  });

  it('Should Triger natureOfContent button', () => {
    renderInstanceFilters();
    const natureOfContent = screen.getByRole('button', { name: 'natureOfContent' });
    userEvent.click(natureOfContent);
    expect(onClear).toHaveBeenCalledTimes(6);
    expect(natureOfContent).toBeEnabled();
  });

  it('Should Triger staffSuppress button', () => {
    renderInstanceFilters();
    const staffSuppress = screen.getByRole('button', { name: 'staffSuppress' });
    userEvent.click(staffSuppress);
    expect(onClear).toHaveBeenCalledTimes(7);
    expect(staffSuppress).toBeEnabled();
  });

  it('Should Triger instancesDiscoverySuppress button', () => {
    renderInstanceFilters();
    const instancesDiscoverySuppress = screen.getByRole('button', { name: 'instancesDiscoverySuppress' });
    userEvent.click(instancesDiscoverySuppress);
    expect(onClear).toHaveBeenCalledTimes(8);
    expect(instancesDiscoverySuppress).toBeEnabled();
  });

  it('Should Triger statisticalCodeIds button', () => {
    renderInstanceFilters();
    const statisticalCodeIds = screen.getByRole('button', { name: 'statisticalCodeIds' });
    userEvent.click(statisticalCodeIds);
    expect(onClear).toHaveBeenCalledTimes(9);
    expect(statisticalCodeIds).toBeEnabled();
  });

  it('Should Triger createdDate button', () => {
    renderInstanceFilters();
    const createdDate = screen.getByRole('button', { name: 'createdDate' });
    userEvent.click(createdDate);
    expect(onClear).toHaveBeenCalledTimes(10);
    expect(createdDate).toBeEnabled();
  });

  it('Should Triger updatedDate button', () => {
    renderInstanceFilters();
    const updatedDate = screen.getByRole('button', { name: 'updatedDate' });
    userEvent.click(updatedDate);
    expect(onClear).toHaveBeenCalledTimes(11);
    expect(updatedDate).toBeEnabled();
  });

  it('Should Triger instanceStatus button', () => {
    renderInstanceFilters();
    const instanceStatus = screen.getByRole('button', { name: 'instanceStatus' });
    userEvent.click(instanceStatus);
    expect(onClear).toHaveBeenCalledTimes(12);
    expect(instanceStatus).toBeEnabled();
  });

  it('Should Triger source button', () => {
    renderInstanceFilters();
    const source = screen.getByRole('button', { name: 'source' });
    userEvent.click(source);
    expect(onClear).toHaveBeenCalledTimes(13);
    expect(source).toBeEnabled();
  });
});
