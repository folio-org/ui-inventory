import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field, FieldArray } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import renderCreators from './creatorFields';
import renderContributors from './contributorFields';
import renderIdentifiers from './identifierFields';
import renderLanguages from './languageFields';

function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = 'Please fill this in to continue';
  }
  return errors;
}

function asyncValidate(/* values, dispatch, props, blurredField */) {
  return new Promise(resolve => resolve());
}

function InstanceForm(props) {
  const {
    handleSubmit,
    pristine,
    submitting,
    onCancel,
    initialValues,
    creatorTypes,
    contributorTypes,
    identifierTypes,
  } = props;

  /* Menus for Add Instance workflow */
  const addInstanceFirstMenu = <PaneMenu><button onClick={onCancel} title="close" aria-label="Close New Instance Dialog"><span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span></button></PaneMenu>;
  const addInstanceLastMenu = <PaneMenu><Button id="clickable-create-instance" type="submit" title="Create New Instance" disabled={pristine || submitting} onClick={handleSubmit}>Create instance</Button></PaneMenu>;
  const editInstanceLastMenu = <PaneMenu><Button id="clickable-update-instance" type="submit" title="Update Instance" disabled={pristine || submitting} onClick={handleSubmit}>Update instance</Button></PaneMenu>;
  return (
    <form>
      <Paneset isRoot>
        <Pane defaultWidth="100%" firstMenu={addInstanceFirstMenu} lastMenu={initialValues.title ? editInstanceLastMenu : addInstanceLastMenu} paneTitle={initialValues.title ? 'Edit Instance' : 'New Instance'}>
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Instance Record</h2>
              <Field label="Title *" name="title" id="input_instance_title" component={TextField} fullWidth />
            </Col>
          </Row>
          <Field type="hidden" name="source" component="input" />
          <FieldArray name="creators" component={renderCreators} creatorTypes={creatorTypes} />
          <FieldArray name="contributors" component={renderContributors} contributorTypes={contributorTypes} />
          <FieldArray name="identifiers" component={renderIdentifiers} identifierTypes={identifierTypes} />
          <FieldArray name="languages" component={renderLanguages} />
        </Pane>
      </Paneset>
    </form>
  );
}
InstanceForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newinstance: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  creatorTypes: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default stripesForm({
  form: 'instanceForm',
  validate,
  asyncValidate,
  navigationCheck: true,
})(InstanceForm);
