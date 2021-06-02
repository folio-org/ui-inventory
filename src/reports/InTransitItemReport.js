import {
  keyBy,
  chunk,
  flatten,
} from 'lodash';

import { exportCsv } from '@folio/stripes/util';
import { itemStatusesMap } from '../constants';

const columns = [
  'barcode',
  'title',
  'contributors',
  'shelvingLocation',
  'shelvingLocationCode',
  'callNumberPrefix',
  'callNumber',
  'callNumberSuffix',
  'enumeration',
  'volume',
  'yearCaption',
  'copyNumber',
  'itemStatus',
  'checkInServicePoint',
  'checkInDateTime',
  'destinationServicePoint',
  'requestType',
  'requestCreationDate',
  'requestExpirationDate',
  'requestPickupServicePoint',
  'tags',
];

class InTransitItemsReport {
  constructor(mutators, formatMessage) {
    this.mutators = mutators;
    this.columnsMap = columns.map(value => ({
      label: formatMessage({ id: `ui-inventory.reports.inTransitItem.${value}` }),
      value,
    }));
  }

  parse(records) {
    return records.map(record => ({
      barcode: record?.barcode,
      title: record?.holdingsRecord?.instance?.title,
      contributors: (record?.holdingsRecord?.instance?.contributors ?? []).map(({ name }) => name).join(';'),
      shelvingLocation: record?.effectiveLocation?.description,
      shelvingLocationCode: record?.effectiveLocation?.code,
      callNumberPrefix: record?.effectiveCallNumberComponents?.prefix,
      callNumber: record?.effectiveCallNumberComponents?.callNumber,
      callNumberSuffix: record?.effectiveCallNumberComponents?.suffix,
      enumeration: record?.enumeration,
      volume: record?.volume,
      yearCaption: (record?.yearCaption ?? []).join(';'),
      copyNumber: record?.copyNumber,
      itemStatus: record?.status?.name,
      checkInServicePoint: record?.lastCheckIn?.servicePoint?.name,
      checkInDateTime: record?.lastCheckIn?.dateTime,
      destinationServicePoint: record?.inTransitDestinationServicePoint?.name,
      requestType: record?.request?.requestType,
      requestCreationDate: record?.request?.requestDate,
      requestExpirationDate: record?.request?.requestExpirationDate,
      requestPickupServicePoint: record?.request?.pickupServicePoint?.name,
      tags: (record?.reques?.tags ?? []).join(';'),
    }));
  }

  fetch(mutator, options = {}) {
    const {
      GET,
      reset,
    } = mutator;
    const {
      query,
      limit = 10000,
      offset = 0,
    } = options;

    reset();

    return GET({ params: { query, limit, offset } });
  }

  // Split items into chunks of 90 per chunk
  // to avoid hitting GET request limit
  // Process chunked requests in parallel.
  async findRequests(items) {
    const mutator = this.mutators.requests;
    const chunks = chunk(items.map(item => item.id), 90);
    const promises = chunks.map(ids => this.fetch(mutator, { query: `itemId==(${ids.join(' or ')})` }));
    const results = await Promise.all(promises);

    if (!results?.length) {
      return;
    }

    const records = flatten(results);

    if (records?.length) {
      const recordsByItemId = keyBy(records, 'itemId');

      items.forEach(item => {
        const record = recordsByItemId[item.id];

        if (record) {
          item.request = record;
        }
      });
    }
  }

  // Fetch instances and holdings and join them together
  async findHoldingsAndInstancesChunk(holdingsIds) {
    const {
      instances: instancesMutator,
      holdings: holdingsMutator,
    } = this.mutators;
    const holdingRecords = await this.fetch(holdingsMutator, { query: `id==(${holdingsIds.join(' or ')})` });
    const instancesIds = [...new Set(holdingRecords.map(record => record.instanceId))];
    const instances = await this.fetch(instancesMutator, { query: `id==(${instancesIds.join(' or ')})` });

    if (!instances.length) {
      return holdingRecords;
    }

    const holdingsByInstanceId = keyBy(holdingRecords, 'instanceId');

    instances.forEach(instance => {
      const record = holdingsByInstanceId[instance.id];

      if (record) {
        record.instance = instance;
      }
    });

    return holdingRecords;
  }

