import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { keyBy } from 'lodash';

import {
  Accordion,
  DefaultAccordionHeader,
  Row,
  Col,
  Checkbox,
  Icon,
} from '@folio/stripes/components';
import { useLocationsQuery } from '@folio/stripes-inventory-components';

import { HoldingButtonsGroup } from './HoldingButtonsGroup';
import HoldingAccordionLabel from './HoldingAccordionLabel';

import { useHoldingItemsQuery } from '../../../hooks';

const CustomAccordionHeader = ({
  withMoveHoldingCheckbox = false,
  isHoldingSelected = false,
  onSelectHolding,
  dragHandleAttributes,
  dragHandleListeners,
  ref,
  ...headerProps
}) => {
  const intl = useIntl();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }}
    >
      {withMoveHoldingCheckbox && (
        <>
          <div
            style={{
              width: '40px',
              cursor: 'grab',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            ref={ref}
            {...dragHandleListeners}
            {...dragHandleAttributes}
          >
            <Icon
              icon="drag-drop"
              size="small"
            />
          </div>
          <span style={{ marginRight: '10px' }}>
            <Checkbox
              aria-label={intl.formatMessage({ id: 'ui-inventory.moveItems.selectHolding' })}
              checked={isHoldingSelected}
              onClick={e => {
                e.stopPropagation();
                onSelectHolding(e.target?.checked);
              }}
            />
          </span>
        </>
      )}
      <DefaultAccordionHeader {...headerProps} />
    </div>
  );
};

const HoldingAccordion = ({
  children,
  holding,
  holdings,
  onViewHolding,
  onAddItem,
  tenantId,
  isHoldingSelected,
  onSelectHolding,
  showViewHoldingsButton,
  showAddItemButton,
  pathToAccordionsState,
  withMoveHoldingCheckbox = false,
  withMoveDropdown = false,
  dragHandleAttributes,
  dragHandleListeners,
  ref,
}) => {
  const searchParams = {
    limit: 0,
    offset: 0,
  };

  const pathToAccordion = [...pathToAccordionsState, holding?.id];
  const { totalRecords, isFetching } = useHoldingItemsQuery(holding?.id, { searchParams, key: 'itemCount', tenantId });
  const { locations } = useLocationsQuery({ tenantId });

  if (!locations) return null;

  const locationsById = keyBy(locations, 'id');
  const labelLocation = locationsById[holding?.permanentLocationId];
  const labelLocationName = labelLocation?.name ?? '';

  const holdingButtonsGroup = isOpen => (
    <HoldingButtonsGroup
      holding={holding}
      holdings={holdings}
      itemCount={isFetching ? null : totalRecords}
      locationsById={locationsById}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
      withMoveDropdown={withMoveDropdown}
      isOpen={isOpen}
      tenantId={tenantId}
      showViewHoldingsButton={showViewHoldingsButton}
      showAddItemButton={showAddItemButton}
    />
  );

  const location = labelLocation?.isActive ?
    labelLocationName :
    <FormattedMessage
      id="ui-inventory.inactive.paneTitle"
      values={{
        location: labelLocationName,
      }}
    />;

  const accId = pathToAccordion.join('.');
  const accordionLabel = (
    <HoldingAccordionLabel
      location={location}
      holding={holding}
    />
  );
  const accHeader = (headerProps) => {
    return (
      <CustomAccordionHeader
        {...headerProps}
        withMoveHoldingCheckbox={withMoveHoldingCheckbox}
        isHoldingSelected={isHoldingSelected}
        onSelectHolding={onSelectHolding}
        dragHandleAttributes={dragHandleAttributes}
        dragHandleListeners={dragHandleListeners}
        ref={ref}
      />
    );
  };

  return (
    <Accordion
      id={accId}
      header={accHeader}
      label={accordionLabel}
      displayWhenOpen={holdingButtonsGroup(true)}
      displayWhenClosed={holdingButtonsGroup(false)}
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

HoldingAccordion.propTypes = {
  children: PropTypes.oneOf([PropTypes.node, PropTypes.func]),
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
  isHoldingSelected: PropTypes.bool,
  onSelectHolding: PropTypes.func,
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  withMoveHoldingCheckbox: PropTypes.bool,
  withMoveDropdown: PropTypes.bool,
};

export default HoldingAccordion;
