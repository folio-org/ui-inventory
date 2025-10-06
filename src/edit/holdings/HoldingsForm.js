import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import noop from 'lodash/noop';

import { NumberGeneratorModalButton } from '@folio/service-interaction';

import {
  Paneset,
  Pane,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  Row,
  Col,
  Button,
  TextArea,
  TextField,
  Select,
  Checkbox,
  PaneFooter,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections, Headline,
} from '@folio/stripes/components';

import {
  stripesConnect,
  AppIcon,
} from '@folio/stripes/core';

import { ViewMetaData } from '@folio/stripes/smart-components';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
} from '../../settings/NumberGeneratorSettings/constants';
import OptimisticLockingBanner from '../../components/OptimisticLockingBanner';
import ElectronicAccessFields from '../electronicAccessFields';
import { handleCallNumberSwap, handleKeyCommand, validateAdditionalCallNumbers, validateOptionalField } from '../../utils';
import { LocationSelectionWithCheck } from '../common';
import { RemoteStorageWarning } from './RemoteStorageWarning';
import AdministrativeNoteFields from '../administrativeNoteFields';
import {
  FormerHoldingsIdFields,
  HoldingsStatementFields,
  HoldingsStatementForSupplementsFields,
  HoldingsStatementForIndexesFields,
  NoteFields,
  ReceivingHistoryFields,
  AdditionalCallNumbersFields
} from './repeatableFields';
import StatisticalCodeFields from '../statisticalCodeFields';

import styles from './HoldingsForm.css';

