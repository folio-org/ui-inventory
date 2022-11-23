import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import MaterialTypesSettings from './MaterialTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const MaterialTypesSettingsSetup = () => (
  <MemoryRouter>
    <MaterialTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderMaterialTypesSettings = () => renderWithIntl(
  <MaterialTypesSettingsSetup />,
  translationsProperties
);

describe('MaterialTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderMaterialTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
