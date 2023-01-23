import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import '../../test/jest/__mock__';

import { renderWithIntl, stripesStub, translationsProperties } from '../../test/jest/helpers';

import StatisticalCodeSettings from './StatisticalCodeSettings';

jest.unmock('@folio/stripes/components');

jest.mock('./validateNameAndCode', () => jest.fn());

const props = {
  stripes: {
    ...stripesStub,
    connect: component => component,
  },
  resources: {
    statisticalCodeTypes: {
      records: [
        { id: 'statisticalCodeType1', name: 'Statistical Code Type 1' },
        { id: 'statisticalCodeType2', name: 'Statistical Code Type 2' },
      ],
    },
  },
};

const StatisticalCodeSettingsSetup = () => (
  <MemoryRouter>
    <StatisticalCodeSettings {...props} />
  </MemoryRouter>
);

const renderStatisticalCodeSettings = () => renderWithIntl(
  <StatisticalCodeSettingsSetup />,
  translationsProperties
);

describe('StatisticalCodeSettings', () => {
  it('render', () => {
    renderStatisticalCodeSettings();
    screen.debug();
  });
  it('should render properly', () => {
    const { getByText } = renderStatisticalCodeSettings();
    expect(getByText('ControlledVocab')).toBeInTheDocument();
  });
  it('should have a defined and frozen manifest', () => {
    expect(StatisticalCodeSettings.manifest).toBeDefined();
    expect(Object.isFrozen(StatisticalCodeSettings.manifest)).toBe(true);
  });
});
