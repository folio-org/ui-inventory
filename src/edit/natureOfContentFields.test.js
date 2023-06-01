import PropTypes from 'prop-types';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import NatureOfContentFields from './natureOfContentFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const props = {
  natureOfContentTerms: [{ name: 'natureOfContentName', id: '196169' }]
};

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <NatureOfContentFields {...props} />
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

const renderNatureOfContentField = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('NatureOfContentField', () => {
  it('renders RepeatableField', () => {
    renderNatureOfContentField();
    expect(screen.getByText('Nature of content')).toBeInTheDocument();
  });
  it('click on Add nature of content button and check dropdown length', () => {
    renderNatureOfContentField();
    const natureContentButton = screen.getByText('Add nature of content');
    userEvent.click(natureContentButton);
    const natureContentDropdown = screen.getAllByRole('option');

    // where 1 of options is a default option
    expect(natureContentDropdown).toHaveLength(2);
  });
});
