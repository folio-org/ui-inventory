import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

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
  expandAllSections,
} from '@folio/stripes/components';

import {
  stripesConnect,
  AppIcon,
} from '@folio/stripes/core';

import { ViewMetaData } from '@folio/stripes/smart-components';

import stripesFinalForm from '@folio/stripes/final-form';

import RepeatableField from '../../components/RepeatableField';
import ElectronicAccessFields from '../electronicAccessFields';
import HoldingsStatementFields from './holdingsStatementFields';
import HoldingsStatementForSupplementsFields from './holdingsStatementForSupplementsFields';
import HoldingsStatementForIndexesFields from './holdingsStatementForIndexesFields';
import Note from './note';
import { handleKeyCommand, validateOptionalField } from '../../utils';
import { LocationSelectionWithCheck } from '../common';
import styles from './HoldingsForm.css';
import { RemoteStorageWarning } from './RemoteStorageWarning';
import AdministrativeNoteFields from '../administrativeNoteFields';


// eslint-disable-next-line no-unused-vars
function validate(values, props) {
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
    referenceTables: PropTypes.object.isRequired,
    resources: PropTypes.shape({
      holdingsBlockedFields: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.shape({
          blockedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
        })).isRequired,
      }).isRequired,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    form: PropTypes.shape({
      change: PropTypes.func,
    }),
    goTo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValues: {},
    isMARCRecord: false,
  };

  constructor(props) {
    super(props);

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
  }

  getFooter = () => {
    const {
      onCancel,
      pristine,
      submitting,
      copy,
      handleSubmit,
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
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        id="clickable-create-holdings-record"
        type="submit"
        disabled={(pristine || submitting) && !copy}
        onClick={handleSubmit}
        marginBottom0
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

  render() {
    const {
      onCancel,
      initialValues,
      instance,
      referenceTables,
      copy,
      handleSubmit,
      pristine,
      submitting,
      goTo,
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
      <form
        data-test-holdings-page-type={holdingsPageType}
        className={styles.holingsForm}
      >
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
                    <br />
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
                          {([placeholder]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.holdingsSourceLabel" />}
                              placeholder={copy ? placeholder : instance.source}
                              name="sourceId"
                              id="additem_holdingsSource"
                              disabled
                              component={Select}
                              fullWidth
                              dataOptions={holdingsSourceOptions}
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={10}>
                        <RepeatableField
                          name="formerIds"
                          addButtonId="clickable-add-formerholdingsid"
                          addLabel={<FormattedMessage id="ui-inventory.addFormerHoldingsId" />}
                          template={[{
                            label: <FormattedMessage id="ui-inventory.formerHoldingsId" />,
                            component: TextField,
                          }]}
                          canAdd={!this.isFieldBlocked('formerIds')}
                          canEdit={!this.isFieldBlocked('formerIds')}
                          canDelete={!this.isFieldBlocked('formerIds')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <FormattedMessage id="ui-inventory.selectHoldingsType">
                          {([placeholder]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.holdingsType" />}
                              placeholder={placeholder}
                              name="holdingsTypeId"
                              id="additem_holdingstype"
                              component={Select}
                              fullWidth
                              dataOptions={holdingsTypeOptions}
                              disabled={this.isFieldBlocked('holdingsTypeId')}
                            />
                          )}
                        </FormattedMessage>
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
                        <strong>
                          <FormattedMessage id="ui-inventory.holdingsLocation" />
                        </strong>
                      </Col>
                    </Row>
                    <br />
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
                      <Col
                        smOffset={0}
                        sm={4}
                      >
                        <strong>
                          <FormattedMessage id="ui-inventory.holdingsCallNumber" />
                        </strong>
                      </Col>
                    </Row>
                    <br />
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
                          {([placeholder]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.callNumberType" />}
                              placeholder={placeholder}
                              name="callNumberTypeId"
                              id="additem_callnumbertype"
                              component={Select}
                              fullWidth
                              dataOptions={callNumberTypeOptions}
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
                          disabled={this.isFieldBlocked('callNumber')}
                        />
                      </Col>
                      <Col sm={2}>
                        <Field
                          label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                          name="callNumberSuffix"
                          id="additem_callnumbersuffix"
                          component={TextArea}
                          rows={1}
                          fullWidth
                          disabled={this.isFieldBlocked('callNumberSuffix')}
                        />
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
                      <Col sm={12}>
                        <HoldingsStatementFields
                          canAdd={!this.isFieldBlocked('holdingsStatements')}
                          canEdit={!this.isFieldBlocked('holdingsStatements')}
                          canDelete={!this.isFieldBlocked('holdingsStatements')}
                        />
                        <br />
                        <HoldingsStatementForSupplementsFields
                          canAdd={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                          canEdit={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                          canDelete={!this.isFieldBlocked('holdingsStatementsForSupplements')}
                        />
                        <br />
                        <HoldingsStatementForIndexesFields
                          canAdd={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                          canEdit={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                          canDelete={!this.isFieldBlocked('holdingsStatementsForIndexes')}
                        />
                        <br />
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col sm={3}>
                        <FormattedMessage id="ui-inventory.selectIllPolicy">
                          {([placeholder]) => (
                            <Field
                              label={<FormattedMessage id="ui-inventory.illPolicy" />}
                              placeholder={placeholder}
                              name="illPolicyId"
                              id="additem_illpolicy"
                              component={Select}
                              fullWidth
                              dataOptions={illPolicyOptions}
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
                      <Col sm={10}>
                        <Note
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
                    <ElectronicAccessFields
                      canAdd={!this.isFieldBlocked('electronicAccess')}
                      canEdit={!this.isFieldBlocked('electronicAccess')}
                      relationship={referenceTables.electronicAccessRelationships}
                    />
                  </Accordion>
                  <Accordion
                    id="accordion07"
                    label={<FormattedMessage id="ui-inventory.receivingHistory" />}
                  >
                    <Row>
                      <Col sm={10}>
                        <RepeatableField
                          name="receivingHistory.entries"
                          addButtonId="clickable-add-statistical-code"
                          addLabel={<FormattedMessage id="ui-inventory.addReceivingHistory" />}
                          template={[
                            {
                              name: 'publicDisplay',
                              label: <FormattedMessage id="ui-inventory.publicDisplay" />,
                              component: Checkbox,
                              type: 'checkbox',
                            },
                            {
                              name: 'enumeration',
                              label: <FormattedMessage id="ui-inventory.enumeration" />,
                              component: TextArea,
                              rows: 1,
                            },
                            {
                              name: 'chronology',
                              label: <FormattedMessage id="ui-inventory.chronology" />,
                              component: TextArea,
                              rows: 1,
                            },
                          ]}
                          canAdd={!this.isFieldBlocked('receivingHistory.entries')}
                          canEdit={!this.isFieldBlocked('receivingHistory.entries')}
                          canDelete={!this.isFieldBlocked('receivingHistory.entries')}
                        />
                      </Col>
                    </Row>
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

export default stripesFinalForm({
  navigationCheck: true,
  validate,
})(stripesConnect(HoldingsForm));
