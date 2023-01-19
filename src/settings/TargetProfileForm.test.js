import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import '../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../test/jest/helpers';

import TargetProfileForm from './TargetProfileForm';

const onSubmitMock = jest.fn();
const defaultInitialValues = { targetOptions: { key: 'testKey' } };
const defaultProps = {
  onSubmit: onSubmitMock,
  onCancel: jest.mock(),
  resources: {
    jobProfiles: {
      records: [{
        name: 'test name',
        id: 'test id',
      }]
    },
    identifierTypes: {
      records: [{
        name: 'test identifier',
        id: 'test id id',
      }]
    }
  },
};

const TargetProfileFormSetup = ({ initialValues }) => (
  <MemoryRouter>
    <TargetProfileForm
      initialValues={initialValues}
      {...defaultProps}
    />
  </MemoryRouter>
);


const renderTargetProfileForm = (initialValues = defaultInitialValues) => renderWithIntl(
  <TargetProfileFormSetup initialValues={initialValues} />,
  translationsProperties
);

describe('TargetProfileForm', () => {
  beforeEach(() => {
    onSubmitMock.mockClear();
  });

  describe('when create new record', () => {
    it('should be rendered with "New" title', () => {
      const { getByText } = renderTargetProfileForm();

      expect(getByText('New')).toBeInTheDocument();
    });
  });

  describe('when edit an existing record', () => {
    it('title should be rendered with profile name', () => {
      const initialValue = {
        id: 'testId',
        name: 'testName',
      };
      const { getByText } = renderTargetProfileForm(initialValue);

      expect(getByText('testName')).toBeInTheDocument();
    });
  });

  describe('when click "Save & close" button', () => {
    it('onSubmit function should be called', () => {
      const {
        container,
        getByText,
      } = renderTargetProfileForm();
      const nameInput = container.querySelector('#input-targetprofile-name');
      fireEvent.change(nameInput, { target: { value: 'test name' } });

      const submit = getByText('Save & close');
      fireEvent.click(submit);

      expect(onSubmitMock.mock.calls.length).toEqual(1);
    });
  });

  describe('when click "Add job profile for import/create"', () => {
    it('new fields should be shown', () => {
      const {
        container,
        getByText,
      } = renderTargetProfileForm();
      const addButton = getByText('Add job profile for import/create');
      fireEvent.click(addButton);

      const jobProfileSelect = container.querySelector(('[name="allowedCreateJobProfileIds[0]"]'));
      const defaultRadioButton = container.querySelector(('[name="createJobProfileId"]'));
      const trashIcon = container.querySelector('[aria-label="Delete this item"]');

      expect(jobProfileSelect).toBeInTheDocument();
      expect(defaultRadioButton).toBeInTheDocument();
      expect(trashIcon).toBeInTheDocument();
    });

    it('should render info popover next to the label', async () => {
      const { getAllByRole, getByText } = renderTargetProfileForm();

      const infoButton = getAllByRole('button', { name: /info/i });

      fireEvent.click(infoButton[0]);

      await waitFor(() => expect(getByText('Review the listed job profiles carefully before assigning for ' +
        'Inventory single record imports. Only MARC Bibliographic job profiles can be assigned, not MARC Holdings or ' +
        'MARC Authority job profiles.')).toBeInTheDocument());
    });
  });

  describe('when click "Add job profile for overlay/update"', () => {
    it('new fields should be shown', () => {
      const {
        container,
        getByText,
      } = renderTargetProfileForm();
      const addButton = getByText('Add job profile for overlay/update');
      fireEvent.click(addButton);

      const jobProfileSelect = container.querySelector(('[name="allowedUpdateJobProfileIds[0]"]'));
      const defaultRadioButton = container.querySelector(('[name="updateJobProfileId"]'));
      const trashIcon = container.querySelector('[aria-label="Delete this item"]');

      expect(jobProfileSelect).toBeInTheDocument();
      expect(defaultRadioButton).toBeInTheDocument();
      expect(trashIcon).toBeInTheDocument();
    });

    it('should render info popover next to the label', async () => {
      const { getAllByRole, getByText } = renderTargetProfileForm();

      const infoButton = getAllByRole('button', { name: /info/i });

      fireEvent.click(infoButton[1]);

      await waitFor(() => expect(getByText('Review the listed job profiles carefully before assigning for ' +
        'Inventory single record imports. Only MARC Bibliographic job profiles can be assigned, not MARC Holdings or ' +
        'MARC Authority job profiles.')).toBeInTheDocument());
    });
  });

  describe('when click "Add target option"', () => {
    it('new fields should be shown', () => {
      const {
        container,
        getByText,
      } = renderTargetProfileForm();
      const addButton = getByText('Add target option');
      fireEvent.click(addButton);

      const targetKeyInput = container.querySelector(('[name="targetOptions[0].key"]'));
      const targetValueInput = container.querySelector(('[name="targetOptions[0].value"]'));
      const trashIcon = container.querySelector('[aria-label="Delete this item"]');

      expect(targetKeyInput).toBeInTheDocument();
      expect(targetValueInput).toBeInTheDocument();
      expect(trashIcon).toBeInTheDocument();
    });
  });
});
