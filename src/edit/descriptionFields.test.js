import PropTypes from 'prop-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import DescriptionFields from './descriptionFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <DescriptionFields />
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

const renderDescriptionFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('DescriptionFields', () => {
  it('renders RepeatableField', () => {
    renderDescriptionFields();
    const repeatableField = screen.getByText('Physical descriptions');
    expect(repeatableField).toBeInTheDocument();
    expect(repeatableField).not.toBeDisabled();
  });
  it('adds new TextField on add button click', () => {
    renderDescriptionFields();
    const addButton = screen.getByText('Add description');
    userEvent.click(addButton);
    const textFields = screen.getAllByText('Physical description');
    expect(textFields).toHaveLength(1);
  });
});
