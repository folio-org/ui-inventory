import React, { Fragment } from 'react';
import { get, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
} from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import {
  Paneset,
  Pane,
  PaneFooter,
  Row,
  Col,
  Accordion,
  Button,
  KeyValue,
  TextField,
  Select,
  Checkbox,
  Datepicker,
  ExpandAllButton,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  AppIcon,
  IntlConsumer
} from '@folio/stripes-core';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  LocationSelection,
  LocationLookup,
  ViewMetaData,
} from '@folio/stripes/smart-components';
import { effectiveCallNumber } from '@folio/stripes/util';

import RepeatableField from '../../components/RepeatableField';
import ElectronicAccessFields from '../electronicAccessFields';
import { memoize, mutators } from '../formUtils';
import { validateOptionalField } from '../../utils';

import styles from './ItemForm.css';

function validate(values) {
  const errors = {};
  const selectToContinueMsg = <FormattedMessage id="ui-inventory.selectToContinue" />;

  if (!(values.materialType && values.materialType.id)) {
    errors.materialType = { id: selectToContinueMsg };
  }

  if (!(values.permanentLoanType && values.permanentLoanType.id)) {
    errors.permanentLoanType = { id: selectToContinueMsg };
  }

  // Validate optional lists in the items record description.
  // The list itself is not required, but if a list is present,
  // each item must have non-empty values in each field.
  const optionalLists = [
    { list: 'circulationNotes', textFields: ['note'], selectFields: ['noteType'] },
    { list: 'notes', textFields: ['note'], selectFields: ['itemNoteTypeId'] },
  ];
  optionalLists.forEach(listProps => {
    const listErrors = validateOptionalField(listProps, values);
    if (listErrors.length) {
      errors[listProps.list] = listErrors;
    }
  });

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

function validateBarcode(props) {
  return memoize(async (barcode) => {
    if (!barcode || barcode === props.initialValues.barcode) return '';

    const error = <FormattedMessage id="ui-inventory.barcodeTaken" />;
    const response = await checkUniqueBarcode(props.okapi, barcode);

    if (response.status >= 400) {
      return error;
    }

    const json = await response.json();

    if (json.totalRecords > 0) {
      return error;
    }

    return '';
  });
}

class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        acc01: true,
        acc02: true,
        acc03: true,
        acc04: true,
        acc05: true,
        acc06: true,
        acc07: true,
        acc08: true,
        acc09: true,
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
    const { form: { change } } = this.props;

    if (!permanentLocation) {
      change('permanentLocation', {});
      return;
    }

    if (permanentLocation.isActive) {
      setTimeout(() => change('permanentLocation.id', permanentLocation.id));
      this.setState({ prevPermanentLocation: permanentLocation });
    } else {
      this.setState({ confirmPermanentLocation: true, permanentLocation });
    }
  }

  selectTemporaryLocation(temporaryLocation) {
    const { form: { change } } = this.props;

    if (!temporaryLocation) {
      change('temporaryLocation', {});
      return;
    }

    if (temporaryLocation.isActive) {
      setTimeout(() => change('temporaryLocation.id', temporaryLocation.id));
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
  };

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  };

  confirmPermanentLocation(confirm) {
    const { form: { change } } = this.props;
    const { permanentLocation, prevPermanentLocation } = this.state;
    const confirmPermanentLocation = false;
    const value = (confirm) ? permanentLocation.id : prevPermanentLocation.id;
    const prevPermanentLoc = (confirm) ? permanentLocation : prevPermanentLocation;

    setTimeout(() => change('permanentLocation.id', value));
    this.setState({ confirmPermanentLocation, prevPermanentLocation: prevPermanentLoc });
  }

  confirmTemporaryLocation(confirm) {
    const { form: { change } } = this.props;
    const { temporaryLocation, prevTemporaryLocation } = this.state;
    const confirmTemporaryLocation = false;
    const value = (confirm) ? temporaryLocation.id : prevTemporaryLocation.id;
    const prevTemporaryLoc = (confirm) ? temporaryLocation : prevTemporaryLocation;

    setTimeout(() => change('temporaryLocation.id', value));
    this.setState({ confirmTemporaryLocation, prevTemporaryLocation: prevTemporaryLoc });
  }

  onSelectHandler = loc => this.selectTemporaryLocation(loc);

  setItemDamagedStatusDate = () => {
    this.props.form.change('itemDamagedStatusDate', new Date());
  }

  getFooter = () => {
    const {
      onCancel,
      handleSubmit,
      pristine,
      submitting,
      copy,
    } = this.props;
    const cancelButton = (
      <Button
        data-test-inventory-cancel-item-edit-action
        buttonStyle="default mega"
        id="cancel-item-edit"
        onClick={onCancel}
      >
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    );
    const saveButton = (
      <Button
        id="clickable-save-item"
        buttonStyle="primary mega"
        type="submit"
        disabled={(pristine || submitting) && !copy}
        onClick={handleSubmit}
      >
        <FormattedMessage id="stripes-core.button.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={cancelButton}
        renderEnd={saveButton}
      />
    );
  };

  render() {
    const {
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
        callNumberTypes,
        statisticalCodes,
        statisticalCodeTypes,
        itemDamagedStatuses,
      },
      handleSubmit,
    } = this.props;

    const {
      accordions,
      confirmPermanentLocation,
      confirmTemporaryLocation,
    } = this.state;

    const holdingLocation = locationsById[holdingsRecord.permanentLocationId];

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
      return ref || {};
    };

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

    const callNumberTypeOptions = callNumberTypes ? callNumberTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.callNumberTypeId,
      }),
    ) : [];

    const statisticalCodeOptions = statisticalCodes ? statisticalCodes.map(
      it => ({
        label: refLookup(statisticalCodeTypes, it.statisticalCodeTypeId).name + ':    ' + it.code + ' - ' + it.name,
        value: it.id,
        selected: it.id === initialValues.statisticalCodeId,
      }),
    ) : [];

    const itemDamagedStatusOptions = itemDamagedStatuses ? itemDamagedStatuses.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.damagedStatusId,
      }),
    ) : [];

    const labelLocation = get(holdingLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';
    const effectiveLocation = get(initialValues, ['effectiveLocation', 'name'], '-');

    return (
      <form
        data-test-item-page-type={initialValues.id ? 'edit' : 'create'}
        className={styles.itemForm}
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            footer={this.getFooter()}
            appIcon={<AppIcon app="inventory" iconKey="item" />}
            paneTitle={
              <span data-test-header-title>
                {instance.title}
                {(instance.publication && instance.publication.length > 0) &&
                  <Fragment>
                    {', '}
                    {instance.publication[0].publisher}
                    {instance.publication[0].dateOfPublication
                      ? `, ${instance.publication[0].dateOfPublication}`
                      : null
                    }
                  </Fragment>
                }
              </span>
            }
            paneSub={
              <span data-test-header-sub>
                <FormattedMessage
                  id="ui-inventory.holdingsTitle"
                  values={{
                    location: labelLocation,
                    callNumber: labelCallNumber,
                  }}
                />
              </span>
            }
          >
            <Row>
              <Col
                sm={5}
              >
                <h2>
                  <FormattedMessage id="ui-inventory.itemRecord" />
                </h2>
              </Col>
            </Row>
            <Row>
              { initialValues.id &&
                <React.Fragment>
                  <Col xs="4">
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
                      value={effectiveLocation}
                    />
                  </Col>
                  <Col xs={8}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                      value={effectiveCallNumber(initialValues)}
                    />
                  </Col>
                </React.Fragment>
              }
              <Col end="xs">
                <ExpandAllButton
                  accordionStatus={accordions}
                  onToggle={this.handleExpandAll}
                />
              </Col>
            </Row>
            <Accordion
              open={accordions.acc01}
              id="acc01"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.administrativeData" />}
            >
              <Row>
                <Col
                  sm={5}
                >
                  {(holdingsRecord.metadata && holdingsRecord.metadata.createdDate) &&
                    <this.cViewMetaData metadata={holdingsRecord.metadata} />
                  }
                  {/* <Field label="Material Type" name="materialType.name" id="additem_materialType" component={TextField} fullWidth /> */}
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
                    name="discoverySuppress"
                    id="input_discovery_suppress"
                    component={Checkbox}
                    type="checkbox"
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.itemHrid" />}
                    name="hrid"
                    id="additem_hrid"
                    disabled
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.barcode" />}
                    name="barcode"
                    id="additem_barcode"
                    validate={validateBarcode(this.props)}
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.accessionNumber" />}
                    name="accessionNumber"
                    id="additem_accessionnumber"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.itemIdentifier" />}
                    name="itemIdentifier"
                    id="additem_itemidentifier"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={8}>
                  <RepeatableField
                    name="formerIds"
                    addButtonId="clickable-add-former-id"
                    addLabel={<FormattedMessage id="ui-inventory.addFormerId" />}
                    template={[{
                      component: TextField,
                      label: (
                        <FormattedMessage id="ui-inventory.formerId">
                          {(message) => message}
                        </FormattedMessage>
                      )
                    }]}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <RepeatableField
                    name="statisticalCodeIds"
                    addButtonId="clickable-add-statistical-code"
                    addLabel={<FormattedMessage id="ui-inventory.addStatisticalCode" />}
                    template={[
                      {
                        label: <FormattedMessage id="ui-inventory.statisticalCode" />,
                        component: Select,
                        dataOptions: [{ label: 'Select code', value: '' }, ...statisticalCodeOptions],
                      }
                    ]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc02}
              id="acc02"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.itemData" />}
            >
              <Row>
                <Col sm={3}>
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
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.copyNumber" />}
                    name="copyNumber"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <FormattedMessage id="ui-inventory.selectCallNumberType">
                    {placeholder => (
                      <Field
                        label={<FormattedMessage id="ui-inventory.callNumberType" />}
                        placeholder={placeholder}
                        name="itemLevelCallNumberTypeId"
                        id="additem_callnumbertype"
                        component={Select}
                        fullWidth
                        dataOptions={callNumberTypeOptions}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                    name="itemLevelCallNumberPrefix"
                    id="additem_callnumberprefix"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.callNumber" />}
                    name="itemLevelCallNumber"
                    id="additem_callnumber"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                    name="itemLevelCallNumberSuffix"
                    id="additem_callnumbersuffix"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
                    name="numberOfPieces"
                    id="additem_numberofpieces"
                    component={TextField}
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.descriptionOfPieces" />}
                    name="descriptionOfPieces"
                    id="input_descriptionofpieces"
                    component={TextField}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc03}
              id="acc03"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.enumerationData" />}
            >
              <Row>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.enumeration" />}
                    name="enumeration"
                    id="additem_enumeration"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.chronology" />}
                    name="chronology"
                    id="additem_chronology"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.volume" />}
                    name="volume"
                    id="additem_volume"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <RepeatableField
                    name="yearCaption"
                    addButtonId="clickable-add-year-caption"
                    addLabel={<FormattedMessage id="ui-inventory.addYearCaption" />}
                    template={[{
                      component: TextField,
                      label: <FormattedMessage id="ui-inventory.yearCaption" />
                    }]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc04}
              id="acc04"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.condition" />}
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
                        dataOptions={itemDamagedStatusOptions}
                      />
                    )}
                  </FormattedMessage>
                  <OnChange name="itemDamagedStatusId">
                    {() => {
                      this.setItemDamagedStatusDate();
                    }}
                  </OnChange>
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
              open={accordions.acc05}
              id="acc05"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.itemNotes" />}
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
                        type: 'checkbox',
                        inline: true,
                        vertical: true,
                        columnSize: {
                          xs: 3,
                          lg: 2,
                        }
                      }
                    ]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc06}
              id="acc06"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
            >
              <Row>
                <Col sm={6}>
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
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormattedMessage id="ui-inventory.selectLoanType">
                    {placeholder => (
                      <Field
                        label={<FormattedMessage id="ui-inventory.loanTypeTemporary" />}
                        name="temporaryLoanType.id"
                        id="additem_loanTypeTemp"
                        component={Select}
                        fullWidth
                        dataOptions={[{
                          label: placeholder,
                          value: '',
                          selected: !initialValues.loanType,
                        }, ...loanTypeOptions]}
                      />
                    )}
                  </FormattedMessage>
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.status" />}
                    name="status.name"
                    id="additem_status"
                    component={TextField}
                    disabled
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <RepeatableField
                    name="circulationNotes"
                    addButtonId="clickable-add-note"
                    addLabel={<FormattedMessage id="ui-inventory.addCirculationNote" />}
                    template={[
                      {
                        name: 'noteType',
                        label: <FormattedMessage id="ui-inventory.noteType" />,
                        component: Select,
                        dataOptions: [
                          { label: 'Select type', value: '' },
                          { label: 'Check in note', value: 'Check in' },
                          { label: 'Check out note', value: 'Check out' }
                        ],
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
                        type: 'checkbox',
                        inline: true,
                        vertical: true,
                        columnSize: {
                          xs: 3,
                          lg: 2,
                        }
                      }
                    ]}
                  />
                </Col>
              </Row>
            </Accordion>
            {/*
              acquisition info isn't available yet but accordions MUST contain
              child elements. this is commented out for now in an effort to
              keep the console free of warnings.

            <Accordion
              open={accordions.acc07}
              id="acc07"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.acquisition" />}
            />
            */}
            <Accordion
              open={accordions.acc08}
              id="acc08"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.location" />}
            >
              <Row>
                <Col sm={4}>
                  <IntlConsumer>
                    {intl => (
                      <Field
                        label={intl.formatMessage({ id: 'ui-inventory.permanentLocation' })}
                        placeholder={intl.formatMessage({ id: 'ui-inventory.selectLocation' })}
                        name="permanentLocation.id"
                        id="additem_permanentlocation"
                        component={LocationSelection}
                        fullWidth
                        marginBottom0
                        onSelect={loc => this.selectPermanentLocation(loc)}
                      />
                    )}
                  </IntlConsumer>
                  <LocationLookup onLocationSelected={loc => this.selectPermanentLocation(loc)} />
                </Col>
                <Col sm={4}>
                  <IntlConsumer>
                    {intl => (
                      <Field
                        label={intl.formatMessage({ id: 'ui-inventory.temporaryLocation' })}
                        placeholder={intl.formatMessage({ id: 'ui-inventory.selectLocation' })}
                        name="temporaryLocation.id"
                        id="additem_temporarylocation"
                        component={LocationSelection}
                        fullWidth
                        marginBottom0
                        onSelect={this.onSelectHandler}
                      />
                    )}
                  </IntlConsumer>
                  <LocationLookup
                    onLocationSelected={this.onSelectHandler}
                    isTemporaryLocation
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.acc09}
              id="acc09"
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
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
  }).isRequired,
};

ItemForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  validate,
  mutators,
  navigationCheck: true,
})(ItemForm);
