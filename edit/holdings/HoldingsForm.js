import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from 'react-flexbox-grid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field, FieldArray } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import formatters from '../../referenceFormatters';

import renderStatements from './holdingsStatementFields';

// eslint-disable-next-line no-unused-vars
function validate(values) {
  const errors = {};

  if (!values.permanentLocationId) {
    errors.permanentLocationId = 'Please select to continue';
  }

  return errors;
}


function HoldingsForm(props) {
  const {
    handleSubmit,
    reset,  // eslint-disable-line no-unused-vars
    pristine,
    submitting,
    onCancel,
    initialValues,
    instance,
    referenceTables,
  } = props;

  /* Menus for Add Item workflow */
  const addHoldingsFirstMenu = <PaneMenu><button onClick={onCancel} title="close" aria-label="Close New Holdings Dialog"><span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span></button></PaneMenu>;
  const addHoldingsLastMenu = <PaneMenu><Button id="clickable-create-item" type="submit" title="Create New Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Create holdings record</Button></PaneMenu>;
  const editHoldingsLastMenu = <PaneMenu><Button id="clickable-update-item" type="submit" title="Update Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Update holdings record</Button></PaneMenu>;

  const permanentLocationOptions = (referenceTables.shelfLocations || []).map(l => ({
    label: l.name,
    value: l.id,
    selected: initialValues.permanentLocationId ? initialValues.permanentLocationId === l.id : false,
  }));

  const platformOptions = (referenceTables.platforms || []).map(l => ({
    label: l.name,
    value: l.id,
    selected: initialValues.electronicLocation ? initialValues.electronicLocation.platformId === l.id : false,
  }));

  return (
    <form>
      <Paneset isRoot>
        <Pane defaultWidth="100%" firstMenu={addHoldingsFirstMenu} lastMenu={initialValues.id ? editHoldingsLastMenu : addHoldingsLastMenu} paneTitle={initialValues.title ? 'Edit Holdings' : 'New Holdings Record'}>
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Holdings Record</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={2} smOffset={1}>
              <KeyValue label="Title" value={instance.title} />
            </Col>
            <Col sm={2}>
              <KeyValue label="Resource Type" value={formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)} />
            </Col>
            <Col sm={2}>
              <KeyValue label="Format" value={formatters.instanceFormatsFormatter(instance, referenceTables.instanceFormats)} />
            </Col>
          </Row>
          <Row >
            <Col sm={5} smOffset={1}>
              <Field label="Call number" name="callNumber" id="additem_callnumber" component={TextField} fullWidth />
            </Col>
          </Row>
          <Row >
            <Col sm={5} smOffset={1}>
              <Field
                label="Permanent Location"
                name="permanentLocationId"
                id="additem_permanentlocation"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select permanent location', value: '' }, ...permanentLocationOptions]}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={5} smOffset={1}>
              <Field
                label="Platform"
                name="electronicLocation.platformId"
                id="additem_platformid"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select platform', value: '' }, ...platformOptions]}
              />
              <Field
                label="URI"
                name="electronicLocation.uri"
                id="additem_uri"
                component={TextField}
                fullWidth
              />
            </Col>
          </Row>
          <FieldArray name="holdingsStatements" component={renderStatements} />
        </Pane>
      </Paneset>
    </form>
  );
}

HoldingsForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newHoldingsRecord: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  instance: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
};

export default stripesForm({
  form: 'holdingsForm',
  navigationCheck: true,
})(HoldingsForm);
