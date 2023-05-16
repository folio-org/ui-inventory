import React from 'react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import BoundWithTitlesFields from '../BoundWithTitlesFields';
import useBoundWithTitlesByHrids from '../../../../hooks/useBoundWithTitlesByHrids';

import renderWithRouter from '../../../../../test/jest/helpers/renderWithRouter';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import renderWithFinalForm from '../../../../../test/jest/helpers/renderWithFinalForm';
import translationsProperties from '../../../../../test/jest/helpers/translationsProperties';

jest.mock('../../../../hooks/useBoundWithTitlesByHrids', () => {
  return jest.fn(() => ({ isLoading: false, boundWithTitles: [] }));
});
jest.mock('../../BoundWithModal', () => {
  return jest.fn(({ open, onOk, onClose }) => (open ? (
    <div>
      <span>BoundWith Modal</span>
      <button
        type="button"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onOk}
      >
        Save & close
      </button>
    </div>
  ) : null));
});
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading</div>,
}));

const addBoundWithTitlesProp = jest.fn();
const initialValues = {
  boundWithTitles: [
    {
      briefInstance: {
        title: 'instanceTitle',
        hrid: 'instanceHrid'
      },
      briefHoldingsRecord: {
        id: 'holdingsId',
        hrid: 'holdingHrid',
      },
    },
  ],
};

const renderBoundWithTitlesFields = (props = {}) => {
  const component = (
    <BoundWithTitlesFields
      item={{}}
      addBoundWithTitles={addBoundWithTitlesProp}
      {...props}
    />
  );

  return renderWithIntl(
    renderWithRouter(renderWithFinalForm(component, { initialValues })),
    translationsProperties,
  );
};

describe('BoundWithTitlesFields', () => {
  it('should render a legend', () => {
    const { getByText } = renderBoundWithTitlesFields();

    expect(getByText('Bound-with and analytics')).toBeInTheDocument();
  });

  it('should render Add Bound-with and analytics button', () => {
    const { getByText } = renderBoundWithTitlesFields();

    expect(getByText('Add Bound-with and analytics')).toBeInTheDocument();
  });

  describe('when there is data', () => {
    it('should render correct fields', () => {
      const { getByLabelText } = renderBoundWithTitlesFields();

      expect(getByLabelText('Instance HRID')).toBeInTheDocument();
      expect(getByLabelText('Instance title')).toBeInTheDocument();
      expect(getByLabelText('Holdings HRID')).toBeInTheDocument();
    });

    it('all fields should be disabled', () => {
      const { getByLabelText } = renderBoundWithTitlesFields();

      expect(getByLabelText('Instance HRID')).toBeDisabled();
      expect(getByLabelText('Instance title')).toBeDisabled();
      expect(getByLabelText('Holdings HRID')).toBeDisabled();
    });
  });

  describe('when clicking Add Bound-with and analytics button', () => {
    it('BoundWith Modal should appear', async () => {
      const { getByText } = renderBoundWithTitlesFields();
      const addButton = getByText('Add Bound-with and analytics');
      userEvent.click(addButton);

      await waitFor(() => expect(getByText('BoundWith Modal')).toBeInTheDocument());
    });

    describe('when clicking Cancel button', () => {
      it('BoundWith Modal should disappear', async () => {
        const { queryByText, getByRole, getByText } = renderBoundWithTitlesFields();
        const addButton = getByText('Add Bound-with and analytics');
        userEvent.click(addButton);
        userEvent.click(getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(queryByText('BoundWith Modal')).not.toBeInTheDocument());
      });
    });

    describe('when clicking Save & close button', () => {
      it('BoundWith Modal should disappear', async () => {
        const { queryByText, getByRole, getByText } = renderBoundWithTitlesFields();
        const addButton = getByText('Add Bound-with and analytics');
        userEvent.click(addButton);
        userEvent.click(getByRole('button', { name: 'Save & close' }));

        await waitFor(() => expect(queryByText('BoundWith Modal')).not.toBeInTheDocument());
      });

      it('and new bound with titles info should be fetched', async () => {
        const { getByRole, getByText } = renderBoundWithTitlesFields();
        const addButton = getByText('Add Bound-with and analytics');
        userEvent.click(addButton);
        userEvent.click(getByRole('button', { name: 'Save & close' }));

        expect(useBoundWithTitlesByHrids).toHaveBeenCalled();
      });
    });
  });

  describe("when item's holdingsRecordId is equal to added briefHoldingsRecord id", () => {
    it('trash icon for this field should be disabled', () => {
      const { getByRole } = renderBoundWithTitlesFields({ item: { holdingsRecordId: 'holdingsId' } });

      const deleteButton = getByRole('button', { name: /delete this item/i });

      expect(deleteButton).toBeDisabled();
    });
  });

  describe("when item's holdingsRecordId is not equal to added briefHoldingsRecord id", () => {
    it('trash icon for this field should be active', () => {
      const { getByRole } = renderBoundWithTitlesFields({ item: { holdingsRecordId: 'holdingsId1' } });

      const deleteButton = getByRole('button', { name: /delete this item/i });

      expect(deleteButton).not.toBeDisabled();
    });
  });

  describe('when clicking trash icon', () => {
    it('should remove repeatable field', () => {
      const { queryByLabelText, getByRole } = renderBoundWithTitlesFields();

      const deleteButton = getByRole('button', { name: /delete this item/i });

      userEvent.click(deleteButton);

      expect(queryByLabelText('Instance HRID')).not.toBeInTheDocument();
      expect(queryByLabelText('Instance title')).not.toBeInTheDocument();
      expect(queryByLabelText('Holdings HRID')).not.toBeInTheDocument();
    });
  });
});
