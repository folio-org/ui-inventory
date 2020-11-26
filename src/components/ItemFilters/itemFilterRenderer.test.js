import { render, screen } from '@testing-library/react';
import { noop } from 'lodash';

// import '@folio/stripes-acq-components/test/jest/__mock__';

import itemFilterRenderer from './itemFilterRenderer';

const DATA = {
  materialTypes: [],
  locations: [],
  tags: [],
};

const renderFilters = (data = DATA, onChange = noop) => (render(
  itemFilterRenderer(data)(onChange)
));

xdescribe('itemFilterRenderer fn', () => {
  it('displays filter by tags accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.filter.tags')).toBeDefined();
  });

  it('displays filter by status accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.item.status')).toBeDefined();
  });

  it('displays filter by effectiveLocation accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.filters.effectiveLocation')).toBeDefined();
  });

  it('displays filter by permanentLocation accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.holdings.permanentLocation')).toBeDefined();
  });

  it('displays filter by materialType accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.materialType')).toBeDefined();
  });

  it('displays filter by discoverySuppress accordion', () => {
    renderFilters();
    expect(screen.getByText('ui-inventory.discoverySuppress')).toBeDefined();
  });
});
