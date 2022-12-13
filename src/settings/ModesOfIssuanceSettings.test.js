import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import ModesOfIssuanceSettings from './ModesOfIssuanceSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ModesOfIssuanceSettingsSetup = () => (
  <MemoryRouter>
    <ModesOfIssuanceSettings {...defaultProps} />
  </MemoryRouter>
);

const renderModesOfIssuanceSettings = () => renderWithIntl(
  <ModesOfIssuanceSettingsSetup />,
  translationsProperties
);

describe('ModesOfIssuanceSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderModesOfIssuanceSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