  // Split items into chunks by holdingsRecordId and
  // fetch all chunks in parallel
  async findHoldingsAndInstances(items) {
    const holdingsSet = new Set(items.map(item => item.holdingsRecordId));
    const chunks = chunk([...holdingsSet], 90);
    const promises = chunks.map(ids => this.findHoldingsAndInstancesChunk(ids));
    const results = await Promise.all(promises);

    if (!results?.length) {
      return;
    }

    const holdings = flatten(results);

    if (holdings?.length) {
      const holdingsById = keyBy(holdings, 'id');

      items.forEach(item => {
        const holdingsRecord = holdingsById[item.holdingsRecordId];

        if (holdingsRecord) {
          item.holdingsRecord = holdingsRecord;
        }
      });
    }
  }

  async findServicePoints(items) {
    const inTransitDestinationServicePointIds = items
      .map(item => item?.inTransitDestinationServicePointId)
      .filter(id => id);
    const lastCheckInServicePointIds = items
      .map(item => item?.lastCheckIn?.servicePointId)
      .filter(id => id);
    const pickupServicePointIds = items
      .map(item => item?.request?.pickupServicePointId)
      .filter(id => id);

    const querySet = new Set([
      ...inTransitDestinationServicePointIds,
      ...lastCheckInServicePointIds,
      ...pickupServicePointIds
    ]);
    const query = `id==(${[...querySet].join(' or ')})`;
    const servicePoints = await this.fetch(this.mutators.servicePoints, { query });

    if (servicePoints?.length) {
      const servicePointsById = keyBy(servicePoints, 'id');

      items.forEach(item => {
        const inTransitDestinationServicePointId = item.inTransitDestinationServicePointId;
        const lastCheckInServicePointId = item.lastCheckIn?.servicePointId;
        const pickupServicePointId = item?.request?.pickupServicePointId;

        if (servicePointsById?.[inTransitDestinationServicePointId]) {
          item.inTransitDestinationServicePoint = servicePointsById[inTransitDestinationServicePointId];
        }

        if (servicePointsById?.[lastCheckInServicePointId] && item.lastCheckIn) {
          item.lastCheckIn.servicePoint = servicePointsById[lastCheckInServicePointId];
        }

        if (servicePointsById?.[pickupServicePointId] && item.request) {
          item.request.pickupServicePoint = servicePointsById[pickupServicePointId];
        }
      });
    }
  }

  async findLocations(items) {
    const mutator = this.mutators.locations;
    const locationIds = items
      .map(item => item?.effectiveLocationId)
      .filter(id => id);
    const chunks = chunk([...new Set(locationIds)], 90);
    const promises = chunks.map(ids => this.fetch(mutator, { query: `id==(${ids.join(' or ')})` }));
    const results = await Promise.all(promises);

    if (!results?.length) {
      return;
    }

    const locations = flatten(results);

    if (!locations?.length) {
      return;
    }

    const locationsById = keyBy(locations, 'id');

    items.forEach(item => {
      const effectiveLocationId = item.effectiveLocationId;

      if (locationsById?.[effectiveLocationId]) {
        item.effectiveLocation = locationsById[effectiveLocationId];
      }
    });
  }

  async fetchData() {
    const query = `status.name==${itemStatusesMap.IN_TRANSIT}`;
    const limit = 10000;
    const data = [];

    let offset = 0;
    let hasData = true;

    while (hasData) {
      try {
        const items = await this.fetch(this.mutators.itemsInTransitReport, { query, limit, offset });

        hasData = items.length;
        offset += limit;

        if (hasData) {
          await Promise.all([
            this.findRequests(items),
            this.findHoldingsAndInstances(items),
          ]);
          data.push(...items);
        }
      } catch (err) {
        hasData = false;
      }
    }

    if (data.length) {
      await Promise.all([
        await this.findServicePoints(data),
        await this.findLocations(data),
      ]);
    }

    return data;
  }

  async toCSV() {
    const onlyFields = this.columnsMap;
    const records = await this.fetchData();
    const parsedRecords = this.parse(records);

    exportCsv(parsedRecords, { onlyFields, filename: 'InTransit' });

    return parsedRecords;
  }
}

export default InTransitItemsReport;
