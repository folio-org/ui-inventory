import React, {
  useCallback,
  useEffect,
  useState,
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

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';
import DataContext from '../../contexts/DataContext';
import InstanceForm from '../../edit/InstanceForm';
import {
  marshalInstance,
  unmarshalInstance,
} from '../../utils';
import useLoadSubInstances from '../../hooks/useLoadSubInstances';

const InstanceEdit = ({
  instanceId,
  referenceData,
  stripes,
  mutator,
}) => {
  const { identifierTypesById, identifierTypesByName } = referenceData;

  const [initialValues, setInitialValues] = useState();
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId, mutator.instanceEdit);
  const parentInstances = useLoadSubInstances(instance?.parentInstances, 'superInstanceId');
  const childInstances = useLoadSubInstances(instance?.childInstances, 'subInstanceId');

  useEffect(() => {
    setInitialValues({
      ...unmarshalInstance(instance, identifierTypesById),
      parentInstances,
      childInstances,
    });
  }, [instance, identifierTypesById, parentInstances, childInstances]);

  const goBack = useGoBack(`/inventory/view/${instanceId}`);

  const onSubmit = useCallback((updatedInstance) => {
    return mutator.instanceEdit.PUT(marshalInstance(updatedInstance, identifierTypesByName))
      .then(() => {
        goBack();
      });
  }, [goBack, identifierTypesByName]);

  if (isInstanceLoading) return <LoadingView />;

  if (!instance) return null;

  return (
    <DataContext.Provider value={referenceData}>
      <InstanceForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        instanceSource={instance?.source}
        referenceTables={referenceData}
        stripes={stripes}
        onCancel={goBack}
      />
    </DataContext.Provider>
  );
};

InstanceEdit.manifest = Object.freeze({
  instanceEdit: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
});

InstanceEdit.propTypes = {
  instanceId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default withRouter(stripesConnect(InstanceEdit));
