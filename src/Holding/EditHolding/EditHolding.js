import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep, flowRight } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import useCallout from '../../hooks/useCallout';
import useHoldingItemsQuery from '../../hooks/useHoldingItemsQuery';
import { useInstance } from '../../common/hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import withLocation from '../../withLocation';

const EditHolding = ({
  goTo,
  history,
  holdingId,
  instanceId,
  location: { search, state: locationState },
  mutator,
  referenceTables,
  resources,
  stripes,
}) => {
  const callout = useCallout();
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId, mutator.holdingInstance);
  const { totalRecords: itemCount, isLoading: isItemsLoading } = useHoldingItemsQuery(holdingId, {
    searchParams: { limit: 1 },
  });

  const holdingRecord = resources?.holding?.records?.[0];
  const holdingSourceName = referenceTables?.holdingsSources?.find(source => source.id === holdingRecord?.sourceId)?.name;
  const isMARCRecord = holdingSourceName === 'MARC';

  const onCancel = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}`,
      search,
    });
  }, [search, instanceId]);

  const onSubmit = useCallback(holdingsRecord => {
    const holding = cloneDeep(holdingsRecord);

    if (holding.permanentLocationId === '') delete holding.permanentLocationId;
    if (holding.temporaryLocationId === '') delete holding.temporaryLocationId;

    return mutator.holding.PUT(holding)
      .then((record) => {
        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage
            id="ui-inventory.holdingsRecord.successfullySaved"
            values={{ hrid: record.hrid }}
          />,
        });
        onCancel();
      });
  }, [onCancel, callout]);

  if (isInstanceLoading || isItemsLoading) return <LoadingView />;

  return (
    <HoldingsForm
      initialValues={holdingRecord}
      onSubmit={onSubmit}
      onCancel={onCancel}
      okapi={stripes.okapi}
      instance={instance}
      referenceTables={referenceTables}
      stripes={stripes}
      itemCount={itemCount}
      goTo={goTo}
      isMARCRecord={isMARCRecord}
    />
  );
};

EditHolding.manifest = Object.freeze({
  holdingInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
  holding: {
    type: 'okapi',
    path: 'holdings-storage/holdings/!{holdingId}',
    fetch: true,
    throwErrors: false,
  },

});

EditHolding.propTypes = {
  goTo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  holdingId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default flowRight(
  withLocation,
  stripesConnect,
)(EditHolding);
