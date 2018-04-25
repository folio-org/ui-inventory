import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, FieldArray, SubmissionError } from 'redux-form';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import stripesForm from '@folio/stripes-form';
import LocationSelection from '@folio/stripes-smart-components/lib/LocationSelection';
import LocationLookup from '@folio/stripes-smart-components/lib/LocationLookup';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';

import renderNotes from './noteFields';
import renderPieceIdentifiers from './pieceIdentifierFields';


function validate(values) {
  const errors = {};
  const selectToContinueMsg = <FormattedMessage id="ui-inventory.selectToContinue" />;

  if (!(values.materialType && values.materialType.id)) {
    errors.materialType = { id: selectToContinueMsg };
  }

  if (!(values.permanentLoanType && values.permanentLoanType.id)) {
    errors.permanentLoanType = { id: selectToContinueMsg };
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
  const barcodeTakenMsg = props.intl.formatMessage({ id: 'ui-inventory.barcodeTaken' });

  if (blurredField === 'barcode' && values.barcode !== props.initialValues.barcode) {
    return new Promise((resolve, reject) => {
      // TODO: Should use stripes-connect (dispatching an action and update state)
      checkUniqueBarcode(props.okapi, values.barcode).then((response) => {
        if (response.status >= 400) {
          //
        } else {
          response.json().then((json) => {
            if (json.totalRecords > 0) {
              const error = new SubmissionError({ barcode: barcodeTakenMsg });
              reject(error);
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

class ItemForm extends React.Component {
  constructor() {
    super();
    this.state = {
      confirmLocation: false,
    };
  }

  componentDidMount() {
    const { initialValues } = this.props;
    const prevLocation = initialValues.temporaryLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevLocation });
  }

  selectLocation(location) {
    if (!location.id) return;

    if (location.isActive) {
      setTimeout(() => this.props.change('temporaryLocation.id', location.id));
      this.setState({ prevLocation: location });
    } else {
      this.setState({ confirmLocation: true, location });
    }
  }

  confirmLocation(confirm) {
    const { location, prevLocation } = this.state;
    const confirmLocation = false;
    const value = (confirm) ? location.id : prevLocation.id;
    const prevLoc = (confirm) ? location : prevLocation;

    setTimeout(() => this.props.change('temporaryLocation.id', value));
    this.setState({ confirmLocation, prevLocation: prevLoc });
  }

  render() {
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
      copy,
    } = this.props;
    const formatMsg = this.props.intl.formatMessage;

    const { confirmLocation } = this.state;

    /* Menus for Add Item workflow */
    const addItemLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-item" type="submit" title="Create New Item" disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Create item</Button></PaneMenu>;
    const editItemLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-item" type="submit" title="Update Item" disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Update item</Button></PaneMenu>;

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

    const labelLocation = holdingsRecord.permanentLocationId ? referenceTables.shelfLocations.find(loc => holdingsRecord.permanentLocationId === loc.id).name : '';
    const labelCallNumber = holdingsRecord.callNumber || '';

    return (
      <form>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            lastMenu={(initialValues.id) ? editItemLastMenu : addItemLastMenu}
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
                <h2>
                  <FormattedMessage id="ui-inventory.itemRecord" />
                </h2>
              </Col>
            </Row>
            <Row >
              <Col sm={5} smOffset={1}>
                {/* <Field label="Material Type" name="materialType.name" id="additem_materialType" component={TextField} fullWidth /> */}
                <Field
                  label={formatMsg({ id: 'ui-inventory.materialType' })}
                  name="materialType.id"
                  id="additem_materialType"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectMaterialType' }), value: '' }, ...materialTypeOptions]}
                />
                <Field
                  label={formatMsg({ id: 'ui-inventory.loanTypePermanent' })}
                  name="permanentLoanType.id"
                  id="additem_loanTypePerm"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectLoanType' }), value: '' }, ...loanTypeOptions]}
                />
                <Field label={formatMsg({ id: 'ui-inventory.barcode' })} name="barcode" id="additem_barcode" component={TextField} required fullWidth />

                <Field
                  label={formatMsg({ id: 'ui-inventory.temporaryLocation' })}
                  placeholder={formatMsg({ id: 'ui-inventory.selectTemporaryLocation' })}
                  name="temporaryLocation.id"
                  id="additem_location"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                  onChange={loc => this.selectLocation(loc)}
                />
                <LocationLookup temporary onLocationSelected={loc => this.selectLocation(loc)} />

                <Field label={formatMsg({ id: 'ui-inventory.status' })} name="status.name" id="additem_status" component={TextField} disabled fullWidth />
                <Field
                  label={formatMsg({ id: 'ui-inventory.loanTypeTemporary' })}
                  name="temporaryLoanType.id"
                  id="additem_loanTypeTemp"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectLoanType' }), value: '' }, ...loanTypeOptions]}
                />
                <Field
                  label={formatMsg({ id: 'ui-inventory.enumeration' })}
                  name="enumeration"
                  id="additem_enumeration"
                  component={TextField}
                  fullWidth
                />
                <Field
                  label={formatMsg({ id: 'ui-inventory.chronology' })}
                  name="chronology"
                  id="additem_chronology"
                  component={TextField}
                  fullWidth
                />
                <Field
                  label={formatMsg({ id: 'ui-inventory.numberOfPieces' })}
                  name="numberOfPieces"
                  id="additem_numberofpieces"
                  component={TextField}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={8} smOffset={1}>
                <FieldArray name="notes" component={renderNotes} formatMsg={formatMsg} />
              </Col>
            </Row>
            <Row>
              <Col sm={8} smOffset={1}>
                <FieldArray name="pieceIdentifiers" component={renderPieceIdentifiers} formatMsg={formatMsg} />
              </Col>
            </Row>

            <ConfirmationModal
              open={confirmLocation}
              heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
              onConfirm={() => { this.confirmLocation(true); }}
              onCancel={() => { this.confirmLocation(false); }}
            />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

ItemForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newItem: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  change: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  copy: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default stripesForm({
  form: 'itemForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['barcode'],
  navigationCheck: true,
  enableReinitialize: true,
})(ItemForm);
