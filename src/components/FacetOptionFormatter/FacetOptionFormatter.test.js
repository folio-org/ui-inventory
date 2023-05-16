import '../../../test/jest/__mock__';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import FacetOptionFormatter from './FacetOptionFormatter';

import Harness from '../../../test/jest/helpers/Harness';

const option = {
  label: 'Option label',
  totalRecords: 1000,
};

const renderFacetOptionFormatter = (props = {}) => render(
  <Harness translations={[]}>
    <FacetOptionFormatter option={option} {...props} />
  </Harness>,
);

describe('Given FacetOptionFormatter', () => {
  it('should render option label', () => {
    const { getByText } = renderFacetOptionFormatter();

    expect(getByText('Option label')).toBeDefined();
  });

  it('should render option facet count', () => {
    const { getByText } = renderFacetOptionFormatter();

    expect(getByText('(1000)')).toBeDefined();
  });
});
