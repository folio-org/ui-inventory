import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import InstanceIdentifiersView from './InstanceIdentifiersView';

const props = {
  id: 'InstanceIdentifiersViewID',
  identifiers: [],
  identifierTypes: []
};

const renderInstanceIdentifiersView = () => (
  renderWithIntl(
    <Router>
      <InstanceIdentifiersView {...props} />
    </Router>
  )
);

describe('InstanceIdentifiersView', () => {
  it('Should render and click the button', () => {
    const { getByText, queryAllByText, getByRole } = renderInstanceIdentifiersView();
    const identifierButton = getByRole('button', { name: /ui-inventory.identifiers/i });
    userEvent.click(identifierButton);
    expect(getByText(/ui-inventory.resourceIdentifierType/i)).toBeInTheDocument();
    expect(queryAllByText(/ui-inventory.resourceIdentifier/i)).toBeTruthy();
    expect(queryAllByText(/stripes-components.noValue.noValueSet/i)).toBeTruthy();
    expect(getByText(/stripes-components.endOfList/i)).toBeInTheDocument();
  });
});
