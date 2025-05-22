import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import LoanAndAvailability from './LoanAndAvailability';

jest.mock('../../components/CirculationNotes', () => ({
  __esModule: true,
  default: () => <div>CirculationNotes</div>,
}));

jest.mock('../../../hooks/useItemOpenLoansQuery', () => jest.fn().mockReturnValue({ openLoans: { loans: [] } }));

const mockLoanAndAvailability = {
  permanentLoanType: 'permanentLoanType',
  temporaryLoanType: 'temporaryLoanType',
  requestLink: '2',
  borrower: 'John Doe',
  loanDate: '2024-03-20T10:00:00Z',
  dueDate: '2024-04-20T10:00:00Z',
};

const mockItem = {
  id: 'itemId',
  status: {
    name: 'Available',
    date: '2024-03-20T10:00:00Z'
  },
  circulationNotes: [
    {
      note: 'Test circulation note',
      noteType: 'Note Type 1'
    }
  ]
};

const defaultProps = {
  loanAndAvailability: mockLoanAndAvailability,
  item: mockItem,
};

const renderLoanAndAvailability = (props = {}) => {
  const component = (
    <LoanAndAvailability
      {...defaultProps}
      {...props}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LoanAndAvailability', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderLoanAndAvailability();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Loan and availability')).toBeInTheDocument();
  });

  it('should render permanent loan type', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Permanent loan type')).toBeInTheDocument();
    expect(screen.getByText('permanentLoanType')).toBeInTheDocument();
  });

  it('should render temporary loan type', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Temporary loan type')).toBeInTheDocument();
    expect(screen.getByText('temporaryLoanType')).toBeInTheDocument();
  });

  it('should render item status', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Item status')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('status updated 3/20/2024, 10:00 AM')).toBeInTheDocument();
  });

  it('should render requests link', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render borrower information', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Borrower')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render loan date', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Loan date')).toBeInTheDocument();
    expect(screen.getByText('2024-03-20T10:00:00Z')).toBeInTheDocument();
  });

  it('should render due date', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('Due date')).toBeInTheDocument();
    expect(screen.getByText('2024-04-20T10:00:00Z')).toBeInTheDocument();
  });

  it('should render circulation notes', () => {
    renderLoanAndAvailability();
    expect(screen.getByText('CirculationNotes')).toBeInTheDocument();
  });

  it('should render NoValue component for missing fields', () => {
    const props = {
      loanAndAvailability: {
        permanentLoanType: 'Permanent Loan Type',
      },
      item: {
        id: 'itemId',
        status: {
          name: 'Available',
          date: '2024-03-20T10:00:00Z'
        }
      }
    };

    renderLoanAndAvailability(props);

    const noValueElements = screen.getAllByText('-');
    expect(noValueElements).toHaveLength(5);
  });
});
