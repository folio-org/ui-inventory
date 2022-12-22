import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import CallNumberTypes from './CallNumberTypes';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const CallNumberTypesSetup = () => (
  <MemoryRouter>
    <CallNumberTypes {...defaultProps} />
  </MemoryRouter>
);

const renderCallNumberTypes = () => renderWithIntl(
  <CallNumberTypesSetup />,
  translationsProperties
);

describe('CallNumberTypes', () => {
  it('should render properly', () => {
    const { getByText } = renderCallNumberTypes();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
