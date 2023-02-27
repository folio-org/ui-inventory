import { exportCsv } from '@folio/stripes/util';
import InTransitItemsReport from './InTransitItemsReport';

jest.mock('@folio/stripes/util', () => ({
  exportCsv: jest.fn(),
}));

describe('InTransitItemsReport', () => {
  let mutators;
  let formatMessage;
  let report;
  beforeEach(() => {
    mutators = {
      itemsInTransitReport: {
        GET: jest.fn(() => Promise.resolve([{ barcode: '123456' }])),
        reset: jest.fn(),
      },
    };
    formatMessage = jest.fn(() => 'Mock Label');
    report = new InTransitItemsReport(mutators, formatMessage);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('parse', () => {
    it('parse the records', async () => {
      const records = [{
        barcode: '123456',
        title: 'Test Title',
        contributors: [{ name: 'contributors Name' }],
        location: { name: 'Test Location', code: 'TL' },
        effectiveCallNumberComponents: { prefix: 'A', callNumber: '123', suffix: 'B' },
        enumeration: '1',
        volume: '2',
        yearCaption: ['2022'],
        copyNumber: '3',
        status: { name: 'Available' },
        lastCheckIn: { servicePoint: { name: 'Check In SP' }, dateTime: '2022-01-01' },
        inTransitDestinationServicePoint: { name: 'Destination SP' },
        request: {
          requestType: 'Hold',
          requestDate: '2022-01-01',
          requestExpirationDate: '2022-02-01',
          requestPickupServicePointName: 'Pickup SP',
          tags: ['tag1', 'tag2'],
        },
      }];
      const expectedResult = [{
        barcode: '123456',
        title: 'Test Title',
        contributors: 'contributors Name',
        shelvingLocation: 'Test Location',
        shelvingLocationCode: 'TL',
        callNumberPrefix: 'A',
        callNumber: '123',
        callNumberSuffix: 'B',
        enumeration: '1',
        volume: '2',
        yearCaption: '2022',
        copyNumber: '3',
        itemStatus: 'Available',
        checkInServicePoint: 'Check In SP',
        checkInDateTime: '2022-01-01',
        destinationServicePoint: 'Destination SP',
        requestType: 'Hold',
        requestCreationDate: '2022-01-01',
        requestExpirationDate: '2022-02-01',
        requestPickupServicePoint: 'Pickup SP',
        tags: 'tag1; tag2',
      }];
      const result = report.parse(records);
      expect(result).toEqual(expectedResult);
    });
  });
  describe('fetch', () => {
    it('call GET with correct params', async () => {
      const data = [];
      mutators.itemsInTransitReport.GET.mockResolvedValueOnce(data);
      await report.fetchData();
      expect(mutators.itemsInTransitReport.GET).toHaveBeenCalledWith({ params: { query: undefined, limit: 10000, offset: 0 } });
    });
    it('return data if GET is successful', async () => {
      const data = [{ id: 'item1' }, { id: 'item2' }];
      mutators.itemsInTransitReport.GET.mockResolvedValueOnce(data);
      const result = await report.fetchData();
      expect(result).toEqual(data);
    });
    it('return an empty array if GET fails', async () => {
      mutators.itemsInTransitReport.GET.mockRejectedValueOnce(new Error('GET failed'));
      const result = await report.fetchData();
      expect(result).toEqual([]);
    });
  });
  describe('toCSV', () => {
    it('call exportCsv with the correct arguments', async () => {
      const records = [{ barcode: '123456789' }];
      const parsedRecords = [{ barcode: '123456789' }];
      report.fetchData = jest.fn(() => Promise.resolve(records));
      report.parse = jest.fn(() => parsedRecords);
      await report.toCSV();
      expect(exportCsv).toHaveBeenCalledWith(parsedRecords, {
        onlyFields: report.columnsMap,
        filename: 'InTransit',
      });
    });
    it('return the parsed records', async () => {
      const records = [{ barcode: '123456789' }];
      const parsedRecords = [{ barcode: '123456789' }];
      report.fetchData = jest.fn(() => Promise.resolve(records));
      report.parse = jest.fn(() => parsedRecords);
      const result = await report.toCSV();
      expect(result).toEqual(parsedRecords);
    });
  });
});
