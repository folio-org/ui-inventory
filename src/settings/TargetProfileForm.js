import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
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
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

function makeOptions(resource) {
  return (resource.records || []).map(p => ({ value: p.id, label: p.name }));
}

const TargetProfileForm = ({ initialValues, onSubmit, onCancel, intl, resources }) => (
  <Form onSubmit={onSubmit} initialValues={{ ...initialValues, displayName: undefined }}>
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
                  label={<FormattedMessage id="ui-inventory.jobProfileId" />}
                  name="jobProfileId"
                  id="input-targetprofile-jobProfileId"
                  component={TextField}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.targetOptions" />}
                  name="targetOptions"
                  id="input-targetprofile-targetOptions"
                  component={TextField}
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
