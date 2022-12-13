import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import InstanceNoteTypesSettings from './InstanceNoteTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const InstanceNoteTypesSettingsSetup = () => (
  <MemoryRouter>
    <InstanceNoteTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderInstanceNoteTypesSettings = () => renderWithIntl(
  <InstanceNoteTypesSettingsSetup />,
  translationsProperties
);

describe('InstanceNoteTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderInstanceNoteTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
