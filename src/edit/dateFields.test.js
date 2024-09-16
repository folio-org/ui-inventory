import PropTypes from 'prop-types';

import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import renderWithRouter from '../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';

import DateFields from './dateFields';
import translationsProperties from '../../test/jest/helpers/translationsProperties';

jest.unmock('@folio/stripes/components');

const onSubmit = jest.fn();

const instanceDateTypeOptions = [{
  label: 'type 1',
  value: 'type-1',
}];

const Form = ({ handleSubmit, ...props }) => (
  <form onSubmit={handleSubmit}>
    <DateFields
      instanceDateTypeOptions={instanceDateTypeOptions}
      {...props}
    />
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

const renderDateFields = (props = {}) => renderWithIntl(
  renderWithRouter(<WrappedForm onSubmit={onSubmit} {...props} />),
  translationsProperties,
);

describe('DateFields', () => {
  describe('when initial date type is not present', () => {
    it('should add an option to unselect date type', () => {
      renderDateFields();

      expect(screen.getByRole('option', { name: 'Select date type' })).toBeInTheDocument();
    });
  });

  describe('when initial date type is present', () => {
    it('should disable the option to unselect date type', () => {
      renderDateFields({
        initialDateTypeId: 'type-2',
      });

      expect(screen.getByRole('option', { name: 'Select date type' })).toBeDisabled();
    });
  });
});
