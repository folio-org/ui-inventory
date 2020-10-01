import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';

import ItemForm from '../../edit/items/ItemForm';

const CreateItem = ({
  history,
  location,

  stripes,
  referenceData,
  mutator,
  instanceId,
  holdingId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [instance, setInstance] = useState({});
  const [holding, setHolding] = useState({});

  const initialValues = useMemo(() => ({
    status: { name: 'Available' },
    holdingsRecordId: holding.id,
  }), [holding.id]);

  useEffect(() => {
    setIsLoading(true);

    const instancePromise = mutator.itemInstance.GET();
    const holdingPromise = mutator.itemHolding.GET();

    Promise.all([instancePromise, holdingPromise])
      .then(([instanceData, holdingData]) => {
        setInstance(instanceData);
        setHolding(holdingData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [holdingId, instanceId]);

  const onCancel = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search: location.search,
    });
  }, [location.search, instanceId]);

  const onSubmit = useCallback(async (item) => {
    // for (let i = 0; i < 230; i++) {
    //   await mutator.item.POST({
    //     ...item,
    //     barcode: `${i}${item.barcode}`.padStart(6, '0'),
    //   });
    // }
    mutator.item.POST(item)
      .then(() => {
        onCancel();
      });
  }, [onCancel]);

  if (isLoading) return <LoadingView />;

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

CreateItem.manifest = Object.freeze({
  itemInstance: {
    type: 'okapi',
    path: 'inventory/instances/!{instanceId}',
    accumulate: true,
  },
  itemHolding: {
    type: 'okapi',
    path: 'holdings-storage/holdings/!{holdingId}',
    accumulate: true,
  },
  item: {
    type: 'okapi',
    path: 'inventory/items',
    fetch: false,
  },
});

CreateItem.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  instanceId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default withRouter(stripesConnect(CreateItem));
