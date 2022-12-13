import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import ClassificationTypesSettings from './ClassificationTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ClassificationTypesSettingsSetup = () => (
  <MemoryRouter>
    <ClassificationTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderClassificationTypesSettings = () => renderWithIntl(
  <ClassificationTypesSettingsSetup />,
  translationsProperties
);

describe('ClassificationTypesSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderClassificationTypesSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
