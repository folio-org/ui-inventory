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
  checkIfUserInMemberTenant,
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
  parseHttpError,
} from '../../utils';
import useLoadSubInstances from '../../hooks/useLoadSubInstances';
import useCallout from '../../hooks/useCallout';
import { useInstanceMutation } from '../../hooks';

const InstanceEdit = ({
  instanceId,
  referenceData,
  stripes,
}) => {
  const { identifierTypesById, identifierTypesByName } = referenceData ?? {};
  const [httpError, setHttpError] = useState();
  const [initialValues, setInitialValues] = useState();
  const callout = useCallout();
  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);
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

  const onSuccess = useCallback(() => {
    const message = instance?.shared ? (
      <FormattedMessage id="ui-inventory.instance.shared.successfulySaved" />
    ) : (
      <FormattedMessage
        id="ui-inventory.instance.successfullySaved"
        values={{ hrid: instance.hrid }}
      />
    );

    callout.sendCallout({
      type: 'success',
      message,
    });
    goBack();
  }, [callout, goBack]);

  const onError = async error => {
    const parsedError = await parseHttpError(error);
    setHttpError(parsedError);
  };

  const isMemberTenant = checkIfUserInMemberTenant(stripes);
  const tenantId = (isMemberTenant && instance?.shared) ? stripes.user.user.consortium.centralTenantId : stripes.okapi.tenant;

  const { mutateInstance } = useInstanceMutation({
    options: { onSuccess, onError },
    tenantId,
  });

  const onSubmit = useCallback((initialInstance) => {
    const updatedInstance = marshalInstance(initialInstance, identifierTypesByName);

    return mutateInstance(updatedInstance);
  }, [mutateInstance]);

  if (isInstanceLoading) return <LoadingView />;

  if (!instance) return null;

  return (
    <>
      <InstanceForm
        onSubmit={onSubmit}
        httpError={httpError}
        initialValues={initialValues}
        instanceSource={instance?.source}
        referenceTables={referenceData}
        stripes={stripes}
        onCancel={goBack}
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
  referenceData: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default withRouter(stripesConnect(InstanceEdit));
