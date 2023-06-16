import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import '../../../test/jest/__mock__/currencyData.mock';
import '../../../test/jest/__mock__/stripesConfig.mock';
import '../../../test/jest/__mock__/stripesCore.mock';
import '../../../test/jest/__mock__/stripesIcon.mock';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import holdingsRecordFilterRenderer from './holdingsRecordFilterRenderer';


import {
  getSourceOptions,
  getSuppressedOptions,
  processFacetOptions,
  processStatisticalCodes,
} from '../../facetUtils';

jest.mock('../../facetUtils', () => ({
  ...jest.requireActual('../../facetUtils'),
  getSourceOptions: jest.fn(),
  getSuppressedOptions: jest.fn(),
  processFacetOptions: jest.fn(),
  processStatisticalCodes: jest.fn(),
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
      'holdings.permanentLocationId': 'permanentLocationId1',
      'holdings.statisticalCodeIds': 'statisticalCodeIds1',
      'holdings.discoverySuppress': 'discoverySuppress1',
      'holdings.sourceId': 'sourceId1',
      'holdingsTags': 'holdingsTags1',
      'holdings.holdingsTypeId': 'holdingsTypeId1',
    }],
  },
};
const DATA = {

  locations: [],
  statisticalCodes: [],
  holdingsSources: [],
  holdingsTypes: [],
  tags: [],
  query: { filters: '' },
  onFetchFacets: jest.fn(),
  parentResources: resources
};

const renderFilters = (data = DATA, onChange = onChangeMock) => renderWithIntl(
  <Router>{holdingsRecordFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
);


describe('holdingsRecordFilterRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('processFacetOptions should be called when holdingsRecordFilterRenderer renders', () => {
    renderFilters();
    expect(processFacetOptions).toHaveBeenCalledTimes(4);
  });

  it('getSuppressedOptions should be called when holdingsRecordFilterRenderer renders', () => {
    renderFilters();
    expect(getSuppressedOptions).toHaveBeenCalledTimes(1);
  });
  it('getSourceOptions should be called when holdingsRecordFilterRenderer renders', () => {
    renderFilters();
    expect(getSourceOptions).toBeCalled();
  });
  it('processStatisticalCodes should be called when holdingsRecordFilterRenderer renders', () => {
    renderFilters();
    expect(processStatisticalCodes).toHaveBeenCalledTimes(1);
  });

  it('onChange function to be called when clearfilter button is clicked', () => {
    renderFilters();
    userEvent.click(screen.getAllByRole('button', { name: 'onClearFilter' })[0]);
    expect(onChangeMock).toBeCalled();
  });
  it('onChange function to be called when onChange button is clicked', () => {
    renderFilters();
    userEvent.click(screen.getAllByRole('button', { name: 'onChange' })[0]);
    expect(onChangeMock).toBeCalled();
  });
});



