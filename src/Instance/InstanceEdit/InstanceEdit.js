import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingView,
  ErrorModal,
} from '@folio/stripes/components';

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';
import InstanceForm from '../../edit/InstanceForm';
import {
  marshalInstance,
  unmarshalInstance,
} from '../../utils';
import useLoadSubInstances from '../../hooks/useLoadSubInstances';
import useCallout from '../../hooks/useCallout';

const InstanceEdit = ({
  instanceId,
  referenceData,
  stripes,
  mutator,
}) => {
  const { identifierTypesById, identifierTypesByName } = referenceData;
  const [httpError, setHttpError] = useState();
  const [initialValues, setInitialValues] = useState();
  const callout = useCallout();
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

  const onSuccess = useCallback((updatedInstance) => {
    callout.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.instance.successfullySaved"
        values={{ hrid: updatedInstance.hrid }}
      />,
    });
    goBack();
  }, [callout, goBack]);

  const onSubmit = useCallback((updatedInstance) => {
    return mutator.instanceEdit.PUT(marshalInstance(updatedInstance, identifierTypesByName))
      .then(() => onSuccess(updatedInstance))
      .catch(err => setHttpError(err));
  }, [identifierTypesByName, setHttpError]);

  if (isInstanceLoading) return <LoadingView />;

  if (!instance) return null;

  return (
    <>
      <InstanceForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        instanceSource={instance?.source}
        referenceTables={referenceData}
        stripes={stripes}
        onCancel={goBack}
      />
      { httpError &&
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
