import React, { createRef } from 'react';
import {
  get,
  cloneDeep,
  uniqBy,
  noop
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
} from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { withRouter } from 'react-router';

import { NumberGeneratorModalButton } from '@folio/service-interaction';
import {
  Paneset,
  Pane,
  PaneFooter,
  Row,
  Col,
  Accordion,
  Button,
  Headline,
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
  IntlConsumer,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  ViewMetaData,
} from '@folio/stripes/smart-components';
import { effectiveCallNumber } from '@folio/stripes/util';

import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
} from '../../settings/NumberGeneratorSettings/constants';
import OptimisticLockingBanner from '../../components/OptimisticLockingBanner';
import ElectronicAccessFields from '../electronicAccessFields';
import { memoize, mutators } from '../formUtils';
import {
  handleCallNumberSwap,
  handleKeyCommand,
  validateAdditionalCallNumbers,
  validateOptionalField
} from '../../utils';
import { LocationSelectionWithCheck } from '../common';
import AdministrativeNoteFields from '../administrativeNoteFields';
import { RemoteStorageWarning } from './RemoteStorageWarning';
import {
  BoundWithTitlesFields,
  CirculationNotesFields,
  FormerIdentifierFields,
  YearCaptionFields
} from './repeatableFields';
import StatisticalCodeFields from '../statisticalCodeFields';
import NoteFields from '../noteFields';
import AdditionalCallNumbersItemLevelFields from './repeatableFields/AdditionalCallNumbersItemLevelFields';

import styles from './ItemForm.css';
import { itemStatusesMap } from '../../constants';

