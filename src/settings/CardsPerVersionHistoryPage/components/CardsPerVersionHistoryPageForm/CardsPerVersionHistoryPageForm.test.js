import { MemoryRouter } from 'react-router-dom';

import {
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import CardsPerVersionHistoryPageForm from './CardsPerVersionHistoryPageForm';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const initialValues = {
  cardsPerPage: 25,
};

const labels = {
  cardsPerPageSelect: 'Cards to display per page on Version history',
  saveButton: 'Save',
};

describe('CardsPerVersionHistoryPageForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCardsPerVersionHistoryPageForm = (props = {}) => (renderWithIntl(
    <MemoryRouter>
      <CardsPerVersionHistoryPageForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
        {...props}
      />
    </MemoryRouter>,
    translationsProperties
  ));

  describe('when the form is pristine', () => {
    beforeEach(() => {
      renderCardsPerVersionHistoryPageForm();
    });

    it('should display initial value', () => {
      expect(screen.getByLabelText(labels.cardsPerPageSelect)).toHaveValue('25');
    });

    it('should disable the save button', () => {
      expect(screen.getByRole('button', { name: labels.saveButton })).toBeDisabled();
    });
  });

  describe('when the form is not pristine', () => {
    beforeEach(() => {
      renderCardsPerVersionHistoryPageForm();

      fireEvent.change(screen.getByLabelText(labels.cardsPerPageSelect), { target: { value: 50 } });
    });

    it('should display a new value', () => {
      expect(screen.getByLabelText(labels.cardsPerPageSelect)).toHaveValue('50');
    });

    it('should enable the save button', () => {
      expect(screen.getByRole('button', { name: labels.saveButton })).toBeEnabled();
    });

    describe('when clicking on save', () => {
      it('should call onSubmit', () => {
        fireEvent.click(screen.getByRole('button', { name: labels.saveButton }));

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({
          cardsPerPage: '50',
        }));
      });
    });
  });
});
