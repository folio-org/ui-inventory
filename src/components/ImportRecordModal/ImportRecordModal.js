import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Loading, Modal, Select, TextField, ModalFooter, Button } from '@folio/stripes/components';

import { buildQueryByIds } from '../../utils';

// upper limit of how many job profiles may be retrieved for a given target.
// a limit clause is required to return anything other than the default number
// of records.
//
// 60 is not an arbitrary number; it's a back-of-the-envelope calculation
// intended to make sure we stay under the query-string's length-limit.
// see also stripes-core/src/queries/useChunkedCQLFetch.js
const COPYCAT_PROFILE_LIMIT = 60;

const ImportRecordModal = ({
  isOpen,
  currentExternalIdentifier, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
  id,
  mutator,
  resources,
}) => {
  const intl = useIntl();
  const copycatProfiles = resources?.copycatProfiles.records;
  const container = copycatProfiles && copycatProfiles.length ? copycatProfiles[0] : undefined;
  const profiles = container?.profiles;

  const [jobProfiles, setJobProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(profiles ? profiles[0] : {});

  const options = !profiles ? [] : profiles.map(p => ({ value: p.id, label: p.name }));
  const profileById = Object.fromEntries(options.map(o => [o.value, o.label]));

  const getJobProfilesOptions = (arr = []) => {
    const sortedOptions = [...arr];
    const defaultProfileId = id ? currentProfile.updateJobProfileId : currentProfile.createJobProfileId;
    const defaultProfile = sortedOptions.find(profile => profile.value === defaultProfileId);
    defaultProfile.label = intl.formatMessage({ id: 'ui-inventory.copycat.defaultJobProfile' }, { jobProfile: defaultProfile.label });
    const indexOfDefault = sortedOptions.findIndex(option => option.value === defaultProfileId);

    sortedOptions.splice(indexOfDefault, 1);
    sortedOptions.unshift(defaultProfile);

    return sortedOptions;
  };

  useEffect(() => {
    setCurrentProfile(profiles ? profiles[0] : {});
  }, [profiles]);

  useEffect(() => {
    const allowedJobProfileIds = id ? currentProfile?.allowedUpdateJobProfileIds : currentProfile?.allowedCreateJobProfileIds;

    if (!isEmpty(allowedJobProfileIds)) {
      mutator.jobProfiles.GET({
        params: {
          query: `${buildQueryByIds(allowedJobProfileIds)} sortBy name`,
          limit: COPYCAT_PROFILE_LIMIT,
        }
      }).then(response => {
        const optionsForSelect = response.jobProfiles?.map(profile => ({
          value: profile.id,
          label: profile.name,
        }));

        if (!isEmpty(optionsForSelect)) {
          const sortedOptions = getJobProfilesOptions(optionsForSelect);
          setJobProfiles(sortedOptions);
        }
      });
    }
  }, [id, currentProfile?.allowedCreateJobProfileIds, currentProfile?.allowedUpdateJobProfileIds]);

  const modalTitle = id
    ? <FormattedMessage id="ui-inventory.copycat.reimport" />
    : <FormattedMessage id="ui-inventory.singleRecordImport" />;

  const onIdentifierTypeChange = useCallback(
    fieldProps => e => {
      const identifierTypeId = e.target.value;

      fieldProps.input.onChange(identifierTypeId);
      setCurrentProfile(profiles.find(profile => profile.id === identifierTypeId));
    },
    [profiles],
  );
  const onJobProfileChange = useCallback(
    fieldProps => e => { fieldProps.input.onChange(e.target.value); },
    [],
  );

  return (
    <Modal
      id="import-record-modal"
      open={isOpen}
      label={modalTitle}
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
                  {props2 => (
                    <Select
                      {...props2.input}
                      label={<FormattedMessage id="ui-inventory.copycat.externalTarget" />}
                      dataOptions={options}
                      onChange={onIdentifierTypeChange(props2)}
                    />
                  )}
                </Field>
              )}
              {currentProfile && (
                <>
                  <Field name="selectedJobProfileId" initialValue={jobProfiles[0]?.value}>
                    {fieldProps => (
                      <Select
                        {...fieldProps.input}
                        label={<FormattedMessage id={`ui-inventory.copycat.${id ? 'overlayJobProfileToBeUsed' : 'jobProfileToBeUsed'}`} />}
                        dataOptions={jobProfiles}
                        onChange={onJobProfileChange(fieldProps)}
                      />
                    )}
                  </Field>
                  <Field
                    name="externalIdentifier"
                    component={TextField}
                    label={
                      <FormattedMessage
                        id="ui-inventory.copycat.enterIdentifier"
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
  mutator: PropTypes.object.isRequired,
};

ImportRecordModal.manifest = Object.freeze({
  copycatProfiles: {
    type: 'okapi',
    path: 'copycat/profiles?query=enabled=true sortby name&limit=1000',
  },
  jobProfiles: {
    type: 'okapi',
    path: 'data-import-profiles/jobProfiles',
    accumulate: true,
  },
});

export default stripesConnect(ImportRecordModal);
