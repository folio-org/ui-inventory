import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import InstanceNewHolding from './InstanceNewHolding';

const props = {
  location: {},
  instance: {},
};

const renderInstanceNewHolding = () => (
  renderWithIntl(
    <Router>
      <InstanceNewHolding {...props} />
    </Router>
  )
);

describe('InstanceNewHolding', () => {
  it('Should render and click the button', () => {
    const { getByText, getByRole } = renderInstanceNewHolding();
    expect(getByText).toBeDefined();
    const HoldingLink = getByRole('button', { name: 'ui-inventory.addHoldings' });
    userEvent.click(HoldingLink);
    expect(HoldingLink).toBeDefined();
  });
});
