import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep, omit } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import {
  useNumberGeneratorOptions,
  useHoldingQuery,
  useInstanceQuery,
} from '../../common/hooks';
import {
  useCallout,
  useHoldingMutation,
} from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import { withLocation } from '../../hocs';
import { switchAffiliation } from '../../utils';

const DuplicateHolding = ({
  goTo,
  history,
  instanceId,
  holdingId,
  location: {
    search,
    state: {
      backPathname: locationState,
      tenantFrom,
      initialTenantId,
    } = {},
  },
  referenceTables,
}) => {
  const callout = useCallout();
  const stripes = useStripes();
  const { instance, isLoading: isInstanceLoading } = useInstanceQuery(instanceId);
  const { holding, isLoading: isHoldingLoading } = useHoldingQuery(holdingId);
  const { data: numberGeneratorData } = useNumberGeneratorOptions();

  const sourceId = referenceTables.holdingsSourcesByName?.FOLIO?.id;

  const initialValues = useMemo(() => ({
    ...omit(cloneDeep(holding), ['id', 'hrid', 'formerIds']),
    sourceId,
  }), [holding, sourceId]);

  const goToDuplicatedHolding = useCallback((id) => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${id}`,
      search,
      state: { tenantTo: stripes.okapi.tenant },
    });
  }, [search, instanceId]);

  const onSuccess = useCallback(async (response) => {
    const { id, hrid } = response;

    await switchAffiliation(stripes, tenantFrom, () => goToDuplicatedHolding(id));

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.holdingsRecord.successfullySaved"
        values={{ hrid }}
      />,
    });
  }, [goTo, callout]);

  const { mutateHolding } = useHoldingMutation(stripes.okapi.tenant, { onSuccess });

  const goBack = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}`,
      search,
      state: { initialTenantId },
    });
  }, [search, instanceId]);

  const onCancel = useCallback(async () => {
    await switchAffiliation(stripes, initialTenantId, goBack);
  }, [stripes, initialTenantId, goBack]);

  const onSubmit = useCallback(holdingValues => (
    mutateHolding(holdingValues)
  ), [mutateHolding]);

  if (isInstanceLoading || isHoldingLoading) return <LoadingView />;

  return (
    <HoldingsForm
      initialValues={initialValues}
      numberGeneratorData={numberGeneratorData}
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
