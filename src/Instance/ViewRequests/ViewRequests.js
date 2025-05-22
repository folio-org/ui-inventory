import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import orderBy from 'lodash/orderBy';

import {
  Loading,
  MultiColumnList,
  NoValue,
  Pane,
  Paneset,
  TextLink,
} from '@folio/stripes/components';

import ItemBarcode from '../ItemsList/ItemBarcode';
import { requestStatusFiltersString } from '../../Item/ViewItem/ViewItem';
import { getDateWithTime } from '../../utils';

export const ASC_DIRECTION = 'ascending';
export const DESC_DIRECTION = 'descending';

const getFormatter = (instanceId, loansMap, requestsMap) => ({
  'barcode': item => {
    return (
      item.id && (
        <ItemBarcode
          item={item}
          holdingId={item.holdingsRecordId}
          instanceId={instanceId}
        />
      )
    ) || <NoValue />;
  },
  'status': x => x.status?.name || <NoValue />,
  'requestQueue': item => (
    <TextLink to={`/requests?filters=${requestStatusFiltersString}&query=${item.id}&sort=Request Date`}>
      {requestsMap.get(item.id)}
    </TextLink>
  ),
  'materialType': x => x.materialType?.name || <NoValue />,
  'loanType': x => x.temporaryLoanType?.name || x.permanentLoanType?.name || <NoValue />,
  'effectiveLocation': x => x.effectiveLocation?.name || <NoValue />,
  'enumeration': x => x.enumeration || <NoValue />,
  'chronology': x => x.chronology || <NoValue />,
  'due': (item) => (loansMap.get(item.id)[0] ? getDateWithTime(loansMap.get(item.id)[0].dueDate) : <NoValue />),
});

const getColumnMapping = (intl) => ({
  'barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
  'status': intl.formatMessage({ id: 'ui-inventory.status' }),
  'due': intl.formatMessage({ id: 'ui-inventory.item.availability.dueDate' }),
  'requestQueue': intl.formatMessage({ id: 'ui-inventory.item.requestQueue' }),
  'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
  'loanType': intl.formatMessage({ id: 'ui-inventory.loanType' }),
  'effectiveLocation': intl.formatMessage({ id: 'ui-inventory.effectiveLocationShort' }),
  'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
  'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
});

const visibleColumns = [
  'barcode',
  'status',
  'due',
  'requestQueue',
  'effectiveLocation',
  'loanType',
  'enumeration',
  'chronology',
  'materialType',
];

function ViewRequests({ items, requestsMap, loansMap, onCloseViewRequests, instanceId, instance }) {
  const intl = useIntl();
  const columnMapping = useMemo(() => getColumnMapping(intl), [intl]);

  const formatter = useMemo(
    () => loansMap && requestsMap && getFormatter(instanceId, loansMap, requestsMap),
    [instanceId, loansMap, requestsMap],
  );

  const sorters = useMemo(() => ({
    'barcode': ({ barcode }) => barcode?.toLowerCase(),
    'requestQueue': ({ id }) => requestsMap.get(id),
  }), [requestsMap]);

  const nonInteractiveHeaders = useMemo(() => visibleColumns.filter(col => !sorters[col]), [sorters]);
  const [sortedByColumn, setSortedByColumn] = useState('barcode');
  const [sortOrder, setSortOrder] = useState(ASC_DIRECTION);
  const sortedRecords = orderBy(items, sorters[sortedByColumn], sortOrder === DESC_DIRECTION ? 'desc' : 'asc');

  const changeSorting = useCallback((event, { name }) => {
    if (!sorters[name]) return;
    if (sortedByColumn !== name) {
      setSortedByColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedByColumn, sorters]);

  const isLoading = !items || !requestsMap || !loansMap;

  return (
    <Paneset isRoot>
      <Pane
        defaultWidth="100%"
        dismissible
        onClose={onCloseViewRequests}
        paneSub={items?.length == null ? undefined : (
          <FormattedMessage
            id="ui-inventory.instanceRecordRequestsSubtitle"
            values={{ count: items?.length }}
          />
        )}
        paneTitle={<FormattedMessage
          id="ui-inventory.instanceRecordRequestsTitle"
          values={{
            instanceResourceTitle: instance?.title,
            instancePublicationDate: instance?.publication[0]?.dateOfPublication,
          }}
        />}
      >
        {isLoading ? <Loading size="large" /> : <MultiColumnList
          columnMapping={columnMapping}
          contentData={sortedRecords}
          formatter={formatter}
          interactive={false}
          nonInteractiveHeaders={nonInteractiveHeaders}
          onHeaderClick={changeSorting}
          sortDirection={sortOrder}
          sortedColumn={sortedByColumn}
          visibleColumns={visibleColumns}
        />}
      </Pane>
    </Paneset>
  );
}

ViewRequests.propTypes = {
  instance: PropTypes.object,
  instanceId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loansMap: PropTypes.object,
  onCloseViewRequests: PropTypes.func.isRequired,
  requestsMap: PropTypes.object,
};

export default ViewRequests;
