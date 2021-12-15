import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
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
import {
  useItem,
  useItemMutation,
} from '../hooks';

const EditItem = ({
  referenceData,
  instanceId,
  holdingId,
  itemId,
}) => {
  const history = useHistory();
  const location = useLocation();

  const { isLoading: isInstanceLoading, instance } = useInstanceQuery(instanceId);
  const { isLoading: isHoldingLoading, holding } = useHolding(holdingId);
  const { isLoading: isItemLoading, item } = useItem(itemId);
  const callout = useCallout();
  const stripes = useStripes();

  const onCancel = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${itemId}`,
      search: location.search,
    });
  }, [location.search, instanceId, holdingId, itemId]);


  const onSuccess = useCallback(() => {
    onCancel();

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.item.successfullySaved"
        values={{ hrid: item.hrid }}
      />,
    });
  }, [callout, instanceId, holdingId]);

  const { mutateItem } = useItemMutation({ onSuccess });

  const onSubmit = useCallback((values) => {
    if (!values.barcode) {
      delete item.barcode;
    }

    return mutateItem(values);
  }, [mutateItem]);

  if (isInstanceLoading || isHoldingLoading || isItemLoading) return <LoadingView />;

  return (
    <ItemForm
      form={`itemform_${holding.id}`}
      id={holding.id}
      key={holding.id}
      initialValues={item}
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

EditItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  referenceData: PropTypes.object.isRequired,
};

export default EditItem;
