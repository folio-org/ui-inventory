import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceIdentifiersView from './InstanceIdentifiersView';

const emptyProps = {
  id: 'InstanceIdentifiersViewID',
  identifiers: [],
  identifierTypes: [],
};

const nonEmptyProps = {
  id: 'InstanceIdentifiersViewID',
  identifiers: [
    { identifierTypeId: '1', value: 'test-identifier-1' },
  ],
  identifierTypes: [
    { id: '1', name: 'test-type-1' },
  ],
};

const renderInstanceIdentifiersView = (props) => (
  renderWithIntl(
    <Router>
      <InstanceIdentifiersView {...props} />
    </Router>
  )
);

describe('InstanceIdentifiersView', () => {
  it('Should render and click the button', () => {
    const { getByText, queryAllByText, getByRole } = renderInstanceIdentifiersView(emptyProps);
    const identifierButton = getByRole('button', { name: /ui-inventory.identifiers/i });
    userEvent.click(identifierButton);
    expect(getByText(/ui-inventory.resourceIdentifierType/i)).toBeInTheDocument();
    expect(queryAllByText(/ui-inventory.resourceIdentifier/i)).toBeTruthy();
    expect(queryAllByText(/stripes-components.noValue.noValueSet/i)).toBeTruthy();
    expect(getByText(/stripes-components.endOfList/i)).toBeInTheDocument();
  });
  it('Should render with nonEmptyProps', () => {
    const { getByText } = renderInstanceIdentifiersView(nonEmptyProps);
    expect(getByText(/test-type-1/i)).toBeInTheDocument();
    expect(getByText(/test-identifier-1/i)).toBeInTheDocument();
  });
});
