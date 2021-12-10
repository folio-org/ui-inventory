import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep, flowRight, omit } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import useCallout from '../../hooks/useCallout';
import { useInstance } from '../../common/hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import withLocation from '../../withLocation';

const DuplicateHolding = ({
  goTo,
  history,
  instanceId,
  location: { search, state: locationState },
  mutator,
  referenceTables,
  resources,
  stripes,
}) => {
  const callout = useCallout();
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId, mutator.holdingInstance);

  const holdingRecord = resources?.holding?.records?.[0];
  const sourceId = referenceTables.holdingsSourcesByName?.FOLIO?.id;

  const initialValues = useMemo(() => ({
    ...omit(cloneDeep(holdingRecord), ['id', 'hrid', 'formerIds']),
    sourceId,
  }), [holdingRecord, sourceId]);

  const onCancel = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}`,
      search,
    });
  }, [search, instanceId]);

  const onSubmit = useCallback(holding => (
    mutator.holding.POST(holding)
      .then((record) => {
        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage
            id="ui-inventory.holdingsRecord.successfullySaved"
            values={{ hrid: record.hrid }}
          />,
        });
        goTo(`/inventory/view/${instanceId}/${record.id}`);
      })
  ), [goTo, callout]);

  if (isInstanceLoading) return <LoadingView />;

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

DuplicateHolding.manifest = Object.freeze({
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
    POST: {
      path: 'holdings-storage/holdings',
    },
  },

});

DuplicateHolding.propTypes = {
  goTo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
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
)(DuplicateHolding);
