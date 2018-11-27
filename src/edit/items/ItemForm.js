import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, FieldArray } from 'redux-form';
import {
  Paneset,
  Pane,
  PaneMenu,
  Row,
  Col,
  Button,
  Icon,
  TextField,
  Select,
  ConfirmationModal,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import {
  LocationSelection,
  LocationLookup,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import renderNotes from './renderNotes';
import PieceIdentifiers from './PieceIdentifiers';


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
    {
      headers: Object.assign({}, {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json',
      })
    });
}

function asyncValidate(values, dispatch, props, blurredField) {
  const barcodeTakenMsg = <FormattedMessage id="ui-inventory.barcodeTaken" />;

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
  constructor(props) {
    super(props);
    this.state = {
      confirmPermanentLocation: false,
      confirmTemporaryLocation: false,
    };
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
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

  getActionMenu = ({ onToggle }) => {
    const { onCancel } = this.props;
    return (
      <Button
        data-test-inventory-cancel-item-edit-action
        buttonStyle="dropdownItem"
        onClick={() => {
          onCancel();
          onToggle();
        }}
      >
        <Icon icon="hollowX">
          <FormattedMessage id="ui-inventory.cancel" />
        </Icon>
      </Button>
    );
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      onCancel,
      initialValues,
      instance,
      holdingsRecord,
      referenceTables: {
        locationsById,
        materialTypes,
        loanTypes = [],
      },
      copy,
      intl: { formatMessage },
    } = this.props;

    const {
      confirmPermanentLocation,
      confirmTemporaryLocation,
    } = this.state;

    const holdingLocation = locationsById[holdingsRecord.permanentLocationId];

    /* Menus for Add Item workflow */
    const addItemLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-create-item"
          type="submit"
          title="Create New Item"
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          Create item
        </Button>
      </PaneMenu>
    );

    const editItemLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-update-item"
          type="submit"
          title="Update Item"
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          Update item
        </Button>
      </PaneMenu>
    );

    const materialTypeOptions = materialTypes ?
      materialTypes.map((t) => {
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

    const loanTypeOptions = loanTypes.map(t => ({
      label: t.name,
      value: t.id,
      selected: (initialValues.loanType) ? initialValues.loanType.id === t.id : false,
    }));

    const labelLocation = get(holdingLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';

    return (
      <form data-test-item-page-type={initialValues.id ? 'edit' : 'create'}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            lastMenu={(initialValues.id) ? editItemLastMenu : addItemLastMenu}
            paneTitle={
              <div
                style={{ textAlign: 'center' }}
                data-test-header-title
              >
                <em>{instance.title}</em>
                {(instance.publication && instance.publication.length > 0) &&
                  <span>
                    <em>, </em>
                    <em>
                      {instance.publication[0].publisher}
                      {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                    </em>
                  </span>
                }
                <div>
                  {` Holdings: ${labelLocation} > ${labelCallNumber}`}
                </div>
              </div>
            }
            actionMenu={this.getActionMenu}
          >
            <Row>
              <Col
                sm={5}
                smOffset={1}
              >
                <h2>
                  <FormattedMessage id="ui-inventory.itemRecord" />
                </h2>
              </Col>
            </Row>
            <Row>
              <Col
                sm={5}
                smOffset={1}
              >
                {(holdingsRecord.metadata && holdingsRecord.metadata.createdDate) &&
                  <this.cViewMetaData metadata={holdingsRecord.metadata} />
                }
                {/* <Field label="Material Type" name="materialType.name" id="additem_materialType" component={TextField} fullWidth /> */}
                <Field
                  label={<FormattedMessage id="ui-inventory.materialTypeRequired" />}
                  placeholder={formatMessage({ id: 'ui-inventory.selectMaterialType' })}
                  name="materialType.id"
                  id="additem_materialType"
                  component={Select}
                  fullWidth
                  dataOptions={materialTypeOptions}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.loanTypePermanentRequired" />}
                  placeholder={formatMessage({ id: 'ui-inventory.selectLoanType' })}
                  name="permanentLoanType.id"
                  id="additem_loanTypePerm"
                  component={Select}
                  fullWidth
                  dataOptions={loanTypeOptions}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.barcode" />}
                  name="barcode"
                  id="additem_barcode"
                  component={TextField}
                  required
                  fullWidth
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                  placeholder={formatMessage({ id: 'ui-inventory.selectLocation' })}
                  name="permanentLocation.id"
                  id="additem_permanentlocation"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                  onSelect={loc => this.selectPermanentLocation(loc)}
                />
                <LocationLookup onLocationSelected={loc => this.selectPermanentLocation(loc)} />

                <Field
                  label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                  placeholder={formatMessage({ id: 'ui-inventory.selectLocation' })}
                  name="temporaryLocation.id"
                  id="additem_temporarylocation"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                  onSelect={loc => this.selectTemporaryLocation(loc)}
                />
                <LocationLookup onLocationSelected={loc => this.selectTemporaryLocation(loc)} />

                <Field
                  label={<FormattedMessage id="ui-inventory.status" />}
                  name="status.name"
                  id="additem_status"
                  component={TextField}
                  disabled
                  fullWidth
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.loanTypeTemporary" />}
                  placeholder={formatMessage({ id: 'ui-inventory.selectLoanType' })}
                  name="temporaryLoanType.id"
                  id="additem_loanTypeTemp"
                  component={Select}
                  fullWidth
                  dataOptions={loanTypeOptions}
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.enumeration" />}
                  name="enumeration"
                  id="additem_enumeration"
                  component={TextField}
                  fullWidth
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.chronology" />}
                  name="chronology"
                  id="additem_chronology"
                  component={TextField}
                  fullWidth
                />
                <Field
                  label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
                  name="numberOfPieces"
                  id="additem_numberofpieces"
                  component={TextField}
                />
              </Col>
            </Row>
            <Row>
              <Col
                sm={8}
                smOffset={1}
              >
                <FieldArray
                  name="notes"
                  component={renderNotes}
                  formatMsg={formatMessage}
                />
              </Col>
            </Row>
            <Row>
              <Col
                sm={8}
                smOffset={1}
              >
                <FieldArray
                  name="pieceIdentifiers"
                  component={PieceIdentifiers}
                />
              </Col>
            </Row>

            <ConfirmationModal
              id="confirmPermanentLocationModal"
              open={confirmPermanentLocation}
              heading={formatMessage({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMessage({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMessage({ id: 'ui-inventory.confirmLocation.selectBtn' })}
              buttonStyle="default"
              cancelButtonStyle="primary"
              onConfirm={() => { this.confirmPermanentLocation(true); }}
              onCancel={() => { this.confirmPermanentLocation(false); }}
            />
            <ConfirmationModal
              id="confirmTemporaryLocationModal"
              open={confirmTemporaryLocation}
              heading={formatMessage({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMessage({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMessage({ id: 'ui-inventory.confirmLocation.selectBtn' })}
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
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
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
