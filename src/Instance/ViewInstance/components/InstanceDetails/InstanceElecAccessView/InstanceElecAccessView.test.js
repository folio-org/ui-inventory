import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceElecAccessView from './InstanceElecAccessView';

const props = {
  id: 'InstanceElecAccessViewID',
  electronicAccessLines: [],
  electronicAccessRelationships: [],
};

const renderInstanceElecAccessView = () => (
  renderWithIntl(
    <Router>
      <InstanceElecAccessView {...props} />
    </Router>
  )
);

describe('InstanceElecAccessView', () => {
  it('Should render and click the button', () => {
    const { getByText, queryAllByText, getByRole } = renderInstanceElecAccessView();
    const AccessButton = getByRole('button', { name: /ui-inventory.electronicAccess/i });
    userEvent.click(AccessButton);
    expect(getByText).toBeDefined();
    expect(queryAllByText('ui-inventory.URLrelationship')).toBeDefined();
    expect(queryAllByText('ui-inventory.uri')).toBeDefined();
    expect(queryAllByText('ui-inventory.linkText')).toBeDefined();
    expect(queryAllByText('ui-inventory.materialsSpecification')).toBeDefined();
    expect(queryAllByText('ui-inventory.urlPublicNote')).toBeDefined();
    expect(queryAllByText('stripes-components.noValue.noValueSet')).toBeDefined();
  });
});
