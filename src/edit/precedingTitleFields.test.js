import PropTypes from 'prop-types';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';
import stripesFinalForm from '@folio/stripes/final-form';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../test/jest/helpers/translationsProperties';
import PrecedingTitles from './precedingTitleFields';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const Form = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <PrecedingTitles />
  </form>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const renderPrecedingTitles = () => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} />),
  translationsProperties,
);

const WrappedForm = stripesFinalForm({
  canAdd: true,
  canEdit: true,
  canDelete: true,
  isDisabled: false,
})(Form);

afterEach(() => jest.clearAllMocks());

describe('precedingTitleFields', () => {
  it('renders RepeatableField', () => {
    renderPrecedingTitles();
    expect(screen.getByText(/Preceding titles/i)).toBeInTheDocument();
    expect(screen.getByText(/Add preceding title/i)).toBeInTheDocument();
  });
  it('click Add preceding title button', () => {
    renderPrecedingTitles();
    fireEvent.click(screen.getByText(/Add preceding title/i));
    expect(screen.getAllByText(/Instance HRID/i).length).toBe(1);
  });
});
