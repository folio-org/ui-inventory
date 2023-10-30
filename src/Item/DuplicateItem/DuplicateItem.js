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

import { itemStatusesMap } from '../../constants';
import { switchAffiliation } from '../../utils';

const OMITTED_INITIAL_FIELDS = ['id', 'hrid', 'barcode', 'lastCheckIn'];

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
    const duplicatedItem = omit(item, OMITTED_INITIAL_FIELDS);

    duplicatedItem.status = { name: itemStatusesMap.AVAILABLE };

    return duplicatedItem;
  }, [item]);

  const goToDuplicatedItem = useCallback((id) => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${id}`,
      search: location.search,
      state: { tenantTo: stripes.okapi.tenant },
    });
  }, [location.search, instanceId]);

  const onSuccess = useCallback(async (response) => {
    const { id, hrid } = await response.json();

    await switchAffiliation(stripes, location?.state?.tenantFrom, () => goToDuplicatedItem(id));

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.item.successfullySaved"
        values={{ hrid }}
      />,
    });
  }, [callout, instanceId, holdingId]);

  const { mutateItem } = useItemMutation({ onSuccess });

  const goBack = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${itemId}`,
      search: location.search,
      state: { tenantTo: stripes.okapi.tenant },
    });
  }, [location.search, instanceId, holdingId, itemId]);

  const onCancel = useCallback(async () => {
    await switchAffiliation(stripes, location?.state?.tenantFrom, goBack);
  }, [stripes, location?.state?.tenantFrom, goBack]);

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
