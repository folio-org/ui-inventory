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

import AdministrativeData from './AdministrativeData';

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  convertArrayToBlocks: jest.fn(arr => arr.join(', ')),
}));

jest.mock('../../../../components', () => ({
  ...jest.requireActual('../../../../components'),
  AdministrativeNoteList: jest.fn(() => <div>AdministrativeNoteList</div>),
}));

const mockItem = {
  metadata: {
    createdByUserId: 'testUserId',
    createdDate: '2022-01-01T00:00:00.000Z',
    updatedByUserId: 'testUserId',
    updatedDate: '2022-01-01T00:00:00.000Z',
  },
  discoverySuppress: false,
  barcode: 'testBarcode',
};

const mockAdministrativeData = {
  hrid: 'testHrid',
  barcode: 'testBarcode',
  accessionNumber: 'testAccessionNumber',
  identifier: 'testIdentifier',
  formerIds: ['formerId1', 'formerId2'],
  statisticalCodeIds: ['codeId1', 'codeId2'],
  administrativeNotes: ['note1', 'note2'],
};

const mockReferenceTables = {
  statisticalCodeTypes: [
    { id: 'typeId1', name: 'Statistical Code Type 1' },
    { id: 'typeId2', name: 'Statistical Code Type 2' },
  ],
  statisticalCodes: [
    { id: 'codeId1', statisticalCodeTypeId: 'typeId1', name: 'Statistical Code 1' },
    { id: 'codeId2', statisticalCodeTypeId: 'typeId2', name: 'Statistical Code 2' },
  ],
};

const mockRefLookup = jest.fn((table, id) => table.find(item => item.id === id));

const defaultProps = {
  item: mockItem,
  administrativeData: mockAdministrativeData,
  referenceTables: mockReferenceTables,
  refLookup: mockRefLookup,
};

const renderAdministrativeData = (props = {}) => {
  const component = (
    <AdministrativeData
      {...defaultProps}
      {...props}
    />
  );
  return renderWithIntl(component, translationsProperties);
};

describe('AdministrativeData', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderAdministrativeData();
    await runAxeTest({ rootNode: container });
  });

  it('should render AdministrativeData accordion', () => {
    renderAdministrativeData();
    expect(screen.getByRole('button', { name: 'Administrative data' })).toBeInTheDocument();
  });

  it('should render ViewMetaData', () => {
    renderAdministrativeData();
    expect(screen.getByText('ViewMetaData')).toBeInTheDocument();
  });

  it('should display discovery suppressed message when item discoverySuppress is true', () => {
    renderAdministrativeData({ item: { ...mockItem, discoverySuppress: true } });
    expect(screen.getByText('Suppressed from discovery')).toBeInTheDocument();
  });

  it('should not display discovery suppressed message when item discoverySuppress is false', () => {
    renderAdministrativeData();
    expect(screen.queryByText('Suppressed from discovery')).not.toBeInTheDocument();
  });

  it('should render item HRID with Copy button', () => {
    renderAdministrativeData();
    expect(screen.getByText('Item HRID')).toBeInTheDocument();
    expect(screen.getByText('testHrid')).toBeInTheDocument();
    expect(within(screen.getByText('Item HRID').closest('div.kvRoot')).getByText('ClipCopy')).toBeInTheDocument();
  });

  it('should render item barcode with Copy button', () => {
    renderAdministrativeData();
    expect(screen.getByText('Item barcode')).toBeInTheDocument();
    expect(screen.getByText('testBarcode')).toBeInTheDocument();
    expect(within(screen.getByText('Item barcode').closest('div.kvRoot')).getByText('ClipCopy')).toBeInTheDocument();
  });


  it('should render accession number', () => {
    renderAdministrativeData();
    expect(screen.getByText('Accession number')).toBeInTheDocument();
    expect(screen.getByText('testAccessionNumber')).toBeInTheDocument();
  });

  it('should render item identifier', () => {
    renderAdministrativeData();
    expect(screen.getByText('Item identifier')).toBeInTheDocument();
    expect(screen.getByText('testIdentifier')).toBeInTheDocument();
  });

  it('should render former IDs', () => {
    renderAdministrativeData();
    expect(screen.getByText('Former identifier')).toBeInTheDocument();
    expect(screen.getByText('formerId1, formerId2')).toBeInTheDocument();
  });

  it('should render statistical codes list', () => {
    renderAdministrativeData();
    expect(screen.getByText('Statistical code type')).toBeInTheDocument();
    expect(screen.getByText('Statistical code name')).toBeInTheDocument();
    expect(screen.getByText('Statistical Code Type 1')).toBeInTheDocument();
    expect(screen.getByText('Statistical Code 1')).toBeInTheDocument();
    expect(screen.getByText('Statistical Code Type 2')).toBeInTheDocument();
    expect(screen.getByText('Statistical Code 2')).toBeInTheDocument();
  });

  it('should render AdministrativeNoteList', () => {
    renderAdministrativeData();
    expect(screen.getByText('AdministrativeNoteList')).toBeInTheDocument();
  });

  describe('when data is missing', () => {
    const emptyAdministrativeData = {
      hrid: null,
      barcode: null,
      accessionNumber: null,
      identifier: null,
      formerIds: [],
      statisticalCodeIds: [],
      administrativeNotes: [],
    };

    it('should render NoValue for item HRID', () => {
      renderAdministrativeData({ administrativeData: emptyAdministrativeData });
      const hridKeyValue = screen.getByText('Item HRID').closest('div.kvRoot');
      expect(within(hridKeyValue).getByText('-')).toBeInTheDocument();
      expect(within(hridKeyValue).queryByText('Copy')).not.toBeInTheDocument();
    });

    it('should render NoValue for item barcode', () => {
      renderAdministrativeData({ administrativeData: emptyAdministrativeData });
      const barcodeKeyValue = screen.getByText('Item barcode').closest('div.kvRoot');
      expect(within(barcodeKeyValue).getByText('-')).toBeInTheDocument();
      expect(within(barcodeKeyValue).queryByText('Copy')).not.toBeInTheDocument();
    });

    it('should render NoValue for accession number', () => {
      renderAdministrativeData({ administrativeData: emptyAdministrativeData });
      const accessionKeyValue = screen.getByText('Accession number').closest('div.kvRoot');
      expect(within(accessionKeyValue).getByText('-')).toBeInTheDocument();
    });

    it('should render NoValue for item identifier', () => {
      renderAdministrativeData({ administrativeData: emptyAdministrativeData });
      const identifierKeyValue = screen.getByText('Item identifier').closest('div.kvRoot');
      expect(within(identifierKeyValue).getByText('-')).toBeInTheDocument();
    });

    it('should render NoValue for former IDs', () => {
      renderAdministrativeData({ administrativeData: emptyAdministrativeData });
      const formerIdsKeyValue = screen.getByText('Former identifier').closest('div.kvRoot');
      expect(within(formerIdsKeyValue).getByText('-')).toBeInTheDocument();
    });

    it('should render NoValue for statistical codes when statisticalCodeIds is empty', () => {
      renderAdministrativeData({ administrativeData: { ...mockAdministrativeData, statisticalCodeIds: [] } });

      const list = document.querySelector('[id="item-list-statistical-codes"]');
      expect(within(list).getAllByText('-')).toHaveLength(2);
    });
  });
});
