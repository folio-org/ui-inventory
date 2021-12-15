import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep, omit } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import {
  useHolding,
  useInstanceQuery,
} from '../../common/hooks';
import {
  useCallout,
  useHoldingMutation,
} from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import withLocation from '../../withLocation';

const DuplicateHolding = ({
  goTo,
  history,
  instanceId,
  holdingId,
  location: { search, state: locationState },
  referenceTables,
}) => {
  const callout = useCallout();
  const stripes = useStripes();
  const { instance, isLoading: isInstanceLoading } = useInstanceQuery(instanceId);
  const { holding, isLoading: isHoldingLoading } = useHolding(holdingId);

  const sourceId = referenceTables.holdingsSourcesByName?.FOLIO?.id;

  const initialValues = useMemo(() => ({
    ...omit(cloneDeep(holding), ['id', 'hrid', 'formerIds']),
    sourceId,
  }), [holding, sourceId]);

  const onSuccess = useCallback(async (response) => {
    const { id, hrid } = await response.json();

    goTo(`/inventory/view/${instanceId}/${id}`);

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.holdingsRecord.successfullySaved"
        values={{ hrid }}
      />,
    });
  }, [goTo, callout]);

  const { mutateHolding } = useHoldingMutation({ onSuccess });

  const onCancel = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}`,
      search,
    });
  }, [search, instanceId]);

  const onSubmit = useCallback(holdingValues => (
    mutateHolding(holdingValues)
  ), [mutateHolding]);

  if (isInstanceLoading || isHoldingLoading) return <LoadingView />;

  return (
    <HoldingsForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      okapi={stripes.okapi}
      instance={instance}
      referenceTables={referenceTables}
      stripes={stripes}
      copy
      goTo={goTo}
    />
  );
};

DuplicateHolding.propTypes = {
  goTo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  holdingId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
};

export default withLocation(DuplicateHolding);
