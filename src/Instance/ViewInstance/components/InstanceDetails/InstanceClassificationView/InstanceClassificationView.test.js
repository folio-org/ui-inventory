import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceClassificationView from './InstanceClassificationView';

const props = {
  id: 'classificationID',
  classifications: [{
    classificationTypeId: 'type-id',
    classificationNumber: 'classification-number',
  }],
  classificationTypes: [{
    id: 'type-id',
  }],
};

const renderInstanceClassificationView = () => (
  renderWithIntl(
    <Router>
      <InstanceClassificationView {...props} />
    </Router>
  )
);

describe('InstanceClassificationView', () => {
  it('Should render and click the button', () => {
    const { getByText, queryAllByText, getByRole } = renderInstanceClassificationView();
    const classificationButton = getByRole('button', { name: /ui-inventory.classification/i });
    userEvent.click(classificationButton);
    expect(getByText).toBeDefined();
    expect(queryAllByText('ui-inventory.classificationIdentifierType')).toBeDefined();
    expect(queryAllByText('ui-inventory.classification')).toBeDefined();
    expect(queryAllByText('stripes-components.noValue.noValueSet')).toBeDefined();
    expect(queryAllByText('stripes-components.endOfList')).toBeDefined();
  });

  it('should render copy to clipboard icon', () => {
    const { getByText } = renderInstanceClassificationView();

    expect(getByText('ClipCopy')).toBeInTheDocument();
  });
});
