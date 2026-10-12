import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceNewHolding from './InstanceNewHolding';

const mockPush = jest.fn();

const history = createMemoryHistory();
history.push = mockPush;

jest.mock('../../../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  switchAffiliation: jest.fn(() => mockPush()),
}));

const props = {
  location: {},
  instance: {},
  isVisible: true,
};

const renderInstanceNewHolding = () => (
  renderWithIntl(
    <Router history={history}>
      <InstanceNewHolding {...props} />
    </Router>
  )
);

describe('InstanceNewHolding', () => {
  it('Should render InstanceNewHolding', () => {
    const { getByText } = renderInstanceNewHolding();
    expect(getByText(/ui-inventory.addHoldings/i)).toBeInTheDocument();
  });

  describe('when click "Add holdings" button', () => {
    it('should redirect to the Holdings form', () => {
      const { getByText } = renderInstanceNewHolding();
      fireEvent.click(getByText(/ui-inventory.addHoldings/i));

      expect(mockPush).toHaveBeenCalled();
    });
  });
});
