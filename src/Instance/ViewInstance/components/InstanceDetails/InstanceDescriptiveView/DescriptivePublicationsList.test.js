import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import DescriptivePublicationsList from './DescriptivePublicationsList';

const props = {
  publications: [],
};

const renderDescriptivePublicationsList = () => (
  renderWithIntl(
    <Router>
      <DescriptivePublicationsList {...props} />
    </Router>
  )
);

describe('DescriptivePublicationsList', () => {
  it('Should render and display the DOM', () => {
    const { getByText, queryAllByText } = renderDescriptivePublicationsList();
    expect(getByText).toBeDefined();
    expect(queryAllByText('ui-inventory.publisher')).toBeDefined();
    expect(queryAllByText('ui-inventory.publisherRole')).toBeDefined();
    expect(queryAllByText('ui-inventory.placeOfPublication')).toBeDefined();
    expect(queryAllByText('ui-inventory.dateOfPublication')).toBeDefined();
    expect(queryAllByText('stripes-components.noValue.noValueSet')).toBeDefined();
    expect(queryAllByText('stripes-components.endOfList')).toBeDefined();
  });
});
