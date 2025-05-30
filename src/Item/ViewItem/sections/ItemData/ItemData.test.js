import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemData from './ItemData';

const defaultProps = {
  itemData: {
    materialType: 'Book',
    effectiveShelvingOrder: 'ABC123',
    callNumberType: 'Library of Congress classification',
    callNumberPrefix: 'PREF',
    callNumber: 'QA76.76',
    callNumberSuffix: 'SUFF',
    copyNumber: 'c.1',
    numberOfPieces: '2',
    descriptionOfPieces: '2 volumes'
  }
};

const renderItemData = (props) => {
  const component = (
    <ItemData
      {...defaultProps}
      {...props}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemData', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderItemData();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderItemData();
    expect(screen.getByText('Item data')).toBeInTheDocument();
  });

  it('should render all item data fields with correct values', () => {
    renderItemData();

    expect(screen.getByText('Material type')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();

    expect(screen.getByText('Shelving order')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();

    expect(screen.getByText('Item call number')).toBeInTheDocument();

    expect(screen.getByText('Call number type')).toBeInTheDocument();
    expect(screen.getByText('Library of Congress classification')).toBeInTheDocument();

    expect(screen.getByText('Call number prefix')).toBeInTheDocument();
    expect(screen.getByText('PREF')).toBeInTheDocument();

    expect(screen.getByText('Call number')).toBeInTheDocument();
    expect(screen.getByText('QA76.76')).toBeInTheDocument();

    expect(screen.getByText('Call number suffix')).toBeInTheDocument();
    expect(screen.getByText('SUFF')).toBeInTheDocument();

    expect(screen.getByText('Copy number')).toBeInTheDocument();
    expect(screen.getByText('c.1')).toBeInTheDocument();

    expect(screen.getByText('Number of pieces')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Description of pieces')).toBeInTheDocument();
    expect(screen.getByText('2 volumes')).toBeInTheDocument();
  });

  it('should render NoValue component for missing fields', () => {
    const props = {
      itemData: {
        materialType: 'Book',
      }
    };

    renderItemData(props);

    const noValueElements = screen.getAllByText('-');
    expect(noValueElements).toHaveLength(8);
  });
});
