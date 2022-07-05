import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub, 
  translationsProperties
} from '../../test/jest/helpers';

import ContributorTypesSettings from './ContributorTypesSettings';

const ContributorTypesSettingsSetup = () => (
  <MemoryRouter>
    <ContributorTypesSettings stripes={stripesStub} />
  </MemoryRouter>
);

const renderContributorTypesSettings = () => renderWithIntl(
  <ContributorTypesSettingsSetup />,
  translationsProperties
);

describe('ContributorTypesSettings', () => {
  it('should render properly', () => {
    renderContributorTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
