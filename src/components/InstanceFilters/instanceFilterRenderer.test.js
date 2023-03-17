import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/dom';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

import instanceFilterRenderer from './instanceFilterRenderer';

const DATA = {
  locations: [],
  instanceFormats: [],
  modesOfIssuance: [],
  natureOfContentTerms: [],
  statisticalCodes: [],
  query: [],
  onFetchFacets: [],
  parentResources: { facets: { records: [] } },
  instanceStatuses: [],
};

const renderFilters = (data = DATA, onChange = noop) => (renderWithIntl(
  <Router>{instanceFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
));

describe('instanceFilterRenderer function', () => {
  beforeEach(() => renderFilters());
  it('should display filter by tags accordion', () => {
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should display Effective Location', () => {
    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  it('should display effectiveLocation field', () => {
    expect(screen.getByText('effectiveLocation-field')).toBeInTheDocument();
  });

  it('should display language-field', () => {
    expect(screen.getByText('language-field')).toBeInTheDocument();
  });
});
