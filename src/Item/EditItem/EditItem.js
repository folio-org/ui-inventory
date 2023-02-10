import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  LoadingView,
  ErrorModal,
} from '@folio/stripes/components';

import {
  useInstanceQuery,
  useHolding,
} from '../../common';
import ItemForm from '../../edit/items/ItemForm';
import useCallout from '../../hooks/useCallout';
import { parseHttpError } from '../../utils';
import {
  useItem,
  useItemMutation,
  useBoundWithsMutation,
} from '../hooks';

const EditItem = ({
  referenceData,
  instanceId,
  holdingId,
  itemId,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [httpError, setHttpError] = useState();
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

  const onError = async error => {
    const parsedError = await parseHttpError(error.response);

    setHttpError(parsedError);
  };

  const { mutateItem } = useItemMutation({ onSuccess });

  const { mutateBoundWiths } = useBoundWithsMutation();

  const updateBoundWiths = (values) => {
    const boundWiths = {
      'itemId': values.id,
      'boundWithContents': values.boundWithTitles.map(title => {
        return {
          'holdingsRecordId': title.briefHoldingsRecord.id,
        };
      }),
    };
    return mutateBoundWiths(boundWiths);
  };

  const onSubmit = useCallback((values) => {
    if (!values.barcode) {
      delete item.barcode;
    }

    return updateBoundWiths(values)
      .then(() => mutateItem(values))
      .catch(onError);
  }, [mutateItem]);

  if (isInstanceLoading || isHoldingLoading || isItemLoading) return <LoadingView />;

  return (
    <>
      <ItemForm
        httpError={httpError}
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

EditItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  referenceData: PropTypes.object.isRequired,
};

export default EditItem;
