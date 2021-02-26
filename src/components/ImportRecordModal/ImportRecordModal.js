import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes-core';
import { Loading, Modal, Select, TextField, ModalFooter, Button } from '@folio/stripes/components';

const ImportRecordModal = ({
  isOpen,
  currentExternalIdentifier, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
  id,
  resources,
}) => {
  const containerContainer = resources?.copycatProfiles.records;
  const container = containerContainer && containerContainer.length ? containerContainer[0] : undefined;
  const profiles = container?.profiles;
  const currentProfile = profiles ? profiles[0] : undefined;
  const options = !profiles ? [] : profiles.map(p => ({ value: p.id, label: p.name }));
  const profileById = Object.fromEntries(options.map(o => [o.value, o.label]));

  return (
    <Modal
      id="import-record-modal"
      open={isOpen}
      label={<FormattedMessage id="ui-inventory.singleRecordImport" />}
      dismissible
      size="small"
      onClose={handleCancel}
    >
      {!profiles ? <Loading /> : (
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              {!profiles || profiles.length === 0 ? (
                <p>
                  <FormattedMessage id="ui-inventory.copycat.noProfiles" />
                </p>
              ) : profiles.length === 1 ? (
                <Field name="externalIdentifierType" initialValue={currentProfile.id}>
                  {props2 => <input type="hidden" {...props2.input} />}
                </Field>
              ) : (
                <Field name="externalIdentifierType" initialValue={currentProfile.id}>
                  {props2 => <Select {...props2.input} dataOptions={options} />}
                </Field>
              )}
              {currentProfile && (
                <Field
                  name="externalIdentifier"
                  component={TextField}
                  label={
                    <FormattedMessage
                      id={`ui-inventory.copycat.enterIdentifier${id ? 'ForUpdate' : ''}`}
                      values={{ identifierName: profileById[values.externalIdentifierType] }}
                    />}
                  autoFocus
                />
              )}
              <ModalFooter>
                <Button buttonStyle="primary" disabled={!values.externalIdentifier} onClick={() => handleSubmit()}>
                  <FormattedMessage id="ui-inventory.copycat.import" />
                </Button>
                <Button onClick={handleCancel}>
                  <FormattedMessage id="ui-inventory.cancel" />
                </Button>
              </ModalFooter>
            </form>
          )}
        />
      )}
    </Modal>
  );
};

ImportRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentExternalIdentifier: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  id: PropTypes.string, // only when updating an existing record
  resources: PropTypes.shape({
    copycatProfiles: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }).isRequired
  }),
};

ImportRecordModal.manifest = Object.freeze({
  copycatProfiles: {
    type: 'okapi',
    path: 'copycat/profiles?query=enabled=true',
  },
});

export default stripesConnect(ImportRecordModal);
