import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import CirculationHistory from './CirculationHistory';
import useItemCheckInsQuery from '../../../hooks/useItemCheckInsQuery';

jest.mock('../../../hooks/useItemCheckInsQuery', () => jest.fn());

const mockCheckIns = [
  {
    id: 'check-in-1',
    occurredDateTime: '2026-10-14T09:54:00Z',
    object: 'In-house use',
    action: 'Recorded',
    source: 'Margaret Simpson',
    servicePointName: 'Reference Desk',
  },
  {
    id: 'check-in-2',
    occurredDateTime: '2026-10-13T16:05:00Z',
    object: null,
    action: 'Checked in',
    source: 'Todd Flanders',
    servicePointName: 'Circ Desk 1',
  },
];

const mockSetOffset = jest.fn();

const defaultHookReturn = {
  checkIns: mockCheckIns,
  totalRecords: 2,
  isFetching: false,
  offset: 0,
  setOffset: mockSetOffset,
  limit: 100,
};

const renderCirculationHistory = (itemId = 'item-id') => {
  return renderWithIntl(<CirculationHistory itemId={itemId} />, translationsProperties);
};

describe('CirculationHistory', () => {
  beforeEach(() => {
    mockSetOffset.mockClear();
    useItemCheckInsQuery.mockReturnValue(defaultHookReturn);
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderCirculationHistory();
    await runAxeTest({ rootNode: container });
  });

  it('should render Circulation history accordion', () => {
    renderCirculationHistory();

    expect(screen.getByText('Circulation history')).toBeInTheDocument();
  });

  it('should render table column headers', () => {
    renderCirculationHistory();

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Object')).toBeInTheDocument();
    expect(screen.getByText('Circ action')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Service point')).toBeInTheDocument();
  });

  it('should render check-in row data from API response fields', () => {
    renderCirculationHistory();

    expect(screen.getByText('In-house use')).toBeInTheDocument();
    expect(screen.getByText('Recorded')).toBeInTheDocument();
    expect(screen.getByText('Margaret Simpson')).toBeInTheDocument();
    expect(screen.getByText('Reference Desk')).toBeInTheDocument();
    expect(screen.getByText('Checked in')).toBeInTheDocument();
    expect(screen.getByText('Todd Flanders')).toBeInTheDocument();
    expect(screen.getByText('Circ Desk 1')).toBeInTheDocument();
  });

  it('should render one empty row with dashes when there are no check-ins', () => {
    useItemCheckInsQuery.mockReturnValue({
      ...defaultHookReturn,
      checkIns: [],
      totalRecords: 0,
    });

    renderCirculationHistory();

    const noValueCells = screen.getAllByText('-');
    expect(noValueCells.length).toBeGreaterThanOrEqual(5);
  });
});
