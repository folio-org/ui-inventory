import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../../test/jest/__mock__';

import LinkedInstanceDetails from './LinkedInstanceDetails';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

const itemMock = {
  boundWithTitles: new Array(2),
  isBoundWith: true,
};
const instanceMock = {
  id: 'instanceId',
  title: 'instanceTitle',
  publication: [{
    publisher: 'instancePublisher',
    dateOfPublication: '2023-12-12'
  }],
};

const renderLinkedInstanceDetails = () => {
  const component = (
    <Router>
      <LinkedInstanceDetails
        item={itemMock}
        instance={instanceMock}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LinkedInstanceDetails', () => {
  it('should display linked indtance details', () => {
    const { getByText } = renderLinkedInstanceDetails();

    expect(getByText(/instance: \./i)).toBeInTheDocument();
  });

  it('should display instance title as a link', () => {
    const { getByRole } = renderLinkedInstanceDetails();

    expect(getByRole('link', { name: /Linked instance ID - instanceId/i })).toBeInTheDocument();
  });

  it('should display publisher information', () => {
    const { getByText } = renderLinkedInstanceDetails();

    expect(getByText(/instancepublisher/i)).toBeInTheDocument();
    expect(getByText(/, 2023-12-12/i)).toBeInTheDocument();
  });

  it('should display "and other titles" is there are bound-with titles', () => {
    const { getByText } = renderLinkedInstanceDetails();

    expect(getByText(/and other titles/i)).toBeInTheDocument();
  });
});
