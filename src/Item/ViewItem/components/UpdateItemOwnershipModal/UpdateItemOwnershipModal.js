import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Field,
  Form,
} from 'react-final-form';

import {
  Button,
  Modal,
  ModalFooter,
  Selection,
} from '@folio/stripes/components';
import {
  FieldHolding,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

import css from './UpdateItemOwnershipModal.css';

const UpdateItemOwnershipModal = ({
  isOpen,
  handleSubmit: onSubmit,
  tenantsList,
  onCancel,
  onChangeAffiliation,
  targetTenantId,
  instanceId,
}) => {
  const { formatMessage } = useIntl();
  const [targetLocation, setTargetLocation] = useState(null);
  const [targetHolding, setTargetHolding] = useState(null);
  const { locations } = useLocationsQuery({ consortium: true });

  const tenantsOptions = useMemo(() => {
    return tenantsList?.map(tenant => ({
      label: tenant.name,
      value: tenant.id,
    }));
  }, [tenantsList]);

  const onAffiliationChange = useCallback(fieldProps => value => {
    const targetTenant = tenantsList.find(tenant => tenant.id === value);

    onChangeAffiliation(targetTenant);
    fieldProps.input.onChange(value);
  }, [tenantsList]);

  const onLocationSelect = useCallback(fieldProps => (location, _f, _n, holdingId) => {
    if (!location || !holdingId) {
      setTargetHolding();
      setTargetLocation();
    }

    if (holdingId) {
      fieldProps.input.onChange(holdingId);
      setTargetHolding(holdingId);
    } else {
      setTargetLocation(location);
    }
  }, []);

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        disabled={!targetTenantId || (!targetLocation && !targetHolding)}
        onClick={() => onSubmit(targetTenantId, targetLocation, targetHolding)}
      >
        <FormattedMessage id="ui-inventory.update" />
      </Button>
      <Button onClick={onCancel}>
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={isOpen}
      label={<FormattedMessage id="ui-inventory.updateOwnership" />}
      footer={footer}
      size="small"
      contentClass={css.modalContent}
    >
      <Form
        onSubmit={onSubmit}
        render={({ values }) => (
          <>
            <Field name="affiliation">
              {fieldProps => (
                <Selection
                  {...fieldProps.input}
                  label={<FormattedMessage id="ui-inventory.affiliation" />}
                  placeholder={formatMessage({ id: 'ui-inventory.affiliation.select' })}
                  dataOptions={tenantsOptions}
                  onChange={onAffiliationChange(fieldProps)}
                  required
                />
              )}
            </Field>
            <Field name="holdings">
              {fieldProps => (
                <FieldHolding
                  {...fieldProps.input}
                  labelId="stripes-acq-components.holding.label"
                  onChange={onLocationSelect(fieldProps)}
                  locationFieldName="locationName"
                  affiliationName="affiliationName"
                  holdingName="holdingId"
                  isDisabled={!values.affiliation}
                  locationsForDict={locations}
                  instanceId={instanceId}
                  tenantId={targetTenantId}
                  required
                />
              )}
            </Field>
          </>
        )}
      />
    </Modal>
  );
};

UpdateItemOwnershipModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  tenantsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired,
  onChangeAffiliation: PropTypes.func,
  targetTenantId: PropTypes.string,
};

export default UpdateItemOwnershipModal;
