import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import IdentifierTypesSettings from './IdentifierTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const IdentifierTypesSettingsSetup = () => (
  <MemoryRouter>
    <IdentifierTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderIdentifierTypesSettings = () => renderWithIntl(
  <IdentifierTypesSettingsSetup />,
  translationsProperties
);

describe('IdentifierTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderIdentifierTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
