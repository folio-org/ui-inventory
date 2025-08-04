import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { CheckboxGroup } from './CheckboxGroup';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

const mockFields = {
  value: ['contributors'],
  push: jest.fn(),
  remove: jest.fn(),
};

const options = [{
  value: 'contributors',
  label: 'contributors',
}, {
  value: 'date',
  label: 'date',
}];

const renderCheckboxGroup = (props = {}) => renderWithIntl(
  <CheckboxGroup
    fields={mockFields}
    options={options}
    label="Checkbox group label"
    {...props}
  />
);

describe('CheckboxGroup', () => {
  it('should display the label', () => {
    const { getByText } = renderCheckboxGroup();

    expect(getByText('Checkbox group label')).toBeInTheDocument();
  });

  it('should display all options', () => {
    const { getByRole } = renderCheckboxGroup();

    expect(getByRole('checkbox', { name: 'contributors' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'date' })).toBeInTheDocument();
  });

  describe('when an option is in fields values', () => {
    it('should mark the checkbox', () => {
      const { getByRole } = renderCheckboxGroup();

      expect(getByRole('checkbox', { name: 'contributors' })).toBeChecked();
      expect(getByRole('checkbox', { name: 'date' })).not.toBeChecked();
    });
  });

  describe('when clicking on a checked checkbox', () => {
    it('should call fields.remove', () => {
      const { getByRole } = renderCheckboxGroup();

      fireEvent.click(getByRole('checkbox', { name: 'contributors' }));

      expect(mockFields.remove).toHaveBeenCalledWith(0); // called with index inside fields.value
    });
  });

  describe('when clicking on an unchecked checkbox', () => {
    it('should call fields.push', () => {
      const { getByRole } = renderCheckboxGroup();

      fireEvent.click(getByRole('checkbox', { name: 'date' }));

      expect(mockFields.push).toHaveBeenCalledWith('date');
    });
  });
});
