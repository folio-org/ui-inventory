import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import HoldingAccordionLabel from './HoldingAccordionLabel';

const renderHoldingAccordionLabel = () => {
  const component = (
    <HoldingAccordionLabel
      location="library location"
      holding={{
        callNumberPrefix: 'callNumberPrefix',
        callNumber: 'callNumber',
        callNumberSuffix: 'callNumberSuffix',
        copyNumber: 'copyNumber'
      }}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('HoldingAccordionLabel', () => {
  it('should display correct holdings label', () => {
    renderHoldingAccordionLabel();

    expect(screen.getByText(/holdings: library location > callNumberPrefix callNumber callNumberSuffix copyNumber/i)).toBeInTheDocument();
  });
});
