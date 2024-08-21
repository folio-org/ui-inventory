import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties,
} from '../../test/jest/helpers';

import SubjectTypesSettings from './SubjectTypesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const SubjectTypesSettingsSetup = () => (
  <MemoryRouter>
    <SubjectTypesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderSubjectTypesSettings = () => renderWithIntl(
  <SubjectTypesSettingsSetup />,
  translationsProperties,
);

describe('SubjectTypesSettings', () => {
  it('should render properly', () => {
    renderSubjectTypesSettings();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
