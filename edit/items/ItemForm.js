import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, FieldArray } from 'redux-form';
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
import ConfirmationModal from '@folio/stripes-components/lib/ConfirmationModal';

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
  return fetch(`${okapi.url}/inventory/items?query=(barcode=="${barcode}")`,
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
              const error = { barcode: barcodeTakenMsg };
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
      confirmPermanentLocation: false,
      confirmTemporaryLocation: false,
    };
  }

  componentDidMount() {
    const { initialValues } = this.props;
    const prevPermanentLocation = initialValues.permanentLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevPermanentLocation });

    const prevTemporaryLocation = initialValues.temporaryLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevTemporaryLocation });
  }

  selectPermanentLocation(permanentLocation) {
    if (!permanentLocation) {
      this.props.change('permanentLocation', {});
      return;
    }

    if (permanentLocation.isActive) {
      setTimeout(() => this.props.change('permanentLocation.id', permanentLocation.id));
      this.setState({ prevPermanentLocation: permanentLocation });
    } else {
      this.setState({ confirmPermanentLocation: true, permanentLocation });
    }
  }

  selectTemporaryLocation(temporaryLocation) {
    if (!temporaryLocation) {
      this.props.change('temporaryLocation', {});
      return;
    }

    if (temporaryLocation.isActive) {
      setTimeout(() => this.props.change('temporaryLocation.id', temporaryLocation.id));
      this.setState({ prevTemporaryLocation: temporaryLocation });
    } else {
      this.setState({ confirmTemporaryLocation: true, temporaryLocation });
    }
  }

  confirmPermanentLocation(confirm) {
    const { permanentLocation, prevPermanentLocation } = this.state;
    const confirmPermanentLocation = false;
    const value = (confirm) ? permanentLocation.id : prevPermanentLocation.id;
    const prevPermanentLoc = (confirm) ? permanentLocation : prevPermanentLocation;

    setTimeout(() => this.props.change('permanentLocation.id', value));
    this.setState({ confirmPermanentLocation, prevPermanentLocation: prevPermanentLoc });
  }

  confirmTemporaryLocation(confirm) {
    const { temporaryLocation, prevTemporaryLocation } = this.state;
    const confirmTemporaryLocation = false;
    const value = (confirm) ? temporaryLocation.id : prevTemporaryLocation.id;
    const prevTemporaryLoc = (confirm) ? temporaryLocation : prevTemporaryLocation;

    setTimeout(() => this.props.change('temporaryLocation.id', value));
    this.setState({ confirmTemporaryLocation, prevTemporaryLocation: prevTemporaryLoc });
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

    const { confirmPermanentLocation, confirmTemporaryLocation } = this.state;
    const { locationsById } = referenceTables;
    const holdingLocation = locationsById[holdingsRecord.permanentLocationId];

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

    const labelLocation = get(holdingLocation, ['name'], '');
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
                  label={`${formatMsg({ id: 'ui-inventory.materialType' })} *`}
                  name="materialType.id"
                  id="additem_materialType"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectMaterialType' }), value: '' }, ...materialTypeOptions]}
                />
                <Field
                  label={`${formatMsg({ id: 'ui-inventory.loanTypePermanent' })} *`}
                  name="permanentLoanType.id"
                  id="additem_loanTypePerm"
                  component={Select}
                  fullWidth
                  dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectLoanType' }), value: '' }, ...loanTypeOptions]}
                />
                <Field label={formatMsg({ id: 'ui-inventory.barcode' })} name="barcode" id="additem_barcode" component={TextField} required fullWidth />
                <Field
                  label={formatMsg({ id: 'ui-inventory.permanentLocation' })}
                  placeholder={formatMsg({ id: 'ui-inventory.selectLocation' })}
                  name="permanentLocation.id"
                  id="additem_permanentlocation"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                  onSelect={loc => this.selectPermanentLocation(loc)}
                />
                <LocationLookup onLocationSelected={loc => this.selectPermanentLocation(loc)} />

                <Field
                  label={formatMsg({ id: 'ui-inventory.temporaryLocation' })}
                  placeholder={formatMsg({ id: 'ui-inventory.selectLocation' })}
                  name="temporaryLocation.id"
                  id="additem_temporarylocation"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                  onSelect={loc => this.selectTemporaryLocation(loc)}
                />
                <LocationLookup onLocationSelected={loc => this.selectTemporaryLocation(loc)} />

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
              id="confirmPermanentLocationModal"
              open={confirmPermanentLocation}
              heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
              buttonStyle="default"
              cancelButtonStyle="primary"
              onConfirm={() => { this.confirmPermanentLocation(true); }}
              onCancel={() => { this.confirmPermanentLocation(false); }}
            />
            <ConfirmationModal
              id="confirmTemporaryLocationModal"
              open={confirmTemporaryLocation}
              heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
              buttonStyle="default"
              cancelButtonStyle="primary"
              onConfirm={() => { this.confirmTemporaryLocation(true); }}
              onCancel={() => { this.confirmTemporaryLocation(false); }}
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
