import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import EditionFields from './editionFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <EditionFields />
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

const renderEditionFields = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

afterEach(() => jest.clearAllMocks());

describe('EditionFields', () => {
  it('renders EditionFields', () => {
    renderEditionFields();
    expect(screen.getByText(/Editions/i)).toBeInTheDocument();
    const editButton = screen.getByText(/Add edition/i);
    fireEvent.click(editButton);
    const textFields = screen.getAllByText('Edition');
    expect(textFields).toHaveLength(1);
  });
});
