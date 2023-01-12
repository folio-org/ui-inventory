import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import {
  fireEvent,
  screen,
} from '@testing-library/dom';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import ImportRecordModal from './ImportRecordModal';

const jobProfilesMock = {
  jobProfiles: [{
    id: 'd0ebb7b0-2f0f-11eb-adc1-0242ac120002',
    name: 'testJobProfile1',
  }, {
    id: 'd0ebb7b0-2f0f-11eb-adc1-0242ac120003',
    name: 'testJobProfile2',
  }],
};
const handleSubmitMock = jest.fn();
const mutator = {
  jobProfiles: {
    GET: jest.fn().mockResolvedValue(jobProfilesMock),
  },
};

const oneCopycatProfile = {
  copycatProfiles: {
    records: [{
      profiles: [{
        id: 'testId1',
        name: 'testName1',
        allowedCreateJobProfileIds: ['d0ebb7b0-2f0f-11eb-adc1-0242ac120002'],
        allowedUpdateJobProfileIds: ['91f9b8d6-d80e-4727-9783-73fb53e3c786'],
        createJobProfileId: 'd0ebb7b0-2f0f-11eb-adc1-0242ac120002',
      }]
    }],
  },
};

const twoCopycatProfiles = {
  copycatProfiles: {
    records: [{
      profiles: [{
        id: 'testId1',
        name: 'testName1',
        allowedCreateJobProfileIds: ['d0ebb7b0-2f0f-11eb-adc1-0242ac120002'],
        allowedUpdateJobProfileIds: ['91f9b8d6-d80e-4727-9783-73fb53e3c786'],
        createJobProfileId: 'd0ebb7b0-2f0f-11eb-adc1-0242ac120002',
      }, {
        id: 'testId2',
        name: 'testName2',
        allowedCreateJobProfileIds: ['d0ebb7b0-2f0f-11eb-adc1-0242ac120002'],
        allowedUpdateJobProfileIds: ['91f9b8d6-d80e-4727-9783-73fb53e3c786'],
        createJobProfileId: 'd0ebb7b0-2f0f-11eb-adc1-0242ac120002',
      }]
    }],
  },
};

const defaultProps = {
  isOpen: true,
  handleSubmit: handleSubmitMock,
  handleCancel: noop,
  mutator,
};

const ImportRecordModalSetup = ({ resources, id }) => (
  <MemoryRouter>
    <ImportRecordModal {...defaultProps} resources={resources} id={id} />
  </MemoryRouter>
);

const renderImportRecordModal = (resources = oneCopycatProfile, id) => renderWithIntl(
  <ImportRecordModalSetup resources={resources} id={id} />,
  translationsProperties
);

describe('ImportRecordModal', () => {
  afterEach(() => {
    handleSubmitMock.mockClear();
  });

  it('modal should be rendered', () => {
    const { getByText } = renderImportRecordModal();

    const modalTitle = getByText('Single record import');

    expect(modalTitle).toBeInTheDocument();
  });

  describe('when there are two copycat profiles', () => {
    it('field for external identifier type should be rendered', () => {
      renderImportRecordModal(twoCopycatProfiles);

      const externalIdentifierTypeField = screen.getByLabelText('External target');

      expect(externalIdentifierTypeField).toBeInTheDocument();
    });

    describe('when select another external identifier type', () => {
      it('external identifier type value should be changed', () => {
        renderImportRecordModal(twoCopycatProfiles);

        const externalIdentifierTypeField = screen.getByLabelText('External target');
        fireEvent.change(externalIdentifierTypeField, { target: { value: 'testId2' } });

        expect(externalIdentifierTypeField).toHaveValue('testId2');
      });
    });

    describe('when click submit button', () => {
      it('function for submit should be called', () => {
        renderImportRecordModal(twoCopycatProfiles);

        const externalIdentifierTypeField = screen.getByLabelText('Enter testName1 identifier');
        fireEvent.change(externalIdentifierTypeField, { target: { value: 'test' } });

        const confirmButton = screen.getByRole('button', { name: /Import/i });
        fireEvent.click(confirmButton);

        expect(handleSubmitMock).toHaveBeenCalled();
      });
    });
  });
});
