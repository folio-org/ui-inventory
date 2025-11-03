import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { keyBy } from 'lodash';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  Col,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';
import { useLocationsQuery } from '@folio/stripes-inventory-components';

import HoldingAccordionLabel from '../HoldingsList/Holding/HoldingAccordionLabel';
import useHoldingItemsQuery from '../../hooks/useHoldingItemsQuery';
import useReferenceData from '../../hooks/useReferenceData';
import useBoundWithHoldings from '../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';

import {
  getColumnMapping,
  getColumnWidths,
  getFormatter,
  getTableAria,
  getVisibleColumns,
} from '../ItemsList/utils';


const HoldingsHeaderAcc = ({
  holding,
  tenantId,
  children,
}) => {
  const { locations } = useLocationsQuery({ tenantId });

  if (!locations) return null;

  const locationsById = keyBy(locations, 'id');
  const labelLocation = locationsById[holding?.permanentLocationId];
  const labelLocationName = labelLocation?.name ?? '';

  const location = labelLocation?.isActive ? labelLocationName : (
    <FormattedMessage
      id="ui-inventory.inactive.paneTitle"
      values={{
        location: labelLocationName,
      }}
    />
  );

  const accordionLabel = (
    <HoldingAccordionLabel
      location={location}
      holding={holding}
    />
  );

  return (
    <Accordion
      id={`${holding?.id}-accordion`}
      label={accordionLabel}
      closedByDefault
    >
      {open => (
        open && (
          <Row>
            <Col sm={12}>
              {children}
            </Col>
          </Row>
        )
      )}
    </Accordion>
  );
};

HoldingsHeaderAcc.propTypes = {
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

const ItemsList = ({
  id,
  holding,
  tenantId,
}) => {
  const intl = useIntl();
  const { locationsById } = useReferenceData();

  const searchParams = useMemo(() => ({
    sortBy: 'order',
    limit: 200,
    offset: 0,
  }), []);
  const { items, isFetching } = useHoldingItemsQuery(holding.id, { searchParams, key: 'items', tenantId });
  const { boundWithHoldings: holdings } = useBoundWithHoldings(items, tenantId);

  const holdingsMapById = keyBy(holdings, 'id');

  const formatter = getFormatter(
    intl,
    id,
    locationsById,
    holdingsMapById,
    false,
    isFetching,
    tenantId,
  );

  return (
    <MultiColumnList
      id={`modal-list-items-${holding.id}`}
      columnIdPrefix={`modal-list-items-${holding.id}`}
      contentData={items}
      formatter={formatter}
      visibleColumns={getVisibleColumns()}
      columnMapping={getColumnMapping(intl)}
      ariaLabel={getTableAria(intl)}
      interactive={false}
      columnWidths={getColumnWidths()}
      loading={isFetching}
    />
  );
};

ItemsList.propTypes = {
  id: PropTypes.string.isRequired,
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string,
};

const ModalHoldingsList = ({
  holdings,
  instanceId,
}) => {
  const stripes = useStripes();
  const tenantId = stripes.okapi.tenantId;

  const renderHoldings = (holding) => {
    return (
      <HoldingsHeaderAcc
        holding={holding}
        tenantId={tenantId}
      >
        <ItemsList
          id={holding?.id}
          instanceId={instanceId}
          holding={holding}
          tenantId={tenantId}
          isBarcodeAsHotlink={false}
          isItemsMovement={false}
        />
      </HoldingsHeaderAcc>
    );
  };

  return holdings.map((holding) => renderHoldings(holding));
};

ModalHoldingsList.propTypes = {
  holdings: PropTypes.arrayOf(PropTypes.object).isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default ModalHoldingsList;
