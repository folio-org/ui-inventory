import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import LoanTypesSettings from './LoanTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const LoanTypesSettingsSetup = () => (
  <MemoryRouter>
    <LoanTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderLoanTypesSettings = () => renderWithIntl(
  <LoanTypesSettingsSetup />,
  translationsProperties
);


describe('LoanTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderLoanTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
