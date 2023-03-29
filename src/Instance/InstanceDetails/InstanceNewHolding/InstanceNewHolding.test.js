import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

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
  it('Should render InstanceNewHolding', () => {
    const { getByText } = renderInstanceNewHolding();
    expect(getByText(/ui-inventory.addHoldings/i)).toBeInTheDocument();
  });
});
