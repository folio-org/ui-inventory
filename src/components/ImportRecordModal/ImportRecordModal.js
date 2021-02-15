import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes-core';
import { Loading, Modal, ModalFooter, TextField, Button } from '@folio/stripes/components';

const ImportRecordModal = ({
  isOpen,
  currentExternalIdentifier, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
  resources,
}) => {
  const containerContainer = resources.copycatProfiles.records;
  console.log('containerContainer =', containerContainer);
  const container = containerContainer && containerContainer.length ? containerContainer[0] : undefined;
  const nprofiles = container?.totalRecords;
  const profiles = container?.profiles;
  console.log(' nprofiles =', nprofiles, ' -- profiles =', profiles);

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
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {nprofiles === 1 ? (
                <>
                  <input
                    type="hidden"
                    name="externalIdentifierType1"
                    value={profiles[0].externalIdentifierType}
                  />
                  <Field
                    name="externalIdentifierType2"
                    component={TextField}
                    label={<FormattedMessage id="ui-inventory.externalIdentifierType" />}
                    value={profiles[0].externalIdentifierType}
                  />
                  <Field
                    component="input"
                    type="hidden"
                    name="externalIdentifierType3"
                    value={profiles[0].externalIdentifierType}
                  />
                  <Field name="externalIdentifierType4">
                    {(props2) => (
                      <input
                        type="hidden"
                        {...props2.input}
                        value={profiles[0].externalIdentifierType}
                      />
                    )}
                  </Field>
                  <p>one profile with ID {profiles[0].externalIdentifierType}</p>
                </>
              ) : (
                <p>dropdown of {nprofiles} profiles</p>
              )}
              <Field
                name="externalIdentifier"
                component={TextField}
                label={<FormattedMessage id="ui-inventory.copycat.externalIdentifier" />}
                autoFocus
              />
              <ModalFooter>
                <Button buttonStyle="primary" onClick={() => handleSubmit()}>
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
  resources: PropTypes.shape({
    copycatProfiles: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }).isRequired
  }).isRequired,
};

ImportRecordModal.manifest = Object.freeze({
  copycatProfiles: {
    type: 'okapi',
    path: 'copycat/profiles?query=enabled=true',
  },
});

export default stripesConnect(ImportRecordModal);
