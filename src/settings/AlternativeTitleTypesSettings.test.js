import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import AlternativeTitleTypesSettings from './AlternativeTitleTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const AlternativeTitleTypesSettingsSetup = () => (
  <MemoryRouter>
    <AlternativeTitleTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderAlternativeTitleTypesSettings = () => renderWithIntl(
  <AlternativeTitleTypesSettingsSetup />,
  translationsProperties
);

describe('AlternativeTitleTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderAlternativeTitleTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
