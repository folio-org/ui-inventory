import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import itemFilterRenderer from './itemFilterRenderer';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

const DATA = {
  materialTypes: [],
  locations: [],
  tags: [],
};

const renderFilters = (data = DATA, onChange = noop) => renderWithIntl(
  <Router>
    {itemFilterRenderer(data)(onChange)}
  </Router>,
  translationsProperties
);

describe('itemFilterRenderer fn', () => {
  it('displays filter by tags accordion', () => {
    renderFilters();
    expect(screen.getByText('Tags')).toBeDefined();
  });

  it('displays filter by status accordion', () => {
    renderFilters();
    expect(screen.getByText('Item status')).toBeDefined();
  });

  it('displays filter by effectiveLocation accordion', () => {
    renderFilters();
    expect(screen.getByText('Effective location (item)')).toBeDefined();
  });

  it('displays filter by permanentLocation accordion', () => {
    renderFilters();
    expect(screen.getByText('Holdings permanent location')).toBeDefined();
  });

  it('displays filter by materialType accordion', () => {
    renderFilters();
    expect(screen.getByText('Material type')).toBeDefined();
  });

  it('displays filter by discoverySuppress accordion', () => {
    renderFilters();
    expect(screen.getByText('Suppress from discovery')).toBeDefined();
  });
});
