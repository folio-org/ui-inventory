import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import InstanceStatusTypesSettings from './InstanceStatusTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const InstanceStatusTypesSettingsSetup = () => (
  <MemoryRouter>
    <InstanceStatusTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderInstanceStatusTypesSettings = () => renderWithIntl(
  <InstanceStatusTypesSettingsSetup />,
  translationsProperties
);

describe('InstanceStatusTypesSettingsSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderInstanceStatusTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
