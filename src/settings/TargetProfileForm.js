import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes-core';

import {
  Button,
  Checkbox,
  Col,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  RepeatableField,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';


function massageInitialValues(values) {
  const massaged = {
    ...values,
    displayName: undefined
  };

  const asHash = values.targetOptions || {};
  const asArray = [];
  Object.keys(asHash).sort().forEach((key) => {
    asArray.push({ key, value: asHash[key] });
  });

  massaged.targetOptions = asArray;
  return massaged;
}


function massageAndSubmit(rawOnSubmit, values, ...args) {
  const asHash = {};
  values.targetOptions.forEach(entry => {
    asHash[entry.key] = entry.value;
  });
  values.targetOptions = asHash;

  return rawOnSubmit(values, ...args);
}

function makeOptions(resource) {
  return (resource.records || []).map(p => ({ value: p.id, label: p.name }));
}


const TargetProfileForm = ({ initialValues, onSubmit, onCancel, intl, resources }) => (
  <Form
    mutators={{ ...arrayMutators }}
    initialValues={massageInitialValues(initialValues)}
    onSubmit={(...args) => massageAndSubmit(onSubmit, ...args)}
  >
    {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
      <form id="form-patron-notice" noValidate data-test-notice-form onSubmit={handleSubmit}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            paneTitle={initialValues?.id
              ? initialValues?.name
              : <FormattedMessage id="stripes-components.addNew" />
            }
            firstMenu={
              <PaneMenu>
                <FormattedMessage id="stripes-components.cancel">
                  {ariaLabel => (
                    <IconButton
                      icon="times"
                      id="close-targetprofile-form-button"
                      onClick={onCancel}
                      aria-label={ariaLabel}
                    />
                  )}
                </FormattedMessage>
              </PaneMenu>
            }
            footer={
              <PaneFooter
                renderEnd={
                  <Button
                    buttonStyle="primary mega"
                    disabled={pristine || submitting}
                    marginBottom0
                    onClick={handleSubmit}
                    type="submit"
                  >
                    <FormattedMessage id="stripes-components.saveAndClose" />
                  </Button>
                }
                renderStart={
                  <Button buttonStyle="default mega" marginBottom0 onClick={onCancel}>
                    <FormattedMessage id="stripes-components.cancel" />
                  </Button>
                }
              />
            }
          >
            <Row>
              <Col xs={12}>
                <Field
                  label={<FormattedMessage id="ui-inventory.name" />}
                  name="name"
                  required
                  id="input-targetprofile-name"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.url" />}
                  name="url"
                  id="input-targetprofile-url"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.authentication" />}
                  name="authentication"
                  id="input-targetprofile-authentication"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.externalIdQueryMap" />}
                  name="externalIdQueryMap"
                  id="input-targetprofile-externalIdQueryMap"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.internalIdEmbedPath" />}
                  name="internalIdEmbedPath"
                  id="input-targetprofile-internalIdEmbedPath"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.createJobProfileId" />}
                  name="createJobProfileId"
                  id="input-targetprofile-createJobProfileId"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.updateJobProfileId" />}
                  name="updateJobProfileId"
                  id="input-targetprofile-updateJobProfileId"
                  component={TextField}
                />
                <FieldArray
                  legend={<FormattedMessage id="ui-inventory.targetOptions" />}
                  name="targetOptions"
                  id="input-targetprofile-targetOptions"
                  component={RepeatableField}
                  addLabel={<FormattedMessage id="ui-inventory.button.addTargetOption" />}
                  onAdd={fields => fields.push('')}
                  renderField={field => (
                    <Row>
                      <Col xs={3}>
                        <Field
                          component={TextField}
                          label="Key"
                          name={`${field}.key`}
                        />
                      </Col>
                      <Col xs={9}>
                        <Field
                          component={TextField}
                          label="Value"
                          name={`${field}.value`}
                        />
                      </Col>
                    </Row>
                  )}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.externalIdentifierType" />}
                  name="externalIdentifierType"
                  id="input-targetprofile-externalIdentifierType"
                  component={Select}
                  dataOptions={makeOptions(resources.identifierTypes)}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.enabled" />}
                  name="enabled"
                  id="input-targetprofile-enabled"
                  component={Checkbox}
                  type="checkbox"
                />
              </Col>
            </Row>
          </Pane>
        </Paneset>
        <Prompt
          when={!pristine && !(submitting || submitSucceeded)}
          message={intl.formatMessage({ id: 'ui-inventory.confirmDirtyNavigate' })}
        />
      </form>
    )}
  </Form>
);

TargetProfileForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    identifierTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }).isRequired
  }),
};

TargetProfileForm.manifest = Object.freeze({
  identifierTypes: {
    type: 'okapi',
    records: 'identifierTypes',
    path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
  },
});

export default stripesConnect(injectIntl(TargetProfileForm));
