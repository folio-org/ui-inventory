import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes/core';
import { Loading, Modal, Select, TextField, ModalFooter, Button } from '@folio/stripes/components';
import { isEmpty } from 'lodash';
import { fetchJobProfiles } from '../../utils';

const ImportRecordModal = ({
  isOpen,
  currentExternalIdentifier, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
  id,
  resources,
  stripes,
}) => {
  const intl = useIntl();
  const [createJobProfiles, setCreateJobProfiles] = useState([]);
  const containerContainer = resources?.copycatProfiles.records;
  const container = containerContainer && containerContainer.length ? containerContainer[0] : undefined;
  const profiles = container?.profiles;
  const currentProfile = profiles ? profiles[0] : undefined;
  const options = !profiles ? [] : profiles.map(p => ({ value: p.id, label: p.name }));
  const profileById = Object.fromEntries(options.map(o => [o.value, o.label]));

  const sortOptions = (arr) => {
    console.log(arr);
    console.log(currentProfile);
    const defaultProfile = arr?.find(profile => profile.value === currentProfile.createJobProfileId);
    defaultProfile.label = intl.formatMessage({ id: 'ui-inventory.copycat.defaultJobProfile' }, { jobProfile: defaultProfile.label });
    return arr;
  };

  const getJobProfilesForCreate = (ids) => {
    fetchJobProfiles(ids || [], stripes.okapi)
      .then(response => {
        const optionsForSelect = response?.jobProfiles?.map(profile => ({
          value: profile.id,
          label: profile.name,
        }));

        if (!isEmpty(optionsForSelect)) {
          const sortedOptions = sortOptions(optionsForSelect);
          setCreateJobProfiles(sortedOptions);
        }
      });
  };

  useEffect(() => {
    getJobProfilesForCreate(currentProfile?.allowedCreateJobProfileIds);
  }, [currentProfile?.allowedCreateJobProfileIds]);

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
                  {props2 => <Select
                    {...props2.input}
                    dataOptions={options}
                    onChange={(e) => {
                      props2.input.onChange(e.target.value);
                      getJobProfilesForCreate(profiles.find(item => item.id === e.target.value).allowedCreateJobProfileIds);
                    }}
                  />}
                </Field>
              )}
              {currentProfile && (
                <>
                  <Field
                    name="createJobProfileId"
                    component={Select}
                    initialValue={createJobProfiles[0]}
                    dataOptions={createJobProfiles}
                    label={<FormattedMessage id="ui-inventory.copycat.jobProfileToBeUsed" />}
                  />
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
                </>
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
  stripes: PropTypes.object.isRequired,
};

ImportRecordModal.manifest = Object.freeze({
  copycatProfiles: {
    type: 'okapi',
    path: 'copycat/profiles?query=enabled=true sortby name&limit=1000',
  },
});

export default stripesConnect(ImportRecordModal);
