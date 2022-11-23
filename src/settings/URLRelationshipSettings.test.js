import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import URLRelationshipSettings from './URLRelationshipSettings';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const URLRelationshipSettingsSetup = () => (
  <MemoryRouter>
    <URLRelationshipSettings {...defaultProps} />
  </MemoryRouter>
);

const renderURLRelationshipSettings = () => renderWithIntl(
  <URLRelationshipSettingsSetup />,
  translationsProperties
);

describe('URLRelationshipSettings', () => {
  it('should render properly', () => {
    const { getByText } = renderURLRelationshipSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
