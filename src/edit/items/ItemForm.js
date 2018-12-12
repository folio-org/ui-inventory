import React from 'react';
import { get, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import {
  Paneset,
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  Button,
  Icon,
  TextField,
  Select,
  Checkbox,
  Datepicker,
  ExpandAllButton,
  ConfirmationModal,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import {
  LocationSelection,
  LocationLookup,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import RepeatableField from '../../components/RepeatableField';

import ElectronicAccessFields from '../electronicAccessFields';
import CopyNumbers from './CopyNumbers';

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
      accordions: {
        itemAccordion: true,
        conditionsAccordion: true,
        locationAccordion: true,
        administrativeAccordion: true,
        enumerationAccordion: true,
        notesAccordion: true,
        loanDataAccordion: true,
        acquisitionsAccordion: true,
        electronicAccordion: true,
      },
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

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
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

  onSelectHandler = loc => this.selectTemporaryLocation(loc);

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
        itemNoteTypes,
        electronicAccessRelationships,
      },
      copy,
    } = this.props;

    const {
      accordions,
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
          <FormattedMessage id="ui-inventory.createItem" />
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
          <FormattedMessage id="ui-inventory.updateItem" />
        </Button>
      </PaneMenu>
    );

    const materialTypeOptions = materialTypes
      ? materialTypes.map((t) => {
        let selectedValue;

        if (initialValues.materialType) {
          selectedValue = initialValues.materialType.id === t.id;
        }

        return {
          label: t.name,
          value: t.id,
          selected: selectedValue,
        };
      })
      : [];

    const loanTypeOptions = loanTypes.map(t => ({
      label: t.name,
      value: t.id,
      selected: (initialValues.loanType) ? initialValues.loanType.id === t.id : false,
    }));

    const itemNoteTypeOptions = itemNoteTypes ? itemNoteTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.itemNoteTypeId,
      }),
    ) : [];

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
            actionMenu={this.getActionMenu}
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
                      {instance.publication[0].dateOfPublication
                        ? `, ${instance.publication[0].dateOfPublication}`
                        : null
                      }
                    </em>
                  </span>
                }
                <div>
                  <FormattedMessage
                    id="ui-inventory.holdingsTitle"
                    values={{
                      location: labelLocation,
                      callNumber: labelCallNumber,
                    }}
                  />
                </div>
              </div>
            }
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
                <FormattedMessage id="ui-inventory.selectMaterialType">
                  {placeholder => (
                    <Field
                      label={<FormattedMessage id="ui-inventory.materialTypeRequired" />}
                      placeholder={placeholder}
                      name="materialType.id"
                      id="additem_materialType"
                      component={Select}
                      fullWidth
                      dataOptions={materialTypeOptions}
                    />
                  )}
                </FormattedMessage>
                <FormattedMessage id="ui-inventory.selectLoanType">
                  {placeholder => (
                    <Field
                      label={<FormattedMessage id="ui-inventory.loanTypePermanentRequired" />}
                      placeholder={placeholder}
                      name="permanentLoanType.id"
                      id="additem_loanTypePerm"
                      component={Select}
                      fullWidth
                      dataOptions={loanTypeOptions}
                    />
                  )}
                </FormattedMessage>
                <Field
                  label={<FormattedMessage id="ui-inventory.barcode" />}
                  name="barcode"
                  id="additem_barcode"
                  component={TextField}
                  required
                  fullWidth
                />
                <FormattedMessage id="ui-inventory.selectLocation">
                  {placeholder => (
                    <Field
                      label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                      placeholder={placeholder}
                      name="permanentLocation.id"
                      id="additem_permanentlocation"
                      component={LocationSelection}
                      fullWidth
                      marginBottom0
                      onSelect={loc => this.selectPermanentLocation(loc)}
                    />
                  )}
                </FormattedMessage>
                <LocationLookup onLocationSelected={loc => this.selectPermanentLocation(loc)} />

                <FormattedMessage id="ui-inventory.selectLocation">
                  {placeholder => (
                    <Field
                      label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                      placeholder={placeholder}
                      name="temporaryLocation.id"
                      id="additem_temporarylocation"
                      component={LocationSelection}
                      fullWidth
                      marginBottom0
                      onSelect={this.onSelectHandler}
                    />
                  )}
                </FormattedMessage>
                <LocationLookup onLocationSelected={this.onSelectHandler} />

                <Field
                  label={<FormattedMessage id="ui-inventory.status" />}
                  name="status.name"
                  id="additem_status"
                  component={TextField}
                  disabled
                  fullWidth
                />
                <FormattedMessage id="ui-inventory.selectLoanType">
                  {placeholder => (
                    <Field
                      label={<FormattedMessage id="ui-inventory.loanTypeTemporary" />}
                      placeholder={placeholder}
                      name="temporaryLoanType.id"
                      id="additem_loanTypeTemp"
                      component={Select}
                      fullWidth
                      dataOptions={loanTypeOptions}
                    />
                  )}
                </FormattedMessage>
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
                  name="copyNumbers"
                  component={CopyNumbers}
                />
              </Col>
            </Row>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={accordions}
                  onToggle={this.handleExpandAll}
                />
              </Col>
            </Row>
            <Accordion
              open={accordions.administrativeAccordion}
              id="administrativeAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.administrativeData" />}
            />
            <Accordion
              open={accordions.itemAccordion}
              id="itemAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.itemData" />}
            />
            <Accordion
              open={accordions.enumerationAccordion}
              id="enumerationAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.enumerationData" />}
            />
            <Accordion
              open={accordions.conditionsAccordion}
              id="conditionsAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.conditions" />}
            >
              <Row>
                <Col sm={3}>
                  <Field
                    name="numberOfMissingPieces"
                    id="input_number_of_missing_pieces"
                    component={TextField}
                    label={<FormattedMessage id="ui-inventory.numberOfMissingPieces" />}
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    name="missingPieces"
                    id="input_missing_pieces"
                    component={TextField}
                    label={<FormattedMessage id="ui-inventory.missingPieces" />}
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    name="missingPiecesDate"
                    id="input_missing_pieces_date"
                    dateFormat="YYYY-MM-DD"
                    backendDateStandard="YYYY-MM-DD"
                    component={Datepicker}
                    label={<FormattedMessage id="ui-inventory.date" />}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <FormattedMessage id="ui-inventory.selectStatus">
                    {placeholder => (
                      <Field
                        name="itemDamagedStatusId"
                        id="input_item_damaged_status_id"
                        component={Select}
                        placeholder={placeholder}
                        label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <Col sm={3}>
                  <Field
                    name="itemDamagedStatusDate"
                    id="input_missing_pieces_date"
                    dateFormat="YYYY-MM-DD"
                    backendDateStandard="YYYY-MM-DD"
                    component={Datepicker}
                    label={<FormattedMessage id="ui-inventory.date" />}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.notesAccordion}
              id="notesAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.notes" />}
            >
              <Row>
                <Col sm={10}>
                  <RepeatableField
                    name="notes"
                    addButtonId="clickable-add-note"
                    addLabel={<FormattedMessage id="ui-inventory.addNote" />}
                    template={[
                      {
                        name: 'itemNoteTypeId',
                        label: <FormattedMessage id="ui-inventory.noteType" />,
                        component: Select,
                        dataOptions: [{ label: 'Select type', value: '' }, ...itemNoteTypeOptions],
                      },
                      {
                        name: 'note',
                        label: <FormattedMessage id="ui-inventory.note" />,
                        component: TextField,
                      },
                      {
                        name: 'staffOnly',
                        label: <FormattedMessage id="ui-inventory.staffOnly" />,
                        component: Checkbox,
                      }
                    ]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.loanDataAccordion}
              id="loanDataAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.item.availability" />}
            />
            <Accordion
              open={accordions.acquisitionsAccordion}
              id="acquisitionsAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.acquisitions" />}
            />
            <Accordion
              open={accordions.locationAccordion}
              id="locationAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.location" />}
            />
            <Accordion
              open={accordions.electronicAccordion}
              id="electronicAccordion"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.electronicAccess" />}
            >
              <ElectronicAccessFields relationship={electronicAccessRelationships} />
            </Accordion>
            <ConfirmationModal
              id="confirmPermanentLocationModal"
              open={confirmPermanentLocation}
              heading={<FormattedMessage id="ui-inventory.confirmLocation.header" />}
              message={<FormattedMessage id="ui-inventory.confirmLocation.message" />}
              confirmLabel={<FormattedMessage id="ui-inventory.confirmLocation.selectBtn" />}
              buttonStyle="default"
              cancelButtonStyle="primary"
              onConfirm={() => { this.confirmPermanentLocation(true); }}
              onCancel={() => { this.confirmPermanentLocation(false); }}
            />
            <ConfirmationModal
              id="confirmTemporaryLocationModal"
              open={confirmTemporaryLocation}
              heading={<FormattedMessage id="ui-inventory.confirmLocation.header" />}
              message={<FormattedMessage id="ui-inventory.confirmLocation.message" />}
              confirmLabel={<FormattedMessage id="ui-inventory.confirmLocation.selectBtn" />}
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
