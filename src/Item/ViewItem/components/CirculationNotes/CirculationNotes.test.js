import { act } from 'react';

import {
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import CirculationNotes from './CirculationNotes';

const renderCirculationNotes = (notes = []) => {
  const component = <CirculationNotes notes={notes} />;

  return renderWithIntl(component, translationsProperties);
};

describe('CirculationNotes', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderCirculationNotes());

    await runAxeTest({ rootNode: container });
  });

  it('should render empty "Staff only" and "Note" field values when no notes provided', () => {
    renderCirculationNotes([]);

    expect(screen.getByText(/staff only/i)).toBeInTheDocument();
    expect(screen.getByText(/note/i)).toBeInTheDocument();
    expect(within(screen.getByTestId('staff-only-field')).getByText(/no value set/i)).toBeInTheDocument();
    expect(within(screen.getByTestId('note-field')).getByText(/no value set/i)).toBeInTheDocument();
  });

  it('should render "Staff only" and "Note" field values when notes provided', () => {
    const notes = [{
      noteType: 'Check out',
      staffOnly: true,
      note: 'Some note 1',
    }];
    renderCirculationNotes(notes);

    expect(within(screen.getByTestId('staff-only-field')).getByText(/yes/i)).toBeInTheDocument();
    expect(screen.getByText(/check out note/i)).toBeInTheDocument();
    expect(within(screen.getByTestId('note-field')).getByText(/some note 1/i)).toBeInTheDocument();
  });
});
