import React from 'react';

import {
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { receivingHistory } from './fixtures';
import { SORT_DIRECTION } from '../../../constants';

import HoldingReceivingHistoryList from './HoldingReceivingHistoryList';

const renderHoldingReceivingHistoryList = () => (
  renderWithIntl(
    <HoldingReceivingHistoryList
      data={receivingHistory}
      isLoading={false}
      tenantId="diku"
    />,
    translationsProperties,
  )
);

describe('HoldingReceivingHistoryList component', () => {
  it('should render correct column headers', () => {
    renderHoldingReceivingHistoryList();

    expect(screen.getByRole('button', { name: /display summary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy number/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enumeration/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chronology/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /receipt date/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /public display/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /source/i })).toBeInTheDocument();
  });

  it('should render receiving history data', () => {
    renderHoldingReceivingHistoryList();

    expect(screen.getByText(receivingHistory[0].displaySummary)).toBeInTheDocument();
    expect(screen.getByText(receivingHistory[0].enumeration)).toBeInTheDocument();
    expect(screen.getByText(receivingHistory[0].chronology)).toBeInTheDocument();
  });

  describe('"Display summary" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const displaySummaryHeader = screen.getAllByRole('columnheader')[0];
      const displaySummaryButton = screen.getByRole('button', { name: /display summary/i });

      fireEvent.click(displaySummaryButton);
      expect(displaySummaryHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(displaySummaryButton);
      expect(displaySummaryHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });

  describe('"Copy number" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const copyNumberHeader = screen.getAllByRole('columnheader')[1];
      const copyNumberButton = screen.getByRole('button', { name: /copy number/i });

      fireEvent.click(copyNumberButton);
      expect(copyNumberHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(copyNumberButton);
      expect(copyNumberHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });

  describe('"Enumeration" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const enumerationHeader = screen.getAllByRole('columnheader')[2];
      const enumerationButton = screen.getByRole('button', { name: /enumeration/i });

      fireEvent.click(enumerationButton);
      expect(enumerationHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(enumerationButton);
      expect(enumerationHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });

  describe('"Chronology" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const chronologyHeader = screen.getAllByRole('columnheader')[3];
      const chronologyButton = screen.getByRole('button', { name: /chronology/i });

      fireEvent.click(chronologyButton);
      expect(chronologyHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(chronologyButton);
      expect(chronologyHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });

  describe('"Receipt date" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const receiptDateHeader = screen.getAllByRole('columnheader')[4];
      const receiptDateButton = screen.getByRole('button', { name: /receipt date/i });

      fireEvent.click(receiptDateButton);
      expect(receiptDateHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(receiptDateButton);
      expect(receiptDateHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });

  describe('"Comment" header', () => {
    it('should not apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const commentHeader = screen.getAllByRole('columnheader')[5];
      const commentButton = screen.getByRole('button', { name: /comment/i });

      fireEvent.click(commentButton);
      expect(commentHeader.getAttribute('aria-sort')).toBe('none');

      fireEvent.click(commentButton);
      expect(commentHeader.getAttribute('aria-sort')).toBe('none');
    });
  });

  describe('"Public display" header', () => {
    it('should not apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const publicDisplayHeader = screen.getAllByRole('columnheader')[6];
      const publicDisplayButton = screen.getByRole('button', { name: /public display/i });

      fireEvent.click(publicDisplayButton);
      expect(publicDisplayHeader.getAttribute('aria-sort')).toBe('none');

      fireEvent.click(publicDisplayButton);
      expect(publicDisplayHeader.getAttribute('aria-sort')).toBe('none');
    });
  });

  describe('"Source" header', () => {
    it('should apply sort by a column', () => {
      renderHoldingReceivingHistoryList();

      const sourceHeader = screen.getAllByRole('columnheader')[7];
      const sourceButton = screen.getByRole('button', { name: /source/i });

      fireEvent.click(sourceButton);
      expect(sourceHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

      fireEvent.click(sourceButton);
      expect(sourceHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
    });
  });
});