function validate(values) {
  const errors = {};
  const selectToContinueMsg = <FormattedMessage id="ui-inventory.selectToContinue" />;

  if (!values.materialType?.id) {
    errors.materialType = { id: selectToContinueMsg };
  }

  if (!values.permanentLoanType?.id) {
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

  validateAdditionalCallNumbers(values, errors);

  return errors;
}

function checkUniqueBarcode(okapi, barcode) {
  return fetch(`${okapi.url}/inventory/items?query=(barcode=="${barcode}")`,
    {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'Content-Type': 'application/json',
        ...(okapi.token && { 'X-Okapi-Token': okapi.token }),
      },
      credentials: 'include',
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

const ITEM_STATUSES_TRANSLATIONS_ID_MAP = {
  [itemStatusesMap.AGED_TO_LOST]: 'stripes-inventory-components.item.status.agedToLost',
  [itemStatusesMap.AVAILABLE]: 'stripes-inventory-components.item.status.available',
  [itemStatusesMap.AWAITING_PICKUP]: 'stripes-inventory-components.item.status.awaitingPickup',
  [itemStatusesMap.AWAITING_DELIVERY]: 'stripes-inventory-components.item.status.awaitingDelivery',
  [itemStatusesMap.CHECKED_OUT]: 'stripes-inventory-components.item.status.checkedOut',
  [itemStatusesMap.CLAIMED_RETURNED]: 'stripes-inventory-components.item.status.claimedReturned',
  [itemStatusesMap.DECLARED_LOST]: 'stripes-inventory-components.item.status.declaredLost',
  [itemStatusesMap.IN_PROCESS]: 'stripes-inventory-components.item.status.inProcess',
  [itemStatusesMap.IN_PROCESS_NON_REQUESTABLE]: 'stripes-inventory-components.item.status.inProcessNonRequestable',
  [itemStatusesMap.IN_TRANSIT]: 'stripes-inventory-components.item.status.inTransit',
  [itemStatusesMap.INTELLECTUAL_ITEM]: 'stripes-inventory-components.item.status.intellectualItem',
  [itemStatusesMap.LONG_MISSING]: 'stripes-inventory-components.item.status.longMissing',
  [itemStatusesMap.LOST_AND_PAID]: 'stripes-inventory-components.item.status.lostAndPaid',
  [itemStatusesMap.MISSING]: 'stripes-inventory-components.item.status.missing',
  [itemStatusesMap.ON_ORDER]: 'stripes-inventory-components.item.status.onOrder',
  [itemStatusesMap.ORDER_CLOSED]: 'stripes-inventory-components.item.status.orderClosed',
  [itemStatusesMap.PAGED]: 'stripes-inventory-components.item.status.paged',
  [itemStatusesMap.RESTRICTED]: 'stripes-inventory-components.item.status.restricted',
  [itemStatusesMap.UNAVAILABLE]: 'stripes-inventory-components.item.status.unavailable',
  [itemStatusesMap.UNKNOWN]: 'stripes-inventory-components.item.status.unknown',
  [itemStatusesMap.WITHDRAWN]: 'stripes-inventory-components.item.status.withdrawn',
};

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

  handleCallNumberSwap = (additionalCallNumberIndex) => {
    const { form: { change, getFieldState } } = this.props;

    handleCallNumberSwap({
      change,
      getFieldState,
      fieldNames: {
        callNumber: 'itemLevelCallNumber',
        prefix: 'itemLevelCallNumberPrefix',
        suffix: 'itemLevelCallNumberSuffix',
        typeId: 'itemLevelCallNumberTypeId',
        additionalCallNumbers: 'additionalCallNumbers',
      },
      additionalCallNumberIndex,
    });
  };

  setItemDamagedStatusDate = () => {
    this.props.form.change('itemDamagedStatusDate', new Date());
  }

  addBoundWiths = (newBoundWithTitles) => {
    let boundWithTitles = cloneDeep(this.props.form.getFieldState('boundWithTitles')?.value) || [];
    boundWithTitles = uniqBy([...boundWithTitles, ...newBoundWithTitles], 'briefHoldingsRecord.hrid');
    this.props.form.change('boundWithTitles', boundWithTitles);
  }

  handleSaveClick = (e, keepEditing = false) => {
    const {
      handleSubmit,
      setKeepEditing,
    } = this.props;

    setKeepEditing(keepEditing);
    handleSubmit(e);
  }

  getFooter = () => {
    const {
      onCancel,
      pristine,
      submitting,
      copy,
      showKeepEditingButton,
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
    const saveAndKeepEditingButton = (
      <Button
        buttonStyle="default mega"
        type="submit"
        buttonClass={styles.saveAndKeepEditingButton}
        disabled={(pristine || submitting) && !copy}
        onClick={(e) => this.handleSaveClick(e, true)}
      >
        <FormattedMessage id="stripes-components.saveAndKeepEditing" />
      </Button>
    );
    const saveButton = (
      <Button
        id="clickable-save-item"
        buttonStyle="primary mega"
        type="submit"
        disabled={(pristine || submitting) && !copy}
        onClick={(e) => this.handleSaveClick(e, false)}
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={cancelButton}
        renderEnd={(
          <>
            {showKeepEditingButton && saveAndKeepEditingButton}
            {saveButton}
          </>
        )}
      />
    );
  };

  render() {
    const {
      form: { change },
      numberGeneratorData,
      onCancel,
      initialValues,
      instance,
      holdingsRecord,
      httpError,

      referenceTables: {
        locationsById = [],
        materialTypes = [],
        loanTypes = [],
        itemNoteTypes = [],
        electronicAccessRelationships = [],
        callNumberTypes = [],
        statisticalCodes = [],
        statisticalCodeTypes = [],
        itemDamagedStatuses = [],
      },
      handleSubmit,
      pristine,
      submitting,
      history,
    } = this.props;

    const holdingLocation = locationsById[holdingsRecord?.permanentLocationId];
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

    const isBarcodeDisabled = numberGeneratorData?.[BARCODE_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE;
    const isAccessionNumberDisabled = numberGeneratorData?.[ACCESSION_NUMBER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE;
    const isCallNumberDisabled = numberGeneratorData?.[CALL_NUMBER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE;

    const showNumberGeneratorForAccessionNumber = isAccessionNumberDisabled ||
      numberGeneratorData?.[ACCESSION_NUMBER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_EDITABLE;
    const showNumberGeneratorForBarcode = isBarcodeDisabled ||
      numberGeneratorData?.[BARCODE_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_EDITABLE;
    const showNumberGeneratorForCallNumber = isCallNumberDisabled ||
      numberGeneratorData?.[CALL_NUMBER_SETTING] === NUMBER_GENERATOR_OPTIONS_ON_EDITABLE;

    const renderSharedNumberGenerator = () => {
      return (
        <NumberGeneratorModalButton
          buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />}
          callback={(generated) => {
            change('accessionNumber', generated);
            change('itemLevelCallNumber', generated);
          }}
          generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />}
          generator="inventory_accessionNumber"
          id="inventoryAccessionNumberAndCallNumber"
          modalProps={{
            label: <FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumber" />
          }}
          renderTop={() => (
            <p><FormattedMessage id="ui-inventory.numberGenerator.generateAccessionAndCallNumberWarning" /></p>
          )}
        />
      );
    };

    return (
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
            <form
              data-test-item-page-type={initialValues.id ? 'edit' : 'create'}
              className={styles.itemForm}
              onSubmit={handleSubmit}
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
                          disabled={isBarcodeDisabled}
                          label={<FormattedMessage id="ui-inventory.barcode" />}
                          name="barcode"
                          id="additem_barcode"
                          validate={validateBarcode(this.props)}
                          component={TextField}
                          autoFocus
                          fullWidth
                        />
                        {showNumberGeneratorForBarcode &&
                          <NumberGeneratorModalButton
                            buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateBarcode" />}
                            callback={(generated) => change('barcode', generated)}
                            id="inventoryBarcode"
                            generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateBarcode" />}
                            generator="inventory_itemBarcode"
                            modalProps={{
                              label: <FormattedMessage id="ui-inventory.numberGenerator.generateBarcode" />
                            }}
                          />
                        }
                      </Col>
                      <Col sm={2}>
                        <Field
                          disabled={isAccessionNumberDisabled}
                          label={<FormattedMessage id="ui-inventory.accessionNumber" />}
                          name="accessionNumber"
                          id="additem_accessionnumber"
                          component={TextField}
                          fullWidth
                        />
                        {numberGeneratorData?.useSharedNumber ?
                          renderSharedNumberGenerator() :
                          showNumberGeneratorForAccessionNumber &&
                          <NumberGeneratorModalButton
                            buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionNumber" />}
                            callback={(generated) => change('accessionNumber', generated)}
                            id="inventoryAccessionNumber"
                            generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateAccessionNumber" />}
                            generator="inventory_accessionNumber"
                            modalProps={{
                              label: <FormattedMessage id="ui-inventory.numberGenerator.generateAccessionNumber" />
                            }}
                          />
                        }
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
                        <FormerIdentifierFields />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <StatisticalCodeFields statisticalCodeOptions={statisticalCodeOptions} />
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
                      <Col sm={4}>
                        <Headline size="large" tag="h3"><FormattedMessage id="ui-inventory.primaryItemCallNumber" /></Headline>
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
                          format={v => v?.trim()}
                          formatOnBlur
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
                          disabled={isCallNumberDisabled}
                          format={v => v?.trim()}
                          formatOnBlur
                          rows={1}
                          fullWidth
                        />
                        {numberGeneratorData?.useSharedNumber ?
                          renderSharedNumberGenerator() :
                          showNumberGeneratorForCallNumber &&
                          <NumberGeneratorModalButton
                            buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />}
                            callback={(generated) => change('itemLevelCallNumber', generated)}
                            id="inventoryCallNumber"
                            generateButtonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />}
                            generator="inventory_callNumber"
                            modalProps={{
                              label: <FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />
                            }}
                          />
                        }
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                          name="itemLevelCallNumberSuffix"
                          id="additem_callnumbersuffix"
                          component={TextArea}
                          format={v => v?.trim()}
                          formatOnBlur
                          rows={1}
                          fullWidth
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <AdditionalCallNumbersItemLevelFields callNumberTypeOptions={callNumberTypeOptions} onSwap={this.handleCallNumberSwap} />
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
                          label={<FormattedMessage id="ui-inventory.displaySummary" />}
                          name="displaySummary"
                          id="additem_displaySummary"
                          component={TextField}
                          rows={1}
                          fullWidth
                        />
                      </Col>
                    </Row>
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
                        <YearCaptionFields />
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
                        <NoteFields
                          noteTypeOptions={itemNoteTypeOptions}
                          noteTypeIdField="itemNoteTypeId"
                          requiredFields={['itemNoteTypeId', 'note']}
                          renderLegend={false}
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
                        <IntlConsumer>
                          {intl => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.status" />}
                              name="status.name"
                              id="additem_status"
                              component={TextField}
                              format={value => (ITEM_STATUSES_TRANSLATIONS_ID_MAP[value] ? intl.formatMessage({ id: ITEM_STATUSES_TRANSLATIONS_ID_MAP[value] }) : value)}
                              parse={value => value}
                              disabled
                              fullWidth
                            />
                          )}
                        </IntlConsumer>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <CirculationNotesFields />
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
                  <Accordion
                    id="acc10"
                    label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
                  >
                    <BoundWithTitlesFields
                      item={item}
                      addBoundWithTitles={newBoundWiths => this.addBoundWiths(newBoundWiths)}
                    />
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
            </form>
          </Pane>
        </Paneset>
      </HasCommand>
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
  numberGeneratorData: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  copy: PropTypes.bool,
  setKeepEditing: PropTypes.func,
  showKeepEditingButton: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
    getFieldState: PropTypes.func,
  }).isRequired,
  history: PropTypes.object.isRequired,
  httpError: PropTypes.object,
};

ItemForm.defaultProps = {
  initialValues: {},
  setKeepEditing: noop,
  showKeepEditingButton: false,
};

export default withRouter(stripesFinalForm({
  validate,
  mutators,
  navigationCheck: true,
})(ItemForm));
