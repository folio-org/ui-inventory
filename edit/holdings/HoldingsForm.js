import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field, FieldArray } from 'redux-form';
import stripesForm from '@folio/stripes-form';

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
  const addHoldingsLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-item" type="submit" title="Create New Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Create holdings record</Button></PaneMenu>;
  const editHoldingsLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-item" type="submit" title="Update Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Update holdings record</Button></PaneMenu>;

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
        <Pane
          defaultWidth="100%"
          dismissible onClose={onCancel}
          lastMenu={initialValues.id ? editHoldingsLastMenu : addHoldingsLastMenu}
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>{instance.title}</strong>
              {(instance.publication && instance.publication.length > 0) &&
                <div>
                  <em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em>
                </div>
              }
            </div>
          }
        >
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Holdings Record</h2>
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
          <Row >
            <Col sm={5} smOffset={1}>
              <Field label="Call number" name="callNumber" id="additem_callnumber" component={TextField} fullWidth />
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
  validate,
})(HoldingsForm);
