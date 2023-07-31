import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import instanceFilterRenderer from './instanceFilterRenderer';


import {
  getSourceOptions,
  getSuppressedOptions,
  processFacetOptions,
  processStatisticalCodes,
} from '../../facetUtils';
import { languageOptionsES } from './languages';

jest.mock('./languages', () => ({
  ...jest.requireActual('./languages'),
  languageOptionsES: jest.fn(),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Accordion: jest.fn(({ onClearFilter, children }) => (
    <div>
      {children}
      <button type="button" onClick={() => onClearFilter()}>onClearFilter</button>
    </div>
  )),
}), { virtual: true });

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
  processFacetOptions: jest.fn(),
  processStatisticalCodes: jest.fn(),
}));
jest.mock('../CheckboxFacet/CheckboxFacet', () => ({ onChange }) => (
  <div>
    <div>CheckboxFacet</div>
    <button type="button" onClick={() => onChange()}>onChange</button>
  </div>
));

const onChangeMock = jest.fn();
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
  },
};
const DATA = {
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
  onFetchFacets: jest.fn(),
  parentResources: resources,
};

const renderFilters = (data = DATA, onChange = onChangeMock) => renderWithIntl(
  <Router>{instanceFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
);

describe('instanceFilterRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('processFacetOptions should be called when instanceFilterRenderer renders', () => {
    renderFilters();
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.locations, undefined, expect.anything(), expect.anything());
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.instanceTypes, undefined, expect.anything(), expect.anything());
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.instanceFormats, undefined, expect.anything(), expect.anything());
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.modesOfIssuance, undefined, expect.anything(), expect.anything());
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.natureOfContentTerms, undefined, expect.anything(), expect.anything());
    expect(processFacetOptions).toBeCalledWith(undefined, DATA.instanceStatuses, undefined, expect.anything(), expect.anything());
  });
  it('languageOptionsES should be called when instanceFilterRenderer renders', () => {
    renderFilters();
    expect(languageOptionsES).toBeCalled();
  });
  it('getSuppressedOptions should be called when instanceFilterRenderer renders', () => {
    renderFilters();
    expect(getSuppressedOptions).toHaveBeenCalledTimes(2);
  });
  it('getSourceOptions should be called when instanceFilterRenderer renders', () => {
    renderFilters();
    expect(getSourceOptions).toBeCalled();
  });
  it('processStatisticalCodes should be called when instanceFilterRenderer renders', () => {
    renderFilters();
    expect(processStatisticalCodes).toBeCalledWith(undefined, DATA.statisticalCodes, undefined, expect.anything(), expect.anything());
  });
  it('onChange function to be called when clearfilter button is clicked', () => {
    renderFilters();
    fireEvent.click(screen.getAllByRole('button', { name: 'onClearFilter' })[0]);
    expect(onChangeMock).toBeCalled();
  });
  it('onChange function to be called when onChange button is clicked', () => {
    renderFilters();
    fireEvent.click(screen.getAllByRole('button', { name: 'onChange' })[0]);
    expect(onChangeMock).toBeCalled();
  });
});
