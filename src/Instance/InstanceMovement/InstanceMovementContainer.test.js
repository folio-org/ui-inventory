import React from 'react';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import InstanceMovementContainer from './InstanceMovementContainer';
import DataContext from '../../contexts/DataContext';
import useInstance from '../../common/hooks/useInstance';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

jest.mock('../../common/hooks/useInstance', () => jest.fn());
jest.mock('../../providers', () => ({
  ...jest.requireActual('../../providers'),
  useHoldings: jest.fn().mockReturnValue({
    holdingsById: {
      'holdings-id-1': {
        id: 'holdings-id-1',
        sourceId: 'marc-source-id',
        _version: 1,
      },
    },
  }),
}));

jest.mock('./InstanceMovement', () => ({ moveHoldings }) => (
  <button
    type="button"
    onClick={() => moveHoldings('instance-id-2', ['holdings-id-1'])}
  >
    Move holdings
  </button>
));

const mockHistory = {
  push: jest.fn(),
  location: { search: 'location-search' },
};

const recordsEditorGETReturnValues = {
  fields: [{
    tag: '001',
    content: 'holdings-hrid-1',
  }, {
    tag: '004',
    content: 'instance-hrid-1',
  }],
  parsedRecordId: 'parsed-record-id-1',
  data: {
    externalHrid: 'holdings-hrid-1',
    externalId: 'holdings-id-1',
  },
};

let nonUpdatedIds = [];

const mutator = {
  recordsEditorId: {
    update: jest.fn(),
  },
  recordsEditor: {
    GET: jest.fn(() => Promise.resolve(recordsEditorGETReturnValues)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  movableHoldings: {
    POST: jest.fn(() => Promise.resolve({ nonUpdatedIds })),
  },
};

const dataContextProviderValue = {
  holdingsSourcesByName: {
    MARC: {
      id: 'marc-source-id',
      name: 'MARC',
      source: 'folio',
    },
  },
};

const renderInstanceMovementContainer = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <DataContext.Provider value={dataContextProviderValue}>
      <InstanceMovementContainer
        history={mockHistory}
        idFrom="instance-id-1"
        idTo="instance-id-2"
        mutator={mutator}
        {...props}
      />
      InstanceMovementContainer component
    </DataContext.Provider>
  </MemoryRouter>,
  translationsProperties,
);

describe.skip('Given InstanceMovementContainer', () => {
  beforeAll(() => {
    useInstance
      .mockReturnValueOnce({
        isLoading: false,
        instance: {
          id: 'instance-id-1',
          hrid: 'instance-hrid-1',
          title: 'Instance title 1',
        },
      })
      .mockReturnValueOnce({
        isLoading: false,
        instance: {
          id: 'instance-id-2',
          hrid: 'instance-hrid-2',
          title: 'Instance title 2',
        },
      });
  });

  it('should render InstanceMovementContainer', () => {
    renderInstanceMovementContainer();

    expect(screen.getByText('InstanceMovementContainer component')).toBeDefined();
  });

  describe('when move holdings between instances', () => {
    beforeEach(() => {
      useInstance
        .mockReturnValueOnce({
          isLoading: false,
          instance: {
            id: 'instance-id-1',
            hrid: 'instance-hrid-1',
            title: 'Instance title 1',
          },
        })
        .mockReturnValueOnce({
          isLoading: false,
          instance: {
            id: 'instance-id-2',
            hrid: 'instance-hrid-2',
            title: 'Instance title 2',
          },
        });
    });

    it('should handle mutator.recordsEditorId.update with marc holdings id', () => {
      renderInstanceMovementContainer();

      fireEvent.click(screen.getByText('Move holdings'));

      expect(mutator.recordsEditorId.update).toHaveBeenCalledWith({ externalId: 'holdings-id-1' });
    });

    it('should handle mutator.recordsEditor.GET', () => {
      renderInstanceMovementContainer();

      fireEvent.click(screen.getByText('Move holdings'));

      expect(mutator.recordsEditor.GET).toHaveBeenCalled();
    });

    it('should handle mutator.recordsEditorId.update with parsed record id', () => {
      renderInstanceMovementContainer();

      fireEvent.click(screen.getByText('Move holdings'));

      expect(mutator.recordsEditorId.update).toHaveBeenCalledWith({ id: 'parsed-record-id-1' });
    });

    it('should handle mutator.recordsEditor.PUT with correct values', () => {
      renderInstanceMovementContainer();

      fireEvent.click(screen.getByText('Move holdings'));

      expect(mutator.recordsEditor.PUT).toHaveBeenCalledWith({
        ...recordsEditorGETReturnValues,
        fields: [{
          tag: '001',
          content: 'holdings-hrid-1',
        }, {
          tag: '004',
          content: 'instance-hrid-2',
        }],
        relatedRecordVersion: 2,
        _actionType: 'edit',
      });
    });

    it('should handle mutator.movableHoldings.POST with correct values', () => {
      renderInstanceMovementContainer();

      nonUpdatedIds = ['holdings-id-1'];

      fireEvent.click(screen.getByText('Move holdings'));

      expect(mutator.movableHoldings.POST).toHaveBeenCalledWith({
        toInstanceId: 'instance-id-2',
        holdingsRecordIds: ['holdings-id-1'],
      });
    });
  });
});
