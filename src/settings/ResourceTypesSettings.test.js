import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import ResourceTypesSettings from './ResourceTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ResourceTypesSettingsSetup = () => (
  <MemoryRouter>
    <ResourceTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderResourceTypesSettings = () => renderWithIntl(
  <ResourceTypesSettingsSetup />,
  translationsProperties
);

describe('ResourceTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderResourceTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