// eslint-disable-next-line no-unused-vars
function validate(values) {
  const errors = {};

  if (!values.permanentLocationId) {
    errors.permanentLocationId = <FormattedMessage id="ui-inventory.selectToContinue" />;
  }

  // Validate optional lists in the holdings record description.
  // The list itself is not required, but if a list is present,
  // each item must have non-empty values in each field.
  const optionalLists = [
    { list: 'notes', textFields: ['note'], selectFields: ['holdingsNoteTypeId'] }
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

class HoldingsForm extends React.Component {
  static manifest = Object.freeze({
    query: {},
    holdingsBlockedFields: {
      type: 'okapi',
      path: 'inventory/config/holdings/blocked-fields',
      clear: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    copy: PropTypes.bool,
    itemCount: PropTypes.number,
    onCancel: PropTypes.func,
    initialValues: PropTypes.object,
    instance: PropTypes.object,
    isMARCRecord: PropTypes.bool,
    location: PropTypes.shape({
      state: PropTypes.string.isRequired,
    }).isRequired,
    numberGeneratorData: PropTypes.object,
    referenceTables: PropTypes.object.isRequired,
    resources: PropTypes.shape({
      holdingsBlockedFields: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.shape({
          blockedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
        })).isRequired,
      }).isRequired,
    }).isRequired,
    setKeepEditing: PropTypes.func,
    showKeepEditingButton: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    form: PropTypes.shape({
      change: PropTypes.func,
      getFieldState: PropTypes.func
    }),
    goTo: PropTypes.func.isRequired,
    httpError: PropTypes.object,
  };

  static defaultProps = {
    initialValues: {},
    isMARCRecord: false,
    setKeepEditing: noop,
    showKeepEditingButton: false,
  };

  constructor(props) {
    super(props);

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
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
        buttonStyle="default mega"
        id="cancel-holdings-creation"
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
        buttonStyle="primary mega"
        id="clickable-create-holdings-record"
        type="submit"
        disabled={(pristine || submitting) && !copy}
        onClick={(e) => this.handleSaveClick(e, false)}
        marginBottom0
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

  isFieldBlocked = (fieldName) => {
    const {
      resources: { holdingsBlockedFields },
      isMARCRecord,
    } = this.props;

    if (!holdingsBlockedFields || !isMARCRecord) return false;

    const { records } = holdingsBlockedFields;

    if (!records || !records.length) return false;

    const { blockedFields } = records[0];

    return blockedFields.includes(fieldName);
  };

  onSelectLocationHandler = loc => this.selectTemporaryLocation(loc);

  handleCallNumberSwap = (additionalCallNumberIndex) => {
    const { form: { change, getFieldState } } = this.props;

    handleCallNumberSwap({
      change,
      getFieldState,
      fieldNames: {
        callNumber: 'callNumber',
        prefix: 'callNumberPrefix',
        suffix: 'callNumberSuffix',
        typeId: 'callNumberTypeId',
        additionalCallNumbers: 'additionalCallNumbers',
      },
      additionalCallNumberIndex,
    });
  };

  render() {
    const {
      form: { change },
      numberGeneratorData,
      onCancel,
      initialValues,
      instance,
      referenceTables,
      copy,
      handleSubmit,
      location: { state: locationState },
      pristine,
      submitting,
      goTo,
      httpError,
    } = this.props;

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
      return ref || {};
    };

    const holdingsNoteTypeOptions = referenceTables.holdingsNoteTypes
      ? referenceTables.holdingsNoteTypes.map(
        it => ({
          label: it.name,
          value: it.id,
          selected: it.id === initialValues.holdingsNoteTypeId,
        }),
      )
      : [];

    const callNumberTypeOptions = referenceTables.callNumberTypes ? referenceTables.callNumberTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.callNumberTypeId,
      }),
    ) : [];

    const holdingsTypeOptions = referenceTables.holdingsTypes ? referenceTables.holdingsTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.holdingsTypeId,
      }),
    ) : [];

    const holdingsSourceOptions = (referenceTables?.holdingsSources ?? []).map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.sourceId ||
        (!initialValues.sourceId && referenceTables.holdingsSourcesByName?.FOLIO?.name === it.name),
      }),
    );

    const statisticalCodeOptions = referenceTables.statisticalCodes ? referenceTables.statisticalCodes.map(
      it => ({
        label: refLookup(referenceTables.statisticalCodeTypes, it.statisticalCodeTypeId).name + ':    ' + it.code + ' - ' + it.name,
        value: it.id,
        selected: it.id === initialValues.statisticalCodeId,
      }),
    ) : [];
    statisticalCodeOptions.sort((a, b) => a.label.localeCompare(b.label));

    const illPolicyOptions = referenceTables.illPolicies ? referenceTables.illPolicies.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.illPolicyId,
      }),
    ) : [];

    const holdingsPageType = initialValues.id ? 'edit' : 'create';

    const isCallNumberHoldingsDisabled = numberGeneratorData?.callNumberHoldings === NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE;
    const showNumberGeneratorForCallNumber = isCallNumberHoldingsDisabled ||
      numberGeneratorData?.callNumberHoldings === NUMBER_GENERATOR_OPTIONS_ON_EDITABLE;

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
        handler: handleKeyCommand(() => goTo('/inventory')),
      },
    ];

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset isRoot>
          <Pane
            appIcon={<AppIcon app="inventory" iconKey="holdings" />}
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            footer={this.getFooter()}
            paneTitle={
              <span data-test-header-title>
                {instance.title}
              </span>
            }
            paneSub={
              (instance.publication && instance.publication.length > 0) ?
                <>
                  {instance.publication[0].publisher}
                  {instance.publication[0].dateOfPublication
                    ? `, ${instance.publication[0].dateOfPublication}`
                    : null
                }
                </>
                : null
            }
          >
            <form
              data-test-holdings-page-type={holdingsPageType}
              className={styles.holdingsForm}
            >
              <OptimisticLockingBanner
                httpError={httpError}
                latestVersionLink={locationState?.backPathname}
                conflictDetectionBannerRef={this.conflictDetectionBannerRef}
                focusConflictDetectionBanner={this.focusConflictDetectionBanner}
              />
              <AccordionStatus ref={this.accordionStatusRef}>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <Row>
                  <Col sm={5}>
                    <h2>
                      <FormattedMessage id="ui-inventory.holdingsRecord" />
                    </h2>
                  </Col>
                </Row>
                <AccordionSet>
                  <Accordion
                    id="accordion01"
                    label={<FormattedMessage id="ui-inventory.administrativeData" />}
                  >
                    {(initialValues.metadata && initialValues.metadata.createdDate) &&
                      <this.cViewMetaData metadata={initialValues.metadata} />
                    }
                    <Row>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
                          name="discoverySuppress"
                          id="input_discovery_suppress"
                          component={Checkbox}
                          type="checkbox"
                          disabled={this.isFieldBlocked('discoverySuppress')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Field
                          name="hrid"
                          type="text"
                          disabled
                          component={TextField}
                          label={<FormattedMessage id="ui-inventory.holdingsHrid" />}
                        />
                      </Col>
                      <Col sm={4}>
                        <FormattedMessage id="ui-inventory.selectHoldingsSource">
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.holdingsSourceLabel" />}
                              name="sourceId"
                              id="additem_holdingsSource"
                              disabled
                              component={Select}
                              fullWidth
                              dataOptions={[{ label: copy ? label : instance.source, value: '' }, ...holdingsSourceOptions]}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <FormerHoldingsIdFields
                          canAdd={!this.isFieldBlocked('formerIds')}
                          canEdit={!this.isFieldBlocked('formerIds')}
                          canDelete={!this.isFieldBlocked('formerIds')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <FormattedMessage id="ui-inventory.selectHoldingsType">
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.holdingsType" />}
                              name="holdingsTypeId"
                              id="additem_holdingstype"
                              component={Select}
                              fullWidth
                              dataOptions={[{ label, value: '' }, ...holdingsTypeOptions]}
                              disabled={this.isFieldBlocked('holdingsTypeId')}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <StatisticalCodeFields
                          statisticalCodeOptions={statisticalCodeOptions}
                          canAdd={!this.isFieldBlocked('statisticalCodeIds')}
                          canEdit={!this.isFieldBlocked('statisticalCodeIds')}
                          canDelete={!this.isFieldBlocked('statisticalCodeIds')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <AdministrativeNoteFields />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion02"
                    label={<FormattedMessage id="ui-inventory.location" />}
                  >
                    <Row>
                      <Col smOffset={0} sm={4}>
                        <Headline>
                          <FormattedMessage id="ui-inventory.holdingsLocation" />
                        </Headline>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                          name="permanentLocationId"
                          id="additem_permanentlocation"
                          component={LocationSelectionWithCheck}
                          fullWidth
                          marginBottom0
                          disabled={this.isFieldBlocked('permanentLocationId')}
                          required
                        />
                      </Col>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                          name="temporaryLocationId"
                          id="additem_temporarylocation"
                          component={LocationSelectionWithCheck}
                          fullWidth
                          marginBottom0
                          disabled={this.isFieldBlocked('temporaryLocationId')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <RemoteStorageWarning {...this.props} />
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                          name="shelvingOrder"
                          id="additem_shelvingorder"
                          component={TextField}
                          disabled
                          fullWidth
                        />
                      </Col>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.shelvingTitle" />}
                          name="shelvingTitle"
                          id="additem_shelvingtitle"
                          component={TextField}
                          fullWidth
                          disabled={this.isFieldBlocked('shelvingTitle')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <h3><FormattedMessage id="ui-inventory.primaryHoldingsCallNumber" /></h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.copyNumber" />}
                          name="copyNumber"
                          id="additem_copynumber"
                          component={TextField}
                          fullWidth
                          disabled={this.isFieldBlocked('copyNumber')}
                        />
                      </Col>
                      <Col sm={2}>
                        <FormattedMessage id="ui-inventory.selectCallNumberType">
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.callNumberType" />}
                              name="callNumberTypeId"
                              id="additem_callnumbertype"
                              component={Select}
                              fullWidth
                              dataOptions={[{ label, value: '' }, ...callNumberTypeOptions]}
                              disabled={this.isFieldBlocked('callNumberTypeId')}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                          name="callNumberPrefix"
                          id="additem_callnumberprefix"
                          component={TextArea}
                          rows={1}
                          fullWidth
                          format={v => v?.trim()}
                          formatOnBlur
                          disabled={this.isFieldBlocked('callNumberPrefix')}
                        />
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumber" />}
                          name="callNumber"
                          id="additem_callnumber"
                          component={TextArea}
                          rows={1}
                          fullWidth
                          format={v => v?.trim()}
                          formatOnBlur
                          disabled={this.isFieldBlocked('callNumber') || isCallNumberHoldingsDisabled}
                        />
                        {showNumberGeneratorForCallNumber &&
                          <NumberGeneratorModalButton
                            buttonLabel={<FormattedMessage id="ui-inventory.numberGenerator.generateCallNumber" />}
                            callback={(generated) => change('callNumber', generated)}
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
                          name="callNumberSuffix"
                          id="additem_callnumbersuffix"
                          component={TextArea}
                          rows={1}
                          fullWidth
                          format={v => v?.trim()}
                          formatOnBlur
                          disabled={this.isFieldBlocked('callNumberSuffix')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={10}>
                        <AdditionalCallNumbersFields callNumberTypeOptions={callNumberTypeOptions} isFieldBlocked={this.isFieldBlocked} onSwap={this.handleCallNumberSwap} />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion03"
                    label={<FormattedMessage id="ui-inventory.holdingsDetails" />}
                  >
                    <Row>
                      <Col sm={4}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.numberOfItems" />}
                          name="numberOfItems"
                          id="edititem_numberofitems"
                          component={TextField}
                          fullWidth
                          disabled={this.isFieldBlocked('numberOfItems')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <HoldingsStatementFields
                          canAdd={!this.isFieldBlocked('holdingsStatements')}
                          canEdit={!this.isFieldBlocked('holdingsStatements')}
                          canDelete={!this.isFieldBlocked('holdingsStatements')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <HoldingsStatementForSupplementsFields
                          canAdd={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                          canEdit={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                          canDelete={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <HoldingsStatementForIndexesFields
                          canAdd={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                          canEdit={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                          canDelete={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={3}>
                        <FormattedMessage id="ui-inventory.selectIllPolicy">
                          {([label]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.illPolicy" />}
                              name="illPolicyId"
                              id="additem_illpolicy"
                              component={Select}
                              fullWidth
                              dataOptions={[{ label, value: '' }, ...illPolicyOptions]}
                              disabled={this.isFieldBlocked('illPolicyId')}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.digitizationPolicy" />}
                          name="digitizationPolicy"
                          id="edit_digitizationpolicy"
                          component={TextArea}
                          rows={1}
                          disabled={this.isFieldBlocked('digitizationPolicy')}
                        />
                      </Col>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.retentionPolicy" />}
                          name="retentionPolicy"
                          id="edit_retentionpolicy"
                          component={TextArea}
                          rows={1}
                          disabled={this.isFieldBlocked('retentionPolicy')}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion04"
                    label={<FormattedMessage id="ui-inventory.holdingsNotes" />}
                  >
                    <Row>
                      <Col sm={11}>
                        <NoteFields
                          canAdd={!this.isFieldBlocked('notes')}
                          canEdit={!this.isFieldBlocked('notes')}
                          noteTypeOptions={holdingsNoteTypeOptions}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion06"
                    label={<FormattedMessage id="ui-inventory.electronicAccess" />}
                  >
                    <Row>
                      <Col sm={10}>
                        <ElectronicAccessFields
                          canAdd={!this.isFieldBlocked('electronicAccess')}
                          canEdit={!this.isFieldBlocked('electronicAccess')}
                          relationship={referenceTables.electronicAccessRelationships}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion05"
                    label={<FormattedMessage id="ui-inventory.acquisition" />}
                  >
                    <Row>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.acquisitionMethod" />}
                          name="acquisitionMethod"
                          id="edit_acquisitionmethod"
                          component={TextField}
                        />
                      </Col>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.acquisitionFormat" />}
                          name="acquisitionFormat"
                          id="edit_acquisitionformat"
                          component={TextField}
                        />
                      </Col>
                      <Col sm={3}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.receiptStatus" />}
                          name="receiptStatus"
                          id="edit_receiptstatus"
                          component={TextField}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion
                    id="accordion07"
                    label={<FormattedMessage id="ui-inventory.receivingHistory" />}
                  >
                    <Row>
                      <Col sm={10}>
                        <ReceivingHistoryFields
                          canAdd={!this.isFieldBlocked('receivingHistory.entries')}
                          canEdit={!this.isFieldBlocked('receivingHistory.entries')}
                          canDelete={!this.isFieldBlocked('receivingHistory.entries')}
                        />
                      </Col>
                    </Row>
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

export default stripesFinalForm({
  navigationCheck: true,
  validate,
})(stripesConnect(HoldingsForm));
