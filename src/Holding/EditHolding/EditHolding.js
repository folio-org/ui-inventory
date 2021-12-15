import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import {
  useHolding,
  useInstanceQuery,
} from '../../common/hooks';
import {
  useCallout,
  useHoldingItemsQuery,
  useHoldingMutation,
} from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import withLocation from '../../withLocation';

const EditHolding = ({
  goTo,
  history,
  holdingId,
  instanceId,
  location: { search, state: locationState },
  referenceTables,
}) => {
  const callout = useCallout();
  const stripes = useStripes();
  const { instance, isLoading: isInstanceLoading } = useInstanceQuery(instanceId);
  const { holding, isLoading: isHoldingLoading } = useHolding(holdingId);
  const { totalRecords: itemCount, isLoading: isItemsLoading } = useHoldingItemsQuery(holdingId, {
    searchParams: { limit: 1 },
  });

  const isMARCRecord = useMemo(() => (
    referenceTables?.holdingsSources?.find(source => source.id === holding?.sourceId)?.name === 'MARC'
  ), [holding]);

  const onCancel = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}`,
      search,
    });
  }, [search, instanceId]);

  const onSuccess = useCallback(() => {
    onCancel();

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.holdingsRecord.successfullySaved"
        values={{ hrid: holding?.hrid }}
      />,
    });
  }, [onCancel, callout]);

  const { mutateHolding } = useHoldingMutation({ onSuccess });

  const onSubmit = useCallback(holdingValues => {
    const clonedHolding = cloneDeep(holdingValues);

    if (clonedHolding.permanentLocationId === '') delete clonedHolding.permanentLocationId;
    if (clonedHolding.temporaryLocationId === '') delete clonedHolding.temporaryLocationId;

    return mutateHolding(clonedHolding);
  }, [mutateHolding]);

  if (isInstanceLoading || isItemsLoading || isHoldingLoading) return <LoadingView />;

  return (
    <HoldingsForm
      initialValues={holding}
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

EditHolding.propTypes = {
  goTo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  holdingId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
};

export default withLocation(EditHolding);
