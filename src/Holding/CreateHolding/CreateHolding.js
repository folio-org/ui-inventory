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
import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstance,
} from '../../common/hooks';
import useCallout from '../../hooks/useCallout';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import { updateAffiliation } from '../../utils';

const CreateHolding = ({
  location,
  instanceId,
  referenceData,
  stripes,
  mutator,
  tenantFrom,
}) => {
  const callout = useCallout();
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);
  const sourceId = referenceData.holdingsSourcesByName?.FOLIO?.id;

  const goBack = useCallback(() => {
    window.location.href = `/inventory/view/${instanceId}${location.search}`;
  }, [location.search, instanceId]);

  const onCancel = useCallback(() => {
    updateAffiliation(stripes.okapi, tenantFrom, goBack);
  }, [stripes.okapi, tenantFrom, goBack]);

  const onSubmit = useCallback((newHolding) => {
    return mutator.holding.POST(newHolding)
      .then((holdingsRecord) => {
        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage
            id="ui-inventory.holdingsRecord.successfullySaved"
            values={{ hrid: holdingsRecord.hrid }}
          />,
        });
        onCancel();
      });
  }, [onCancel, callout]);

  const initialValues = useMemo(() => ({
    instanceId,
    sourceId
  }), [instanceId, sourceId]);

  if (isInstanceLoading) return <LoadingView />;

  return (
    <HoldingsForm
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
  instanceId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  tenantFrom: PropTypes.string,
};

export default withRouter(stripesConnect(CreateHolding));
