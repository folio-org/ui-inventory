import React, { createRef } from 'react';
import { get, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
} from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { withRouter } from 'react-router';

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
  TextArea,
  AccordionSet,
  AccordionStatus,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import {
  AppIcon,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  ViewMetaData,
} from '@folio/stripes/smart-components';
import { effectiveCallNumber } from '@folio/stripes/util';

import RepeatableField from '../../components/RepeatableField';
import OptimisticLockingBanner from '../../components/OptimisticLockingBanner';
import ElectronicAccessFields from '../electronicAccessFields';
import { memoize, mutators } from '../formUtils';
import { handleKeyCommand, validateOptionalField } from '../../utils';
import { LocationSelectionWithCheck } from '../common';
import AdministrativeNoteFields from '../administrativeNoteFields';
import styles from './ItemForm.css';
import { RemoteStorageWarning } from './RemoteStorageWarning';


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
      headers: { 'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json' }
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

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
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
      httpError,

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
      pristine,
      submitting,
      history,
    } = this.props;

    const holdingLocation = locationsById[holdingsRecord.permanentLocationId];
    const item = initialValues;

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
    statisticalCodeOptions.sort((a, b) => a.label.localeCompare(b.label));

    const itemDamagedStatusOptions = itemDamagedStatuses ? itemDamagedStatuses.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.damagedStatusId,
      }),
    ) : [];

    const labelLocation = get(holdingLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';
    const effectiveLocation = locationsById[initialValues?.effectiveLocation?.id];
    const effectiveLocationName = get(initialValues, ['effectiveLocation', 'name'], '-');

    const shortcuts = [
      {
        name: 'cancel',
        shortcut: 'esc',
        handler: handleKeyCommand(onCancel),
      },
      {
        name: 'save',
        handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'search',
        handler: handleKeyCommand(() => history.push('/inventory')),
      },
    ];

    return (
      <form
        data-test-item-page-type={initialValues.id ? 'edit' : 'create'}
        className={styles.itemForm}
        onSubmit={handleSubmit}
      >
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
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
                    <>
                      &apos;, &apos;
                      {instance.publication[0].publisher}
                      {instance.publication[0].dateOfPublication
                        ? `, ${instance.publication[0].dateOfPublication}`
                        : null
                      }
                    </>
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
              <OptimisticLockingBanner
                httpError={httpError}
                latestVersionLink={`/inventory/view/${instance?.id}/${holdingsRecord?.id}/${item?.id}`}
                conflictDetectionBannerRef={this.conflictDetectionBannerRef}
                focusConflictDetectionBanner={this.focusConflictDetectionBanner}
              />
              <Row>
                <Col
                  sm={5}
                >
                  <h2>
                    <FormattedMessage id="ui-inventory.itemRecord" />
                  </h2>
                </Col>
              </Row>
              <AccordionStatus ref={this.accordionStatusRef}>
                <Row>
                  { initialValues.id &&
                    <>
                      <Col xs={4}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
                          value={effectiveLocationName}
                          subValue={!effectiveLocation?.isActive &&
                            <FormattedMessage id="ui-inventory.inactive" />
                          }
                        />
                      </Col>
                      <Col xs={8}>
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                          value={effectiveCallNumber(initialValues)}
                        />
                      </Col>
                    </>
                  }
                  <Col end="xs">
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet>
                  <Accordion
                    id="acc01"
                    label={<FormattedMessage id="ui-inventory.administrativeData" />}
                  >
                    <Row>
                      <Col
                        sm={5}
                      >
                        {(item?.metadata && item?.metadata?.createdDate) &&
                        <this.cViewMetaData metadata={item.metadata} />
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
                            label: <FormattedMessage id="ui-inventory.formerId" />,
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
                    <Row>
                      <Col sm={12}>
                        <AdministrativeNoteFields />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="acc02"
                    label={<FormattedMessage id="ui-inventory.itemData" />}
                  >
                    <Row>
                      <Col sm={3}>
                        <FormattedMessage id="ui-inventory.selectMaterialType">
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.materialType" />}
                              name="materialType.id"
                              id="additem_materialType"
                              component={Select}
                              required
                              aria-required="true"
                              fullWidth
                              dataOptions={
                                [{
                                  label,
                                  value: '',
                                  selected: !initialValues.materialType
                                },
                                ...materialTypeOptions
                                ]}
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
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.callNumberType" />}
                              name="itemLevelCallNumberTypeId"
                              id="additem_callnumbertype"
                              component={Select}
                              fullWidth
                              dataOptions={[{ label, value: '' }, ...callNumberTypeOptions]}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                          name="itemLevelCallNumberPrefix"
                          id="additem_callnumberprefix"
                          component={TextArea}
                          rows={1}
                          fullWidth
                        />
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumber" />}
                          name="itemLevelCallNumber"
                          id="additem_callnumber"
                          component={TextArea}
                          rows={1}
                          fullWidth
                        />
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                          name="itemLevelCallNumberSuffix"
                          id="additem_callnumbersuffix"
                          component={TextArea}
                          rows={1}
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
                          component={TextArea}
                          rows={1}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="acc03"
                    label={<FormattedMessage id="ui-inventory.enumerationData" />}
                  >
                    <Row>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.enumeration" />}
                          name="enumeration"
                          id="additem_enumeration"
                          component={TextArea}
                          rows={1}
                          fullWidth
                        />
                      </Col>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.chronology" />}
                          name="chronology"
                          id="additem_chronology"
                          component={TextArea}
                          rows={1}
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
                    id="acc04"
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
                          {([placeholder]) => (
                            <Field
                              name="itemDamagedStatusId"
                              id="input_item_damaged_status_id"
                              component={Select}
                              label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
                              dataOptions={[{ label: placeholder, value: '' }, ...itemDamagedStatusOptions]}
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
                          id="input_damaged_status_date"
                          dateFormat="YYYY-MM-DD"
                          backendDateStandard="YYYY-MM-DD"
                          component={Datepicker}
                          label={<FormattedMessage id="ui-inventory.date" />}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="acc05"
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
                              required: true
                            },
                            {
                              name: 'note',
                              label: <FormattedMessage id="ui-inventory.note" />,
                              component: TextArea,
                              rows: 1,
                              required: true
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
                    id="acc06"
                    label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
                  >
                    <Row>
                      <Col sm={6}>
                        <FormattedMessage id="ui-inventory.selectLoanType">
                          {([placeholder]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.loanTypePermanent" />}
                              name="permanentLoanType.id"
                              id="additem_loanTypePerm"
                              component={Select}
                              required
                              aria-required="true"
                              fullWidth
                              dataOptions={
                              [{
                                label: placeholder,
                                value: '',
                                selected: !initialValues.loanType
                              },
                              ...loanTypeOptions
                              ]}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <FormattedMessage id="ui-inventory.selectLoanType">
                          {([placeholder]) => (
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
                          addButtonId="clickable-add-checkin-checkout-note"
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
                              required: true
                            },
                            {
                              name: 'note',
                              label: <FormattedMessage id="ui-inventory.note" />,
                              component: TextArea,
                              rows: 1,
                              required: true
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
                    id="acc07"
                    label={<FormattedMessage id="ui-inventory.acquisition" />}
                  />
                  */}
                  <Accordion
                    id="acc08"
                    label={<FormattedMessage id="ui-inventory.location" />}
                  >
                    <Row>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                          name="permanentLocation.id"
                          id="additem_permanentlocation"
                          component={LocationSelectionWithCheck}
                          fullWidth
                          marginBottom0
                        />
                      </Col>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                          name="temporaryLocation.id"
                          id="additem_temporarylocation"
                          component={LocationSelectionWithCheck}
                          fullWidth
                          marginBottom0
                        />
                      </Col>
                    </Row>
                    <Row>
                      <RemoteStorageWarning />
                    </Row>
                  </Accordion>
                  <Accordion
                    id="acc09"
                    label={<FormattedMessage id="ui-inventory.electronicAccess" />}
                  >
                    <ElectronicAccessFields relationship={electronicAccessRelationships} />
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
            </Pane>
          </Paneset>
        </HasCommand>
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
  history: PropTypes.object.isRequired,
  httpError: PropTypes.object,
};

ItemForm.defaultProps = {
  initialValues: {},
};

export default withRouter(stripesFinalForm({
  validate,
  mutators,
  navigationCheck: true,
})(ItemForm));
