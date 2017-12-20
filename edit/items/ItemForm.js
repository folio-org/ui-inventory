import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field, FieldArray } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import renderNotes from './noteFields';
import renderPieceIdentifiers from './pieceIdentifierFields';


function validate(values) {
  const errors = {};

  if (!values.materialTypeId) {
    errors.materialTypeId = 'Please select to continue';
  }

  if (!values.permanentLoanTypeId) {
    errors.permanentLoanTypeId = 'Please select to continue';
  }

  return errors;
}

function checkUniqueBarcode(okapi, barcode) {
  return fetch(`${okapi.url}/inventory/items?query=(barcode="${barcode}")`,
    { headers: Object.assign({}, {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json' }),
    },
  );
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
    reset,  // eslint-disable-line no-unused-vars
    pristine,
    submitting,
    onCancel,
    initialValues,
    instance,
    holdingsRecord,
    referenceTables,
  } = props;

  /* Menus for Add Item workflow */
  const addItemFirstMenu = <PaneMenu><button onClick={onCancel} title="close" aria-label="Close New Item Dialog"><span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span></button></PaneMenu>;
  const addItemLastMenu = <PaneMenu><Button id="clickable-create-item" type="submit" title="Create New Item" disabled={pristine || submitting} onClick={handleSubmit}>Create item</Button></PaneMenu>;
  const editItemLastMenu = <PaneMenu><Button id="clickable-update-item" type="submit" title="Update Item" disabled={pristine || submitting} onClick={handleSubmit}>Update item</Button></PaneMenu>;
  const materialTypeOptions = referenceTables.materialTypes ?
        referenceTables.materialTypes.map((t) => {
          let selectedValue;
          if (initialValues.materialType) {
            selectedValue = initialValues.materialType.id === t.id;
          }
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

  return (
    <form>
      <Paneset isRoot>
        <Pane defaultWidth="100%" firstMenu={addItemFirstMenu} lastMenu={(initialValues.id) ? editItemLastMenu : addItemLastMenu} paneTitle={(initialValues.id) ? 'Edit Item' : 'New Item'}>
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Item Record</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={2} smOffset={1}>
              <KeyValue label="Title" value={instance.title} />
            </Col>
            <Col sm={2}>
              <KeyValue label="Call Number" value={holdingsRecord.callNumber} />
            </Col>
            <Col sm={2}>
              <KeyValue
                label="Location"
                value={holdingsRecord.permanentLocationId ?
                  referenceTables.shelfLocations.find(loc => loc.id === holdingsRecord.permanentLocationId).name
                  :
                  null}
              />
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
              <Field label="Barcode" name="barcode" id="additem_barcode" component={TextField} required fullWidth />
              <Field
                label="Temporary Location"
                name="temporaryLocation.id"
                id="additem_location"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select temporary location', value: '' }, ...temporaryLocationOptions]}
              />
              <Field label="Status" name="status.name" id="additem_status" component={TextField} disabled fullWidth />
              <Field
                label="Loan Type (Permanent) *"
                name="permanentLoanType.id"
                id="additem_loanTypePerm"
                component={Select}
                fullWidth
                dataOptions={[{ label: 'Select loan type', value: '' }, ...loanTypeOptions]}
              />
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
