import React, { useCallback, useRef, useState } from 'react';
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

import { useNumberGeneratorOptions } from '../../common/hooks';
import {
  useInstanceQuery,
  useHoldingQuery,
} from '../../common';
import ItemForm from '../../edit/items/ItemForm';
import useCallout from '../../hooks/useCallout';
import { parseHttpError } from '../../utils';
import {
  useItemQuery,
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
  const keepEditing = useRef(false);
  const { isLoading: isInstanceLoading, instance } = useInstanceQuery(instanceId);
  const { isLoading: isHoldingLoading, holding } = useHoldingQuery(holdingId);
  const { isFetching: isItemLoading, item, refetch: refetchItem } = useItemQuery(itemId);
  const { data: numberGeneratorData } = useNumberGeneratorOptions();
  const callout = useCallout();
  const stripes = useStripes();

  const setKeepEditing = useCallback((value) => {
    keepEditing.current = value;
  }, []);

  const goBack = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${itemId}`,
      search: location.search,
      state: {
        tenantTo: stripes.okapi.tenant,
        initialTenantId: location?.state?.initialTenantId,
      },
    });
  }, [location.search, instanceId, holdingId, itemId]);

  const onSuccess = useCallback(() => {
    if (!keepEditing.current) {
      goBack();
    } else {
      refetchItem();
    }

    return callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.item.successfullySaved"
        values={{ hrid: item.hrid }}
      />,
    });
  }, [goBack, refetchItem, callout, item]);

  const onError = async error => {
    const parsedError = await parseHttpError(error.response);

    setHttpError(parsedError);
  };

  const { mutateItem } = useItemMutation({ onSuccess });

  const { mutateBoundWiths } = useBoundWithsMutation();

  const updateBoundWiths = (values) => {
    // Skip update if there are no bound-with parts before or after
    if (!item.boundWithTitles?.length && !values.boundWithTitles?.length) {
      return Promise.resolve();
    }

    if (values.boundWithTitles === undefined) {
      values.boundWithTitles = [];
    }

    // Filter out any bound-with holdings that could not be identified
    values.boundWithTitles = values.boundWithTitles.filter(title => title.briefInstance);

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
        numberGeneratorData={numberGeneratorData}
        onSubmit={onSubmit}
        onCancel={goBack}
        okapi={stripes.okapi}
        instance={instance}
        holdingsRecord={holding}
        referenceTables={referenceData}
        intl={stripes.intl}
        stripes={stripes}
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

EditItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  referenceData: PropTypes.object.isRequired,
};

export default EditItem;
