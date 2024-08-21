import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties,
} from '../../test/jest/helpers';

import SubjectSourcesSettings from './SubjectSourcesSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const SubjectSourcesSettingsSetup = () => (
  <MemoryRouter>
    <SubjectSourcesSettings {...defaultProps} />
  </MemoryRouter>
);

const renderSubjectSourcesSettings = () => renderWithIntl(
  <SubjectSourcesSettingsSetup />,
  translationsProperties,
);

describe('SubjectSourcesSettings', () => {
  it('should render properly', () => {
    renderSubjectSourcesSettings();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
