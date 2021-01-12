import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
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

const renderFilters = (data = DATA, onChange = noop) => (renderWithIntl(
  <Router>{itemFilterRenderer(data)(onChange)}</Router>,
  translationsProperties
));

describe('itemFilterRenderer fn', () => {
  beforeEach(() => renderFilters());

  it('should display filter by tags accordion', () => {
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should display filter by status accordion', () => {
    expect(screen.getByText('Item status')).toBeInTheDocument();
  });

  it('should display filter by effectiveLocation accordion', () => {
    expect(screen.getByText('Effective location (item)')).toBeInTheDocument();
  });

  it('should display filter by permanentLocation accordion', () => {
    expect(screen.getByText('Holdings permanent location')).toBeInTheDocument();
  });

  it('should display filter by materialType accordion', () => {
    expect(screen.getByText('Material type')).toBeInTheDocument();
  });

  it('should display filter by discoverySuppress accordion', () => {
    expect(screen.getByText('Suppress from discovery')).toBeInTheDocument();
  });
});
