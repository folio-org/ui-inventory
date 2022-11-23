import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import StatisticalCodeTypes from './StatisticalCodeTypes';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const StatisticalCodeTypesSetup = () => (
  <MemoryRouter>
    <StatisticalCodeTypes {...defaultProps} />
  </MemoryRouter>
);

const renderStatisticalCodeTypes = () => renderWithIntl(
  <StatisticalCodeTypesSetup />,
  translationsProperties
);

describe('StatisticalCodeTypes', () => {
  it('should render properly', () => {
    const { getByText } = renderStatisticalCodeTypes();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
