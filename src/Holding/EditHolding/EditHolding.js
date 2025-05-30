import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import { LoadingView, ErrorModal } from '@folio/stripes/components';

import {
  useHoldingQuery,
  useInstanceQuery,
  useNumberGeneratorOptions,
} from '../../common/hooks';
import {
  useCallout,
  useHoldingItemsQuery,
  useHoldingMutation,
} from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import { withLocation } from '../../hocs';
import { parseHttpError } from '../../utils';

const EditHolding = ({
  goTo,
  history,
  holdingId,
  instanceId,
  location,
  referenceTables,
}) => {
  const callout = useCallout();
  const {
    search,
    state: {
      backPathname: locationState,
      initialTenantId,
    } = {},
  } = location;
  const stripes = useStripes();
  const [httpError, setHttpError] = useState();
  const keepEditing = useRef(false);
  const { instance, isLoading: isInstanceLoading } = useInstanceQuery(instanceId);
  const { holding, isFetching: isHoldingLoading, refetch: refetchHolding } = useHoldingQuery(holdingId);
  const { totalRecords: itemCount, isLoading: isItemsLoading } = useHoldingItemsQuery(holdingId, {
    searchParams: { limit: 1 },
  });
  const { data: numberGeneratorData } = useNumberGeneratorOptions();

  const setKeepEditing = useCallback((value) => {
    keepEditing.current = value;
  }, []);

  const isMARCRecord = useMemo(() => (
    referenceTables?.holdingsSources?.find(source => source.id === holding?.sourceId)?.name === 'MARC'
  ), [holding]);

  const goBack = useCallback(() => {
    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${instanceId}/${holdingId}`,
      search,
      state: { initialTenantId },
    });
  }, [search, instanceId, holdingId]);

  const onSuccess = useCallback(() => {
    if (!keepEditing.current) {
      goBack();
    } else {
      refetchHolding();
    }

    callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.holdingsRecord.successfullySaved"
        values={{ hrid: holding?.hrid }}
      />,
    });
  }, [goBack, refetchHolding, holding, callout]);

  const onError = async error => {
    const parsedError = await parseHttpError(error.response);
    setHttpError(parsedError);
  };

  const { mutateHolding } = useHoldingMutation(stripes.okapi.tenant, { onSuccess });

  const onSubmit = useCallback(holdingValues => {
    const clonedHolding = cloneDeep(holdingValues);

    if (clonedHolding.permanentLocationId === '') delete clonedHolding.permanentLocationId;
    if (clonedHolding.temporaryLocationId === '') delete clonedHolding.temporaryLocationId;

    return mutateHolding(clonedHolding).catch(onError);
  }, [mutateHolding]);

  if (isInstanceLoading || isItemsLoading || isHoldingLoading) return <LoadingView />;

  return (
    <>
      <HoldingsForm
        httpError={httpError}
        location={location}
        numberGeneratorData={numberGeneratorData}
        initialValues={holding}
        onSubmit={onSubmit}
        onCancel={goBack}
        okapi={stripes.okapi}
        instance={instance}
        referenceTables={referenceTables}
        stripes={stripes}
        itemCount={itemCount}
        goTo={goTo}
        isMARCRecord={isMARCRecord}
        setKeepEditing={setKeepEditing}
        showKeepEditingButton
      />
      {httpError && !httpError?.errorType &&
        <ErrorModal
          open
          label={<FormattedMessage id="ui-inventory.instance.saveError" />}
          content={httpError?.status ? `${httpError.status}: ${httpError.message}` : httpError.message}
          onClose={() => setHttpError()}
        />
      }
    </>
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
