import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Paneset,
  Pane,
  Accordion,
  ExpandAllButton,
  Row,
  Col,
  Button,
  TextArea,
  TextField,
  Select,
  Checkbox,
  PaneFooter,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes-core';

import { ViewMetaData } from '@folio/stripes/smart-components';

import stripesFinalForm from '@folio/stripes/final-form';

import RepeatableField from '../../components/RepeatableField';
import ElectronicAccessFields from '../electronicAccessFields';
import HoldingsStatementFields from './holdingsStatementFields';
import HoldingsStatementForSupplementsFields from './holdingsStatementForSupplementsFields';
import HoldingsStatementForIndexesFields from './holdingsStatementForIndexesFields';
import Note from './note';
import { validateOptionalField } from '../../utils';
import { LocationSelectionWithCheck } from '../common';
import styles from './HoldingsForm.css';
import { RemoteStorageWarning } from './RemoteStorageWarning';


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
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    copy: PropTypes.bool,
    itemCount: PropTypes.number,
    onCancel: PropTypes.func,
    initialValues: PropTypes.object,
    instance: PropTypes.object,
    referenceTables: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    form: PropTypes.shape({
      change: PropTypes.func,
    }),
  };

  static defaultProps = {
    initialValues: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        accordion01: true,
        accordion02: true,
        accordion03: true,
        accordion04: true,
        accordion05: true,
        accordion06: true,
        accordion07: true,
      },
    };
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
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

  onSelectLocationHandler = loc => this.selectTemporaryLocation(loc);

  render() {
    const {
      onCancel,
      initialValues,
      instance,
      referenceTables,
    } = this.props;

    const { accordions } = this.state;

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

    const illPolicyOptions = referenceTables.illPolicies ? referenceTables.illPolicies.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.illPolicyId,
      }),
    ) : [];

    const holdingsPageType = initialValues.id ? 'edit' : 'create';

    return (
      <form
        data-test-holdings-page-type={holdingsPageType}
        className={styles.holingsForm}
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
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={accordions}
                  onToggle={this.handleExpandAll}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={5}>
                <h2>
                  <FormattedMessage id="ui-inventory.holdingsRecord" />
                </h2>
              </Col>
            </Row>
            <Accordion
              open={accordions.accordion01}
              id="accordion01"
              onToggle={this.handleAccordionToggle}
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
                        placeholder={placeholder}
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
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.accordion02}
              id="accordion02"
              onToggle={this.handleAccordionToggle}
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
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.accordion03}
              id="accordion03"
              onToggle={this.handleAccordionToggle}
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
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <HoldingsStatementFields />
                  <br />
                  <HoldingsStatementForSupplementsFields />
                  <br />
                  <HoldingsStatementForIndexesFields />
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
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.retentionPolicy" />}
                    name="retentionPolicy"
                    id="edit_retentionpolicy"
                    component={TextArea}
                    rows={1}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.accordion04}
              id="accordion04"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.holdingsNotes" />}
            >
              <Row>
                <Col sm={10}>
                  <Note noteTypeOptions={holdingsNoteTypeOptions} />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={accordions.accordion06}
              id="accordion06"
              onToggle={this.handleAccordionToggle}
              label={<FormattedMessage id="ui-inventory.electronicAccess" />}
            >
              <ElectronicAccessFields relationship={referenceTables.electronicAccessRelationships} />
            </Accordion>
            <Accordion
              open={accordions.accordion05}
              id="accordion05"
              onToggle={this.handleAccordionToggle}
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
              open={accordions.accordion07}
              id="accordion07"
              onToggle={this.handleAccordionToggle}
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
                  />
                </Col>
              </Row>
            </Accordion>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  validate,
})(HoldingsForm);
