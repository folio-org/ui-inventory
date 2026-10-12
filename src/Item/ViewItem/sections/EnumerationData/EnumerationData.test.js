import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import EnumerationData from './EnumerationData';

const defaultProps = {
  enumerationData: {
    displaySummary: 'Test Summary',
    enumeration: 'v.1',
    chronology: '2020',
    volume: 'Vol. 1',
    yearCaption: ['2019', '2021']
  }
};

const renderEnumerationData = (props) => {
  const component = (
    <EnumerationData
      {...defaultProps}
      {...props}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('EnumerationData', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderEnumerationData();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderEnumerationData();
    expect(screen.getByText('Enumeration data')).toBeInTheDocument();
  });

  it('should render all enumeration data fields with correct values', () => {
    renderEnumerationData();

    expect(screen.getByText('Display summary')).toBeInTheDocument();
    expect(screen.getByText('Test Summary')).toBeInTheDocument();

    expect(screen.getByText('Enumeration')).toBeInTheDocument();
    expect(screen.getByText('v.1')).toBeInTheDocument();

    expect(screen.getByText('Chronology')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();

    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Vol. 1')).toBeInTheDocument();

    expect(screen.getByText('Year, caption')).toBeInTheDocument();
    expect(screen.getByText('2019')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
  });

  it('should render NoValue component for missing fields', () => {
    const props = {
      enumerationData: {
        displaySummary: 'Test Summary',
      }
    };

    renderEnumerationData(props);

    const noValueElements = screen.getAllByText('-');
    expect(noValueElements).toHaveLength(4);
  });

  it('should handle empty yearCaption array', () => {
    const props = {
      enumerationData: {
        ...defaultProps.enumerationData,
        yearCaption: []
      }
    };

    renderEnumerationData(props);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
