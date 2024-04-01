import {
  useCallback,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  MCLPagingTypes,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { useConsortiumItems } from '../../../../hooks';
import ItemBarcode from '../../ItemBarcode';

import { hasMemberTenantPermission } from '../../../../utils';
import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  ITEM_TABLE_PAGE_AMOUNT,
} from '../../../../constants';

const LimitedItemsList = ({
  instance,
  holding,
  tenantId,
  userTenantPermissions,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const canViewItems = hasMemberTenantPermission('ui-inventory.instance.view', tenantId, userTenantPermissions);

  const [offset, setOffset] = useState(0);
  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  });

  const searchParams = {
    sortBy: itemsSorting.column,
    sortOrder: itemsSorting.isDesc ? 'desc' : 'asc',
    limit: 200,
    offset,
  };

  const {
    items,
    totalRecords,
    isFetching,
  } = useConsortiumItems(instance.id, holding.id, tenantId, { searchParams });

  const onNeedMoreData = (askAmount, _index, _firstIndex, direction) => {
    const amount = (direction === 'next') ? askAmount : -askAmount;
    setOffset(offset + amount);
  };

  const onHeaderClick = useCallback((e, { name: column }) => {
    const isChangeDirection = itemsSorting.column === column;

    const newItemsSorting = {
      column: isChangeDirection ? itemsSorting.column : column,
      isDesc: isChangeDirection ? !itemsSorting.isDesc : true,
    };

    setItemsSorting(newItemsSorting);
  }, [itemsSorting]);

  const formatter = {
    barcode: item => (
      <ItemBarcode
        item={item}
        location={location}
        holdingId={holding.id}
        instanceId={instance.id}
        isBarcodeAsHotlink={canViewItems}
        tenantId={tenantId}
      />
    ),
    status: () => <NoValue />,
    copyNumber: () => <NoValue />,
    loanType: () => <NoValue />,
    effectiveLocation: () => <NoValue />,
    enumeration: () => <NoValue />,
    chronology: () => <NoValue />,
    volume: () => <NoValue />,
    yearCaption: () => <NoValue />,
    materialType: () => <NoValue />,
  };
  const visibleColumns = [
    'barcode',
    'status',
    'copyNumber',
    'loanType',
    'effectiveLocation',
    'enumeration',
    'chronology',
    'volume',
    'yearCaption',
    'materialType',
  ];
  const nonInteractiveHeaders = [
    'status',
    'copyNumber',
    'loanType',
    'effectiveLocation',
    'enumeration',
    'chronology',
    'volume',
    'yearCaption',
    'materialType',
  ];
  const columnMapping = {
    'barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
    'status': intl.formatMessage({ id: 'ui-inventory.status' }),
    'copyNumber': intl.formatMessage({ id: 'ui-inventory.copyNumber' }),
    'loanType': intl.formatMessage({ id: 'ui-inventory.loanType' }),
    'effectiveLocation': intl.formatMessage({ id: 'ui-inventory.effectiveLocationShort' }),
    'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
    'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
    'volume': intl.formatMessage({ id: 'ui-inventory.volume' }),
    'yearCaption': intl.formatMessage({ id: 'ui-inventory.yearCaption' }),
    'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
  };
  const pagingCanGoPrevious = offset > 0;
  const pagingCanGoNext = offset < totalRecords && totalRecords - offset > ITEM_TABLE_PAGE_AMOUNT;

  return (
    <MultiColumnList
      columnIdPrefix={`list-items-${holding.id}`}
      contentData={items}
      formatter={formatter}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={{ barcode: '350px' }}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.items' })}
      interactive={false}
      onNeedMoreData={onNeedMoreData}
      pagingType={MCLPagingTypes.PREV_NEXT}
      totalCount={totalRecords}
      nonInteractiveHeaders={nonInteractiveHeaders}
      onHeaderClick={onHeaderClick}
      sortDirection={itemsSorting.isDesc ? 'descending' : 'ascending'}
      sortedColumn={itemsSorting.column}
      pageAmount={ITEM_TABLE_PAGE_AMOUNT}
      pagingCanGoPrevious={pagingCanGoPrevious}
      pagingCanGoNext={pagingCanGoNext}
      pagingOffset={offset}
      loading={isFetching}
    />
  );
};

LimitedItemsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LimitedItemsList;
