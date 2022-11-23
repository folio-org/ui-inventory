import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import HoldingsNoteTypesSettings from './HoldingsNoteTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const HoldingsNoteTypesSettingsSetup = () => (
  <MemoryRouter>
    <HoldingsNoteTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderHoldingsNoteTypesSettings = () => renderWithIntl(
  <HoldingsNoteTypesSettingsSetup />,
  translationsProperties
);

describe('HoldingsNoteTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderHoldingsNoteTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
