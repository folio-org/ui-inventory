import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstanceQuery,
  useHolding,
} from '../../common';
import ItemForm from '../../edit/items/ItemForm';
import useCallout from '../../hooks/useCallout';
import { useItemMutation } from '../hooks';
import { updateAffiliation } from '../../utils';

const CreateItem = ({
  referenceData,
  instanceId,
  holdingId,
  tenantTo,
  tenantFrom,
}) => {
  const location = useLocation();

  const { isLoading: isInstanceLoading, instance } = useInstanceQuery(instanceId, { tenantId: tenantTo });
  const { isLoading: isHoldingLoading, holding } = useHolding(holdingId, { tenantId: tenantTo });
  const callout = useCallout();
  const stripes = useStripes();

  const initialValues = useMemo(() => ({
    status: { name: 'Available' },
    holdingsRecordId: holding.id,
  }), [holding.id]);

  const goBack = useCallback(() => {
    window.location.href = `/inventory/view/${instanceId}${location.search}`;
  }, [instanceId, location.search]);

  const onCancel = useCallback(() => {
    updateAffiliation(stripes.okapi, tenantFrom, goBack);
  }, [stripes.okapi, tenantFrom, goBack]);

  const onSuccess = useCallback(async (response) => {
    const { hrid } = await response.json();

    onCancel();

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.item.successfullySaved"
        values={{ hrid }}
      />,
    });
  }, [callout, instanceId, holdingId]);

  const { mutateItem } = useItemMutation({ onSuccess });

  const onSubmit = useCallback((item) => {
    return mutateItem(item);
  }, [mutateItem]);

  if (isInstanceLoading || isHoldingLoading) return <LoadingView />;

  return (
    <ItemForm
      form={`itemform_${holding.id}`}
      id={holding.id}
      key={holding.id}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      okapi={stripes.okapi}
      instance={instance}
      holdingsRecord={holding}
      referenceTables={referenceData}
      intl={stripes.intl}
      stripes={stripes}
    />
  );
};

CreateItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  referenceData: PropTypes.object.isRequired,
  tenantTo: PropTypes.string,
  tenantFrom: PropTypes.string,
};

export default CreateItem;
