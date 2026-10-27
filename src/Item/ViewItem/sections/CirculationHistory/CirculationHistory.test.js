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
    inHouseUse: true,
    staffMember: { personal: { firstName: 'Margaret', lastName: 'Simpson' } },
    servicePoint: { id: 'sp-1', name: 'Reference Desk' },
  },
  {
    id: 'check-in-2',
    occurredDateTime: '2026-10-13T16:05:00Z',
    inHouseUse: false,
    staffMember: { personal: { firstName: 'Todd', lastName: 'Flanders' } },
    servicePoint: { id: 'sp-2', name: 'Circ Desk 1' },
  },
];

const renderCirculationHistory = (itemId = 'item-id') => {
  return renderWithIntl(<CirculationHistory itemId={itemId} />, translationsProperties);
};

describe('CirculationHistory', () => {
  beforeEach(() => {
    useItemCheckInsQuery.mockReturnValue({
      checkIns: mockCheckIns,
      totalRecords: 2,
      isFetching: false,
      offset: 0,
      setOffset: jest.fn(),
      limit: 100,
    });
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

  it('should render in-house use check-in row correctly', () => {
    renderCirculationHistory();

    expect(screen.getByText('In-house use')).toBeInTheDocument();
    expect(screen.getByText('Recorded')).toBeInTheDocument();
    expect(screen.getByText('Simpson, Margaret')).toBeInTheDocument();
    expect(screen.getByText('Reference Desk')).toBeInTheDocument();
  });

  it('should render regular check-in row correctly', () => {
    renderCirculationHistory();

    expect(screen.getByText('Checked in')).toBeInTheDocument();
    expect(screen.getByText('Flanders, Todd')).toBeInTheDocument();
    expect(screen.getByText('Circ Desk 1')).toBeInTheDocument();
  });

  it('should render one empty row with dashes when there are no check-ins', () => {
    useItemCheckInsQuery.mockReturnValue({
      checkIns: [],
      totalRecords: 0,
      isFetching: false,
      offset: 0,
      setOffset: jest.fn(),
      limit: 100,
    });

    renderCirculationHistory();

    expect(screen.getByText('Circulation history')).toBeInTheDocument();
    // All five cells in the placeholder row should render as NoValue (-)
    const noValueCells = screen.getAllByText('-');
    expect(noValueCells.length).toBeGreaterThanOrEqual(5);
  });
});
