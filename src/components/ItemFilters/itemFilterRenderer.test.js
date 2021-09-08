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
    expect(screen.getByText('ui-inventory.filter.tags')).toBeInTheDocument();
  });

  it('should display filter by status accordion', () => {
    expect(screen.getByText('ui-inventory.item.status')).toBeInTheDocument();
  });

  it('should display filter by effectiveLocation accordion', () => {
    expect(screen.getByText('ui-inventory.filters.effectiveLocation')).toBeInTheDocument();
  });

  it('should display filter by permanentLocation accordion', () => {
    expect(screen.getByText('ui-inventory.holdings.permanentLocation')).toBeInTheDocument();
  });

  it('should display filter by materialType accordion', () => {
    expect(screen.getByText('ui-inventory.materialType')).toBeInTheDocument();
  });

  it('should display filter by discoverySuppress accordion', () => {
    expect(screen.getByText('ui-inventory.discoverySuppress')).toBeInTheDocument();
  });
});
