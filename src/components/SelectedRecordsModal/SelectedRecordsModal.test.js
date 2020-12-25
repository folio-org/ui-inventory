import React from 'react';
import {
  screen,
  getByText,
  getAllByRole,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { size } from 'lodash';

import '../../../test/jest/__mock__';

import {
  Layer,
  Paneset,
} from '@folio/stripes/components';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import SelectedRecordsModal from './SelectedRecordsModal';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';

describe('SelectedRecordsModal', () => {
  describe('rendering SelectedRecordsModal', () => {
    const selectedRecords = {
      '1': { title: 'Title1', contributors: 'Contributor1', publishers: 'Publisher1' },
      '2': { title: 'Title2', contributors: 'Contributor2', publishers: 'Publisher2' },
    };
    const onCancelSpy = jest.fn();

    beforeEach(() => {
      renderWithIntl(
        <Paneset>
          <Layer
            isOpen
            contentLabel="label"
          >
            <SelectedRecordsModal
              isOpen
              selectedRecords={selectedRecords}
              columnMapping={{
                title: 'Title',
                contributors: 'Contributors',
                publishers: 'Publishers'
              }}
              onCancel={onCancelSpy}
            />
          </Layer>,
        </Paneset>,
        translationsProperties
      );
    });

    it('should render modal', () => {
      expect(screen.getByRole('dialog', { 'aria-modal': true })).toBeInTheDocument();
    });

    it('should have correct label', () => {
      expect(screen.getByRole('heading', { name: 'Selected records' })).toBeInTheDocument();
    });

    it('should call cancel callback upon click on cancel button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancelSpy).toHaveBeenCalled();
    });

    it('should have a list with correct headers', () => {
      const headers = screen.getAllByRole('columnheader');

      expect(getByText(headers[0], 'Title')).toBeTruthy();
      expect(getByText(headers[1], 'Contributors')).toBeTruthy();
      expect(getByText(headers[2], 'Publishers')).toBeTruthy();
    });

    it('should have a list with correct amount of rows', () => {
      expect(screen.getAllByRole('row').length).toEqual(size(selectedRecords) + 1);
    });

    it('should have correct data in rows', () => {
      const dataRows = screen.getAllByRole('row').slice(1); // remove header row
      const gridCells = dataRows.map(row => {
        return getAllByRole(row, 'gridcell').map(cell => cell.innerHTML);
      });
      const expectedCells = Object.values(selectedRecords).map(record => Object.values(record));

      expect(gridCells).toEqual(expectedCells);
    });
  });
});
