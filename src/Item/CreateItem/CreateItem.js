import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import { useNumberGeneratorOptions } from '../../common/hooks';
import {
  useInstanceQuery,
  useHolding,
} from '../../common';
import ItemForm from '../../edit/items/ItemForm';
import useCallout from '../../hooks/useCallout';
import { useItemMutation } from '../hooks';
import { switchAffiliation } from '../../utils';

const CreateItem = ({
  referenceData,
  instanceId,
  holdingId,
}) => {
  const {
    push,
    location: {
      search,
      state: {
        tenantTo,
        tenantFrom,
      } = {},
    } = {},
  } = useHistory();

  const { isLoading: isInstanceLoading, instance } = useInstanceQuery(instanceId, { tenantId: tenantTo });
  const { isLoading: isHoldingLoading, holding } = useHolding(holdingId, { tenantId: tenantTo });
  const { data: numberGeneratorData } = useNumberGeneratorOptions();
  const callout = useCallout();
  const stripes = useStripes();

  const initialValues = useMemo(() => ({
    status: { name: 'Available' },
    holdingsRecordId: holding.id,
  }), [holding.id]);

  const goBack = useCallback(() => {
    push({
      pathname: `/inventory/view/${instanceId}`,
      search,
    });
  }, [instanceId, search]);

  const onCancel = useCallback(async () => {
    await switchAffiliation(stripes, tenantFrom, goBack);
  }, [stripes, tenantFrom]);

  const onSuccess = useCallback(async (response) => {
    const { hrid } = await response.json();

    await onCancel();

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
      numberGeneratorData={numberGeneratorData}
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
};

export default CreateItem;
