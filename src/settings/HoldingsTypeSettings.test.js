import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import HoldingsTypeSettings from './HoldingsTypeSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};


const HoldingsTypeSettingsSetup = () => (
  <MemoryRouter>
    <HoldingsTypeSettings {...defaultProps} />
  </MemoryRouter>
);


const renderHoldingsTypeSettings = () => renderWithIntl(
  <HoldingsTypeSettingsSetup />,
  translationsProperties
);

describe('HoldingsTypeSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderHoldingsTypeSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
