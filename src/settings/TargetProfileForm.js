import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';

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
  TextField,
} from '@folio/stripes/components';

const TargetProfileForm = ({ initialValues, onSubmit, onCancel, intl }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
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
              <Col xs={8} data-test-notice-template-name>
                <Field
                  label={<FormattedMessage id="ui-inventory.name" />}
                  name="name"
                  required
                  id="input-targetprofile-name"
                  component={TextField}
                />
              </Col>
              <Col xs={4}>
                <Field
                  label={<FormattedMessage id="ui-inventory.enabled" />}
                  name="enabled"
                  id="input-targetprofile-enabled"
                  component={Checkbox}
                  defaultChecked={initialValues?.enabled}
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
};

export default injectIntl(TargetProfileForm);
