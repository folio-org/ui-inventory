import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { omit } from 'lodash';

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

const DuplicateItem = ({
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

  const initialValues = useMemo(() => {
    const duplicatedItem = omit(item, ['id', 'hrid', 'barcode']);

    duplicatedItem.status = { name: 'Available' };

    return duplicatedItem;
  }, [item]);

  const onSuccess = useCallback(async (response) => {
    const { id, hrid } = await response.json();

    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${id}`,
      search: location.search,
    });

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.item.successfullySaved"
        values={{ hrid }}
      />,
    });
  }, [callout, instanceId, holdingId]);

  const { mutateItem } = useItemMutation({ onSuccess });

  const onCancel = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${itemId}`,
      search: location.search,
    });
  }, [location.search, instanceId, holdingId, itemId]);

  const onSubmit = useCallback((values) => {
    if (!values.barcode) {
      delete values.barcode;
    }

    return mutateItem(values);
  }, [mutateItem]);

  if (isInstanceLoading || isHoldingLoading || isItemLoading) return <LoadingView />;

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
      copy
    />
  );
};

DuplicateItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  referenceData: PropTypes.object.isRequired,
};

export default DuplicateItem;
