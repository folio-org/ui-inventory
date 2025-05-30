import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Label,
  Loading,
} from '@folio/stripes/components';
import { itemStatuses } from '@folio/stripes-inventory-components';

import { itemStatusesMap } from '../../../../constants';
import { getDateWithTime } from '../../../../utils';

const label = <FormattedMessage id="ui-inventory.item.availability.itemStatus" />;

const ItemStatus = ({
  itemId,
  status,
  mutator,
  openLoan = {},
}) => {
  const [servicePoint, setServicePoint] = useState();

  useEffect(
    () => {
      setServicePoint();

      if (status?.name === itemStatusesMap.IN_TRANSIT) {
        mutator.item.GET({
          path: `item-storage/items/${itemId}`,
        })
          .then(({ inTransitDestinationServicePointId }) => (
            mutator.servicePoint.GET({
              path: `service-points/${inTransitDestinationServicePointId}`,
            })
          ))
          .then(setServicePoint)
          .catch(() => {
            setServicePoint({});
          });
      } else setServicePoint({});
    },
    [itemId, status],
  );

  if (!servicePoint) {
    return (
      <>
        <Label>
          {label}
        </Label>
        <Loading />
      </>
    );
  }

  const itemStatus = status?.name === itemStatusesMap.IN_TRANSIT
    ? <FormattedMessage id="ui-inventory.item.status.inTransitTo" values={{ servicePoint: servicePoint.name }} />
    : <FormattedMessage id={itemStatuses.find(({ value }) => value === status?.name).label} />;

  return (
    <KeyValue
      label={label}
      value={openLoan.id
        ? <Link to={`/users/view/${openLoan.userId}?filters=&layer=loan&loan=${openLoan.id}&query=&sort=`}>{itemStatus}</Link>
        : itemStatus
      }
      subValue={
        <FormattedMessage
          id="ui-inventory.item.status.statusUpdatedLabel"
          values={{ statusDate: getDateWithTime(status?.date) }}
        />
      }
    />
  );
};

ItemStatus.manifest = Object.freeze({
  item: {
    accumulate: true,
    fetch: false,
    throwErrors: false,
    type: 'okapi',
  },
  servicePoint: {
    accumulate: true,
    fetch: false,
    throwErrors: false,
    type: 'okapi',
  },
});

ItemStatus.propTypes = {
  itemId: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  openLoan: PropTypes.object,
};

export default stripesConnect(ItemStatus);
