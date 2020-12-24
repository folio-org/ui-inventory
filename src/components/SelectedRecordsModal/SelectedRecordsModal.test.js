import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
              selectedRecords={{
                '1': { title: 'title1', contributors: 'c', publishers: 'p' },
                '2': { title: 'title2', contributors: 'c', publishers: 'p' },
              }}
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

    it('should call cancel callback upon click on cancel button', async () => {
      userEvent.click(await screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancelSpy).toHaveBeenCalled();
    });
  });
});
