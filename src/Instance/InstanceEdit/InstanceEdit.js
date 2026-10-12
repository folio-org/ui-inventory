import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

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
import { useInstanceMutation } from '../hooks';

import css from './InstanceEdit.css';

const InstanceEdit = ({
  instanceId,
  referenceData,
  stripes,
}) => {
  const { formatMessage } = useIntl();
  const {
    identifierTypesById,
    identifierTypesByName,
    instanceDateTypesByCode,
  } = referenceData ?? {};
  const [httpError, setHttpError] = useState();
  const [initialValues, setInitialValues] = useState();
  const callout = useCallout();
  const keepEditing = useRef(false);
  const { instance, isFetching: isInstanceLoading, refetch: refetchInstance } = useInstance(instanceId);
  const parentInstances = useLoadSubInstances(instance?.parentInstances, 'superInstanceId');
  const childInstances = useLoadSubInstances(instance?.childInstances, 'subInstanceId');

  const setKeepEditing = useCallback((value) => {
    keepEditing.current = value;
  }, []);

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

    if (!keepEditing.current) {
      goBack();
    } else {
      refetchInstance();
    }
  }, [callout, goBack]);

  const onError = async error => {
    const response = await error.response;
    const parsedError = await parseHttpError(response);
    const defaultErrorMessage = formatMessage({ id: 'ui-inventory.communicationProblem' });
    const err = {
      errorType: parsedError?.errorType,
      message: parsedError?.message || parsedError?.errors?.[0]?.message || defaultErrorMessage,
      status: response?.status,
    };

    setHttpError(err);
  };

  const getErrorModalContent = () => {
    return (
      <div className={css.errorModalContent}>
        {httpError?.status ? `${httpError.status}: ${httpError.message}` : httpError.message}
      </div>
    );
  };

  const isMemberTenant = checkIfUserInMemberTenant(stripes);
  const tenantId = (isMemberTenant && instance?.shared) ? stripes.user.user.consortium?.centralTenantId : stripes.okapi.tenant;

  const { mutateInstance } = useInstanceMutation({
    options: { onSuccess },
    tenantId,
  });

  const onSubmit = useCallback(async (initialInstance) => {
    const updatedInstance = marshalInstance(initialInstance, identifierTypesByName, instanceDateTypesByCode);

    return mutateInstance(updatedInstance).catch(onError);
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
        setKeepEditing={setKeepEditing}
        showKeepEditingButton
      />
      {httpError && !httpError?.errorType &&
        <ErrorModal
          open
          label={<FormattedMessage id="ui-inventory.instance.saveError" />}
          content={getErrorModalContent()}
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
