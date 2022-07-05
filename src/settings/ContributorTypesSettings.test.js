import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub, 
  translationsProperties
} from '../../test/jest/helpers';

import ContributorTypesSettings from './ContributorTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ContributorTypesSettingsSetup = () => (
  <MemoryRouter>
    <ContributorTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderContributorTypesSettings = () => renderWithIntl(
  <ContributorTypesSettingsSetup />,
  translationsProperties
);

describe('ContributorTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderContributorTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
