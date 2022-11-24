import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import HoldingsSourcesSettings from './HoldingsSourcesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const HoldingsSourcesSettingsSetup = () => (
  <MemoryRouter>
    <HoldingsSourcesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderHoldingsSourcesSettings = () => renderWithIntl(
  <HoldingsSourcesSettingsSetup />,
  translationsProperties
);

describe('HoldingsSourcesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderHoldingsSourcesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
