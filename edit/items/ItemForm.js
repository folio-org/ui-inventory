import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';
import renderNotes from './noteFields';
import renderPieceIdentifiers from './pieceIdentifierFields';


function validate(values) {
  const errors = {};

  if (!(values.materialType && values.materialType.id)) {
    errors.materialType = { id: 'Please select to continue' };
  }

  if (!(values.permanentLoanType && values.permanentLoanType.id)) {
    errors.permanentLoanType = { id: 'Please select to continue' };
  }

  if (!(values.status && values.status.name)) {
    errors.status = { name: 'Please fill this in to continue' };
  }

  return errors;
}

function checkUniqueBarcode(okapi, barcode) {
  return fetch(`${okapi.url}/inventory/items?query=(barcode="${barcode}")`,
    { headers: Object.assign({}, { 'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json' }) });
}

function asyncValidate(values, dispatch, props, blurredField) {
  if (blurredField === 'barcode' && values.barcode !== props.initialValues.barcode) {
    return new Promise((resolve, reject) => {
      // TODO: Should use stripes-connect (dispatching an action and update state)
      checkUniqueBarcode(props.okapi, values.barcode).then((response) => {
        if (response.status >= 400) {
          console.log('Error fetching barcode');
        } else {
          response.json().then((json) => {
            if (json.totalRecords > 0) {
              reject({ barcode: 'This barcode has already been taken' });
            } else {
              resolve();
            }
          });
        }
      });
    });
  }
  return new Promise(resolve => resolve());
}

function ItemForm(props) {
  const {
    handleSubmit,
    reset, // eslint-disable-line no-unused-vars
    pristine,
    submitting,
    onCancel,
    initialValues,
    instance,
    holdingsRecord,
    referenceTables,
  } = props;

  /* Menus for Add Item workflow */
  const addItemLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-item" type="submit" title="Create New Item" disabled={pristine || submitting} onClick={handleSubmit}>Create item</Button></PaneMenu>;
  const editItemLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-item" type="submit" title="Update Item" disabled={pristine || submitting} onClick={handleSubmit}>Update item</Button></PaneMenu>;

  const materialTypeOptions = referenceTables.materialTypes ?
    referenceTables.materialTypes.map((t) => {
      let selectedValue;
      if (initialValues.materialType) { selectedValue = initialValues.materialType.id === t.id; }
      return {
        label: t.name,
        value: t.id,
        selected: selectedValue,
      };
    }) : [];
  const loanTypeOptions = (referenceTables.loanTypes || []).map(t => ({
    label: t.name,
    value: t.id,
    selected: (initialValues.loanType) ? initialValues.loanType.id === t.id : false,
  }));

  const temporaryLocationOptions = (referenceTables.shelfLocations || []).map(l => ({
    label: l.name,
    value: l.id,
    selected: (initialValues.temporaryLocation) ? initialValues.temporaryLocation.id === l.id : false,
  }));

  const labelLocation = holdingsRecord.permanentLocationId ? referenceTables.shelfLocations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : '';
  const labelCallNumber = holdingsRecord.callNumber || '';

  return (
    <form>
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          dismissible
          onClose={onCancel}
          lastMenu={(initialValues.title) ? editItemLastMenu : addItemLastMenu}
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <em>{instance.title}</em>
              {(instance.publication && instance.publication.length > 0) &&
              <span><em>, </em><em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em></span>
              }
              <div>
                {`Holdings: ${labelLocation} > ${labelCallNumber}`}
              </div>
            </div>
          }
        >
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Item Record</h2>
            </Col>
          </Row>
          <Row >
            <Col sm={5} smOffset={1}>
              {/* <Field label="Material Type" name="materialType.name" id="additem_materialType" component={TextField} fullWidth /> */}
              <Field
                label="Material Type *"
                name="materialType.id"
                id="additem_materialType"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select material type', value: '' }, ...materialTypeOptions]}
              />
              <Field
                label="Loan Type (Permanent) *"
                name="permanentLoanType.id"
                id="additem_loanTypePerm"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select loan type', value: '' }, ...loanTypeOptions]}
              />
              <Field label="Barcode" name="barcode" id="additem_barcode" component={TextField} required fullWidth />
              <Field
                label="Temporary Location"
                name="temporaryLocation.id"
                id="additem_location"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select temporary location', value: '' }, ...temporaryLocationOptions]}
              />
              <Field label="Status" name="status.name" id="additem_status" component={TextField} fullWidth />
              <Field
                label="Loan Type (Temporary)"
                name="temporaryLoanType.id"
                id="additem_loanTypeTemp"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select loan type', value: '' }, ...loanTypeOptions]}
              />
              <Field
                label="Enumeration"
                name="enumeration"
                id="additem_enumeration"
                component={TextField}
                fullWidth
              />
              <Field
                label="Chronology"
                name="chronology"
                id="additem_chronology"
                component={TextField}
                fullWidth
              />
              <Field
                label="Number of pieces"
                name="numberOfPieces"
                id="additem_numberofpieces"
                component={TextField}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={8} smOffset={1}>
              <FieldArray name="notes" component={renderNotes} />
            </Col>
          </Row>
          <Row>
            <Col sm={8} smOffset={1}>
              <FieldArray name="pieceIdentifiers" component={renderPieceIdentifiers} />
            </Col>
          </Row>

        </Pane>
      </Paneset>
    </form>
  );
}

ItemForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newItem: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
};

export default stripesForm({
  form: 'itemForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['barcode'],
  navigationCheck: true,
  enableReinitialize: true,
})(ItemForm);
