import React from 'react';

import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties
} from '../../../test/jest/helpers';

import NumberGeneratorOptions from './NumberGeneratorOptions';

jest.unmock('@folio/stripes/components');

const renderNumberGeneratorSettings = (props) => renderWithIntl(<NumberGeneratorOptions {...props} />, translationsProperties);

describe('Number generator settings', () => {
  it('renders', () => {
    renderNumberGeneratorSettings();

    expect(screen.getByTestId('config-manager')).toBeTruthy();
  });
});
