import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import ContributorFields from './contributorFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  contributorNameTypes: [
    { id: '1', name: 'Personal' },
    { id: '2', name: 'Corporate' }
  ],
  contributorTypes: [
    { id: '1', name: 'Author' },
    { id: '2', name: 'Editor' }
  ],
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <ContributorFields {...props} />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const WrappedForm = stripesFinalForm({
  canAdd: true,
  canEdit: true,
  canDelete: true,
})(Form);

const renderContributorFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('ContributorFields', () => {
  it('renders all fields correctly', () => {
    renderContributorFields();
    expect(screen.getByText(/Contributors/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Add contributor/i));
    const option = screen.getAllByText('Select type');
    expect(option).toHaveLength(2);
  });
});
