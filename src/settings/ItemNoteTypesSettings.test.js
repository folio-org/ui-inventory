import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import ItemNoteTypesSettings from './ItemNoteTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ItemNoteTypesSettingsSetup = () => (
  <MemoryRouter>
    <ItemNoteTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderItemNoteTypesSettings = () => renderWithIntl(
  <ItemNoteTypesSettingsSetup />,
  translationsProperties
);

describe('ItemNoteTypesSettings', () => {
  it('should render properly', () => {
    renderItemNoteTypesSettings();
    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
