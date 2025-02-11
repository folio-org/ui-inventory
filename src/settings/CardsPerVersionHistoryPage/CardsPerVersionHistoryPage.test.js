import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useCallout } from '@folio/stripes/core';

import { CardsPerVersionHistoryPage } from './CardsPerVersionHistoryPage';
import { useAuditSettings } from '../../hooks';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

jest.mock('./components', () => ({
  CardsPerVersionHistoryPageForm: jest.fn(({ onSubmit }) => (
    <div>
      <span>CardsPerVersionHistoryPageForm</span>
      <button type="button" onClick={() => onSubmit({ cardsPerPage: 25 })}>save</button>
    </div>
  )),
}));
jest.mock('../../hooks', () => ({
  useAuditSettings: jest.fn(),
}));

const mockUpdateSetting = jest.fn();
const mockSendCallout = jest.fn();

describe('CardsPerVersionHistoryPage', () => {
  const renderCardsPerVersionHistoryPage = () => (renderWithIntl(
    <MemoryRouter>
      <CardsPerVersionHistoryPage />
    </MemoryRouter>,
    translationsProperties
  ));

  beforeEach(() => {
    useAuditSettings.mockClear().mockReturnValue({
      settings: [{
        key: 'records.page.size',
        value: 10,
      }],
      updateSetting: mockUpdateSetting,
      isSettingsLoading: false,
      isError: false,
    });

    useCallout.mockClear().mockReturnValue({
      sendCallout: mockSendCallout,
    });
  });

  it('should render the "CardsPerVersionHistoryPageForm" component', () => {
    renderCardsPerVersionHistoryPage();

    expect(screen.getByText('CardsPerVersionHistoryPageForm')).toBeInTheDocument();
  });

  describe('when settings are loading', () => {
    beforeEach(() => {
      useAuditSettings.mockClear().mockReturnValue({
        settings: [],
        updateSetting: mockUpdateSetting,
        isSettingsLoading: true,
        isError: false,
      });
    });

    it('should display a loading pane', () => {
      renderCardsPerVersionHistoryPage();

      expect(screen.getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('when settings request failed', () => {
    beforeEach(() => {
      useAuditSettings.mockClear().mockReturnValue({
        settings: [],
        updateSetting: mockUpdateSetting,
        isSettingsLoading: false,
        isError: true,
      });
    });

    it('should display a toast notification', () => {
      renderCardsPerVersionHistoryPage();

      expect(screen.queryByText('LoadingPane')).not.toBeInTheDocument();
      expect(mockSendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'Failed to load Cards per page setting',
      });
    });
  });

  describe('when submitting the form', () => {
    it('should call updateSetting with correct parameters', () => {
      renderCardsPerVersionHistoryPage();

      fireEvent.click(screen.getByText('save'));

      expect(mockUpdateSetting).toHaveBeenCalledWith({
        body: {
          key: 'records.page.size',
          value: 25,
        },
        settingKey: 'records.page.size',
      });
    });
  });
});
