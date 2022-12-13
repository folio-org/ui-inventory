import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  stripesStub,
  translationsProperties
} from '../../test/jest/helpers';

import ILLPolicy from './ILLPolicy';

const defaultProps = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
};

const ILLPolicySetup = () => (
  <MemoryRouter>
    <ILLPolicy {...defaultProps} />
  </MemoryRouter>
);

const renderILLPolicy = () => renderWithIntl(
  <ILLPolicySetup />,
  translationsProperties
);

describe('ILLPolicy', () => {
  it('should render properly', () => {
    const { getByText } = renderILLPolicy();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
});
