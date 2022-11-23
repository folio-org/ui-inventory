import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import NatureOfContentTermsSettings from './NatureOfContentTermsSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const NatureOfContentTermsSettingsSetup = () => (
  <MemoryRouter>
    <NatureOfContentTermsSettings {...defaultProps} />
  </MemoryRouter>
);

const renderNatureOfContentTermsSettings = () => renderWithIntl(
  <NatureOfContentTermsSettingsSetup />,
  translationsProperties
);

describe('NatureOfContentTermsSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderNatureOfContentTermsSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
