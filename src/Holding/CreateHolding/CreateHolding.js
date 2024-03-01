import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import { useInstance } from '../../common/hooks';
import { useCallout, useConfigurationQuery } from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import { switchAffiliation } from '../../utils';

const CreateHolding = ({
  history,
  location,
  instanceId,
  referenceData,
  stripes,
  mutator,
}) => {
  const callout = useCallout();
  const { configs } = useConfigurationQuery('number_generator');

  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);
  const sourceId = referenceData.holdingsSourcesByName?.FOLIO?.id;
  const tenantFrom = location?.state?.tenantFrom || stripes.okapi.tenant;

  const goBack = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search: location.search,
    });
  }, [location.search, instanceId]);

  const onCancel = useCallback(async () => {
    await switchAffiliation(stripes, tenantFrom, goBack);
  }, [stripes, tenantFrom, goBack]);

  const onSubmit = useCallback((newHolding) => {
    return mutator.holding.POST(newHolding)
      .then(async (holdingsRecord) => {
        await onCancel();

        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage
            id="ui-inventory.holdingsRecord.successfullySaved"
            values={{ hrid: holdingsRecord.hrid }}
          />,
        });
      });
  }, [onCancel, callout]);

  const initialValues = useMemo(() => ({
    instanceId,
    sourceId
  }), [instanceId, sourceId]);

  if (isInstanceLoading) return <LoadingView />;

  return (
    <HoldingsForm
      configs={configs}
      form={instance.id}
      id={instance.id}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      okapi={stripes.okapi}
      instance={instance}
      referenceTables={referenceData}
      stripes={stripes}
    />
  );
};

CreateHolding.manifest = Object.freeze({
  holdingInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
  holding: {
    type: 'okapi',
    path: 'holdings-storage/holdings',
    fetch: false,
  },
});

CreateHolding.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default withRouter(stripesConnect(CreateHolding));
