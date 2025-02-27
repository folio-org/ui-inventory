import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  filter,
  isEmpty,
  noop,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

import {
  AppIcon,
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  Accordion,
  AccordionStatus,
  AccordionSet,
  Paneset,
  Pane,
  Row,
  Col,
  Button,
  TextField,
  TextArea,
  Select,
  Checkbox,
  Headline,
  Datepicker,
  PaneFooter,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import OptimisticLockingBanner from '../components/OptimisticLockingBanner';

import AlternativeTitles from './alternativeTitles';
import StatisticalCodeFields from './statisticalCodeFields';
import AdministrativeNoteFields from './administrativeNoteFields';
import SeriesFields from './seriesFields';
import EditionFields from './editionFields';
import ContributorFields from './contributorFields';
import IdentifierFields from './identifierFields';
import SubjectFields from './subjectFields';
import ClassificationFields from './classificationFields';
import PublicationFields from './publicationFields';
import DescriptionFields from './descriptionFields';
import PublicationFrequencyFields from './publicationFrequencyFields';
import PublicationRangeFields from './publicationRangeFields';
import NoteFields from './noteFields';
import ElectronicAccessFields from './electronicAccessFields';
import InstanceFormatFields from './instanceFormatFields';
import LanguageFields from './languageFields';
import PrecedingTitleFields from './precedingTitleFields';
import NatureOfContentFields from './natureOfContentFields';
import SucceedingTitleFields from './succeedingTitleFields';
import {
  isUserInConsortiumMode,
  getDate,
  handleKeyCommand,
  psTitleRelationshipId,
  validateOptionalField,
  isInstanceShadowCopy,
} from '../utils';
import {
  validateTitles,
  validateSubInstances,
  validateDates,
} from '../validation';

import ParentInstanceFields from '../Instance/InstanceEdit/ParentInstanceFields';
import ChildInstanceFields from '../Instance/InstanceEdit/ChildInstanceFields';
import { getPublishingInfo } from '../Instance/InstanceDetails/utils';
import DateFields from './dateFields';

import styles from './InstanceForm.css';

const FORMATS_WITH_BLOCKED_FIELDS = ['MARC', 'LINKED_DATA'];

function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-inventory.fillIn" />;
  const requiredSelectMessage = <FormattedMessage id="ui-inventory.selectToContinue" />;
  const requiredPublicationFieldMessage = <FormattedMessage id="ui-inventory.onePublicationFieldToContinue" />;
  const dateLengthMessage = <FormattedMessage id="ui-inventory.dateLength" />;

  if (!values.title) {
    errors.title = requiredTextMessage;
  }

  if (!values.instanceTypeId) {
    errors.instanceTypeId = requiredSelectMessage;
  }

  // Language not required, but must be not null if supplied
  if (!isEmpty(values.languages)) {
    const errorList = [];
    values.languages.forEach((item, i) => {
      if (!item) {
        errorList[i] = requiredSelectMessage;
      }
    });
    if (errorList.length) errors.languages = errorList;
  }


  if (!isEmpty(values.alternativeTitles)) {
    const errorList = [];
    values.alternativeTitles.forEach((item, i) => {
      const error = {};

      if (!item.alternativeTitleTypeId) {
        error.alternativeTitleTypeId = requiredSelectMessage;
      }

      if (!item.alternativeTitle) {
        error.alternativeTitle = requiredTextMessage;
      }

      if (!isEmpty(error)) {
        errorList[i] = error;
      }
    });

    if (errorList.length) errors.alternativeTitles = errorList;
  }

  if (values.publication) {
    const errorList = [];
    values.publication.forEach((item, i) => {
      const entryErrors = {};
      if (!item || (!item.publisher && !item.dateOfPublication && !item.place)) {
        entryErrors.publisher = requiredPublicationFieldMessage;
        errorList[i] = entryErrors;
      }
    });
    if (errorList.length) errors.publication = errorList;
  }

  // the list itself is not required, but if a list is present,
  // each item must have non-empty values in each field.
  const optionalLists = [
    { list: 'identifiers', textFields: ['value'], selectFields: ['identifierTypeId'] },
    { list: 'contributors', textFields: ['name'], selectFields: ['contributorNameTypeId'] },
    { list: 'classifications', textFields: ['classificationNumber'], selectFields: ['classificationTypeId'] },
    { list: 'notes', textFields: ['note'], selectFields: ['instanceNoteTypeId'] }
  ];

  optionalLists.forEach(listProps => {
    const listErrors = validateOptionalField(listProps, values);
    if (listErrors.length) {
      errors[listProps.list] = listErrors;
    }
  });

  validateDates(values, errors, dateLengthMessage);

  validateTitles(values, 'preceding', errors, requiredTextMessage);
  validateTitles(values, 'succeeding', errors, requiredTextMessage);

  validateSubInstances(values, 'parentInstances', errors, requiredTextMessage);
  validateSubInstances(values, 'childInstances', errors, requiredTextMessage);

  return errors;
}

class InstanceForm extends React.Component {
  static manifest = Object.freeze({
    query: {},
    instanceBlockedFields: {
      type: 'okapi',
      path: 'inventory/config/instances/blocked-fields',
      clear: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    newinstance: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onCancel: PropTypes.func,
    initialValues: PropTypes.object,
    referenceTables: PropTypes.object.isRequired,
    copy: PropTypes.bool,
    setKeepEditing: PropTypes.func,
    showKeepEditingButton: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired,
      logger: PropTypes.object.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      instanceBlockedFields: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    instanceSource: PropTypes.string,
    history: PropTypes.object.isRequired,
    id: PropTypes.string,
    httpError: PropTypes.object,
    form: PropTypes.object.isRequired,
  };

  static defaultProps = {
    instanceSource: 'FOLIO',
    initialValues: {},
    id: 'instance-form',
    showKeepEditingButton: false,
    setKeepEditing: noop,
  };

  constructor(props) {
    super(props);

    this.cViewMetaData = this.props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
    this.state = { isInstanceSetForDeletion: Boolean(props.initialValues?.deleted) };
  }

  getPaneTitle() {
    const {
      initialValues,
      stripes,
    } = this.props;

    const newInstanceTitle = <FormattedMessage id="ui-inventory.newInstance" />;

    const getEditInstanceTitle = () => {
      const publishingInfo = getPublishingInfo(initialValues);
      const isInstanceShared = initialValues.shared || isInstanceShadowCopy(initialValues.source);

      return (
        <>
          <AppIcon app="inventory" iconKey="instance" size="small" />
          {' '}
          <FormattedMessage
            id={`ui-inventory.editInstance.${isUserInConsortiumMode(stripes) ? 'consortia.' : ''}title`}
            values={{
              title: initialValues.title,
              isShared: isInstanceShared,
            }}
          />
          {publishingInfo}
        </>
      );
    };

    return (
      <span data-test-header-title>
        {initialValues.id ? getEditInstanceTitle() : newInstanceTitle}
      </span>
    );
  }

  getPaneSubTitle() {
    const {
      initialValues: {
        hrid,
        metadata: { updatedDate },
      }
    } = this.props;

    return (
      <span data-test-header-sub-title>
        <FormattedMessage
          id="ui-inventory.instanceRecordSubtitle"
          values={{
            hrid,
            updatedDate: getDate(updatedDate),
          }}
        />
      </span>
    );
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
        id="cancel-instance-edition"
        onClick={onCancel}
      >
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    );
    const saveAndKeepEditingButton = (
      <Button
        buttonStyle="default mega"
        buttonClass={styles.saveAndKeepEditingButton}
        type="submit"
        disabled={(pristine || submitting) && !copy}
        onClick={(e) => this.handleSaveClick(e, true)}
      >
        <FormattedMessage id="stripes-components.saveAndKeepEditing" />
      </Button>
    );
    const saveButton = (
      <Button
        id="clickable-save-instance"
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

  isFieldBlocked = (fieldName) => {
    const {
      instanceSource,
      resources: { instanceBlockedFields },
    } = this.props;

    if (!instanceBlockedFields || !FORMATS_WITH_BLOCKED_FIELDS.includes(instanceSource)) return false;

    const { records } = instanceBlockedFields;

    if (isEmpty(records)) return false;

    const { blockedFields } = records[0];

    return blockedFields.includes(fieldName);
  };

  onSetForDeletionFieldChange = () => {
    const {
      form: { batch, change },
    } = this.props;

    if (!this.state.isInstanceSetForDeletion) {
      batch(() => {
        change('deleted', true);
        change('discoverySuppress', true);
        change('staffSuppress', true);
      });

      this.setState({ isInstanceSetForDeletion: true });
    } else {
      change('deleted', false);

      this.setState({ isInstanceSetForDeletion: false });
    }
  }

  render() {
    const {
      onCancel,
      initialValues,
      referenceTables,
      handleSubmit,
      pristine,
      submitting,
      history,
      httpError,
      id,
    } = this.props;

    const refLookup = (referenceTable, recordId) => {
      const ref = (referenceTable && recordId) ? referenceTable.find(record => record.id === recordId) : {};
      return ref || {};
    };

    const instanceTypeOptions = referenceTables.instanceTypes ? referenceTables.instanceTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.instanceTypeId,
      }),
    ) : [];

    const instanceDateTypeOptions = referenceTables.instanceDateTypes ? referenceTables.instanceDateTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.instanceDate?.instanceDateTypeId,
      }),
    ) : [];

    const instanceNoteTypeOptions = referenceTables.instanceNoteTypes ? referenceTables.instanceNoteTypes.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.instanceTypeId,
      }),
    ) : [];

    const instanceStatusOptions = referenceTables.instanceStatuses ? referenceTables.instanceStatuses.map(
      it => ({
        label: `${it.name} (${it.source}: ${it.code})`,
        value: it.id,
        selected: it.id === initialValues.instanceFormatId,
      }),
    ) : [];

    const modeOfIssuanceOptions = referenceTables.modesOfIssuance ? referenceTables.modesOfIssuance.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.modeOfIssuanceId,
      }),
    ) : [];

    const statisticalCodeOptions = referenceTables.statisticalCodes ? referenceTables.statisticalCodes
      .map(
        code => ({
          label: refLookup(referenceTables.statisticalCodeTypes, code.statisticalCodeTypeId).name + ':    ' + code.code + ' - ' + code.name,
          value: code.id,
          selected: code.id === initialValues.statisticalCodeId,
        })
      )
      .sort((a, b) => a.label.localeCompare(b.label)) : [];

    // Since preceding/succeeding title relationships are split out from other parent/child instances,
    // we don't want the type selection box for parent/child to include the preceding-succeeding type
    const rTypes = referenceTables.instanceRelationshipTypes;
    const mostParentChildRelationships = filter(rTypes, rt => rt.id !== psTitleRelationshipId(rTypes));
    const relationshipTypes = mostParentChildRelationships.map(it => ({
      label: it.name,
      value: it.id,
    }));

    const shortcuts = [
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'save',
        handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
      },
      {
        name: 'cancel',
        shortcut: 'esc',
        handler: handleKeyCommand(onCancel),
      },
      {
        name: 'search',
        handler: handleKeyCommand(() => history.push('/inventory')),
      },
    ];

    return (
      <IntlConsumer>
        {intl => (
          <form
            data-test-instance-page-type={initialValues.id ? 'edit' : 'create'}
            className={styles.instanceForm}
            aria-label={intl.formatMessage({ id: 'ui-inventory.instanceForm' })}
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
                  paneTitle={this.getPaneTitle()}
                  paneSub={initialValues?.id ? this.getPaneSubTitle() : null}
                  actionMenu={this.getActionMenu}
                  id={id}
                >
                  <OptimisticLockingBanner
                    httpError={httpError}
                    latestVersionLink={`/inventory/view/${initialValues.id}`}
                    conflictDetectionBannerRef={this.conflictDetectionBannerRef}
                    focusConflictDetectionBanner={this.focusConflictDetectionBanner}
                  />
                  <div>
                    <Headline
                      size="large"
                      tag="h3"
                    >
                      <FormattedMessage id="ui-inventory.instanceRecord" />
                    </Headline>
                    <AccordionStatus ref={this.accordionStatusRef}>
                      <AccordionSet>
                        <Accordion
                          label={
                            <h3>
                              <FormattedMessage id="ui-inventory.administrativeData" />
                            </h3>
                          }
                          id="instanceSection01"
                        >
                          {(initialValues.metadata?.createdDate) &&
                            <this.cViewMetaData metadata={initialValues.metadata} />
                          }
                          <Row>
                            <Col sm={3}>
                              <Field
                                label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
                                name="discoverySuppress"
                                id="input_discovery_suppress"
                                component={Checkbox}
                                type="checkbox"
                                disabled={this.isFieldBlocked('discoverySuppress') || this.state.isInstanceSetForDeletion}
                              />
                            </Col>
                            <Col sm={3}>
                              <Field
                                label={<FormattedMessage id="ui-inventory.staffSuppress" />}
                                name="staffSuppress"
                                id="input_staff_suppress"
                                component={Checkbox}
                                type="checkbox"
                                disabled={this.isFieldBlocked('staffSuppress') || this.state.isInstanceSetForDeletion}
                              />
                            </Col>
                            <Col sm={3}>
                              <Field
                                label={<FormattedMessage id="ui-inventory.previouslyHeld" />}
                                name="previouslyHeld"
                                id="input_previously_held"
                                component={Checkbox}
                                type="checkbox"
                                disabled={this.isFieldBlocked('previouslyHeld')}
                              />
                            </Col>
                            <Col sm={3}>
                              <Field
                                label={<FormattedMessage id="ui-inventory.setForDeletion" />}
                                name="deleted"
                                component={Checkbox}
                                type="checkbox"
                                disabled={this.isFieldBlocked('deleted')}
                                onChange={() => this.onSetForDeletionFieldChange()}
                              />
                            </Col>
                          </Row>
                          <br />
                          <Row>
                            <Col
                              xs={10}
                              sm={5}
                            >
                              <Field
                                name="hrid"
                                type="text"
                                disabled
                                component={TextField}
                                label={<FormattedMessage id="ui-inventory.instanceHrid" />}
                              />
                            </Col>
                            <Col xs={10} sm={5}>
                              <Field
                                name="source"
                                type="text"
                                component={TextField}
                                disabled
                                label={<FormattedMessage id="ui-inventory.metadataSource" />}
                                required
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              xs={10}
                              sm={5}
                            >
                              <Field
                                name="catalogedDate"
                                dateFormat="YYYY-MM-DD"
                                backendDateStandard="YYYY-MM-DD"
                                component={Datepicker}
                                label={<FormattedMessage id="ui-inventory.catalogedDate" />}
                                disabled={this.isFieldBlocked('catalogedDate')}
                              />
                            </Col>
                          </Row>
                          <Col sm={10}>
                            <FormattedMessage id="ui-inventory.selectInstanceStatus">
                              {([label]) => (
                                <Field
                                  label={<FormattedMessage id="ui-inventory.instanceStatus" />}
                                  name="statusId"
                                  type="text"
                                  component={Select}
                                  dataOptions={[{ label, value: '' }, ...instanceStatusOptions]}
                                  disabled={this.isFieldBlocked('statusId')}
                                />
                              )}
                            </FormattedMessage>
                          </Col>
                          <Col sm={10}>
                            <FormattedMessage id="ui-inventory.selectModeOfIssuance">
                              {([label]) => (
                                <Field
                                  label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
                                  name="modeOfIssuanceId"
                                  type="text"
                                  component={Select}
                                  dataOptions={[{ label, value: '' }, ...modeOfIssuanceOptions]}
                                  disabled={this.isFieldBlocked('modeOfIssuanceId')}
                                />
                              )}
                            </FormattedMessage>
                          </Col>
                          <Row>
                            <Col sm={12}>
                              <StatisticalCodeFields
                                canAdd={!this.isFieldBlocked('statisticalCodeIds')}
                                canEdit={!this.isFieldBlocked('statisticalCodeIds')}
                                canDelete={!this.isFieldBlocked('statisticalCodeIds')}
                                statisticalCodeOptions={statisticalCodeOptions}
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
                          label={
                            <h3>
                              <FormattedMessage id="ui-inventory.titleData" />
                            </h3>
                          }
                          id="instanceSection02"
                        >
                          <Col sm={10}>
                            <Field
                              label={<FormattedMessage id="ui-inventory.resourceTitle" />}
                              name="title"
                              id="input_instance_title"
                              component={TextArea}
                              rows={1}
                              fullWidth
                              required
                              disabled={this.isFieldBlocked('title')}
                            />
                          </Col>
                          <Field
                            type="hidden"
                            name="source"
                            component="input"
                            disabled={this.isFieldBlocked('source')}
                          />
                          <Col sm={12}>
                            <AlternativeTitles
                              alternativeTitleTypes={referenceTables.alternativeTitleTypes}
                              canAdd={!this.isFieldBlocked('alternativeTitles')}
                              canEdit={!this.isFieldBlocked('alternativeTitles')}
                              canDelete={!this.isFieldBlocked('alternativeTitles')}
                            />
                          </Col>
                          <Col sm={10}>
                            <Field
                              label={<FormattedMessage id="ui-inventory.indexTitle" />}
                              name="indexTitle"
                              id="input_index_title"
                              component={TextArea}
                              rows={1}
                              fullWidth
                              disabled={this.isFieldBlocked('indexTitle')}
                            />
                          </Col>
                          <Col sm={12}>
                            <SeriesFields
                              canAdd={!this.isFieldBlocked('series')}
                              canEdit={!this.isFieldBlocked('series')}
                              canDelete={!this.isFieldBlocked('series')}
                            />
                          </Col>
                          <PrecedingTitleFields
                            canAdd={!this.isFieldBlocked('precedingTitles')}
                            canEdit={!this.isFieldBlocked('precedingTitles')}
                            canDelete={!this.isFieldBlocked('precedingTitles')}
                            isDisabled={this.isFieldBlocked('precedingTitles')}
                          />
                          <SucceedingTitleFields
                            canAdd={!this.isFieldBlocked('succeedingTitles')}
                            canEdit={!this.isFieldBlocked('succeedingTitles')}
                            canDelete={!this.isFieldBlocked('succeedingTitles')}
                            isDisabled={this.isFieldBlocked('succeedingTitles')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.identifier" />
                            </h3>
                          )}
                          id="instanceSection03"
                        >
                          <IdentifierFields
                            identifierTypes={referenceTables.identifierTypes}
                            canAdd={!this.isFieldBlocked('identifiers')}
                            canEdit={!this.isFieldBlocked('identifiers')}
                            canDelete={!this.isFieldBlocked('identifiers')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.contributor" />
                            </h3>
                          )}
                          id="instanceSection04"
                        >
                          <ContributorFields
                            contributorNameTypes={referenceTables.contributorNameTypes}
                            contributorTypes={referenceTables.contributorTypes}
                            canAdd={!this.isFieldBlocked('contributors')}
                            canEdit={!this.isFieldBlocked('contributors')}
                            canDelete={!this.isFieldBlocked('contributors')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.descriptiveData" />
                            </h3>
                          )}
                          id="instanceSection05"
                        >
                          <PublicationFields
                            canAdd={!this.isFieldBlocked('publication')}
                            canEdit={!this.isFieldBlocked('publication')}
                            canDelete={!this.isFieldBlocked('publication')}
                          />
                          <EditionFields
                            canAdd={!this.isFieldBlocked('editions')}
                            canEdit={!this.isFieldBlocked('editions')}
                            canDelete={!this.isFieldBlocked('editions')}
                          />
                          <DescriptionFields
                            canAdd={!this.isFieldBlocked('physicalDescriptions')}
                            canEdit={!this.isFieldBlocked('physicalDescriptions')}
                            canDelete={!this.isFieldBlocked('physicalDescriptions')}
                          />
                          <Col sm={10}>
                            <FormattedMessage id="ui-inventory.selectResourceType">
                              {([label]) => (
                                <Field
                                  label={<FormattedMessage id="ui-inventory.resourceType" />}
                                  name="instanceTypeId"
                                  id="select_instance_type"
                                  type="text"
                                  required
                                  component={Select}
                                  dataOptions={[{ label, value: '' }, ...instanceTypeOptions]}
                                  disabled={this.isFieldBlocked('instanceTypeId')}
                                />
                              )}
                            </FormattedMessage>
                          </Col>
                          <NatureOfContentFields
                            natureOfContentTerms={referenceTables.natureOfContentTerms}
                            canAdd={!this.isFieldBlocked('natureOfContent')}
                            canEdit={!this.isFieldBlocked('natureOfContent')}
                            canDelete={!this.isFieldBlocked('natureOfContent')}
                          />
                          <InstanceFormatFields
                            instanceFormats={referenceTables.instanceFormats}
                            canAdd={!this.isFieldBlocked('instanceFormatIds')}
                            canEdit={!this.isFieldBlocked('instanceFormatIds')}
                            canDelete={!this.isFieldBlocked('instanceFormatIds')}
                          />
                          <LanguageFields
                            canAdd={!this.isFieldBlocked('languages')}
                            canEdit={!this.isFieldBlocked('languages')}
                            canDelete={!this.isFieldBlocked('languages')}
                          />
                          <PublicationFrequencyFields
                            canAdd={!this.isFieldBlocked('publicationFrequency')}
                            canEdit={!this.isFieldBlocked('publicationFrequency')}
                            canDelete={!this.isFieldBlocked('publicationFrequency')}
                          />
                          <PublicationRangeFields
                            canAdd={!this.isFieldBlocked('publicationRange')}
                            canEdit={!this.isFieldBlocked('publicationRange')}
                            canDelete={!this.isFieldBlocked('publicationRange')}
                          />
                          <DateFields
                            instanceDateTypeOptions={instanceDateTypeOptions}
                            initialDateTypeId={initialValues.dates?.dateTypeId}
                            disabled={this.isFieldBlocked('dates')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.instanceNotes" />
                            </h3>
                          )}
                          id="instanceSection07"
                        >
                          <NoteFields
                            canAdd={!this.isFieldBlocked('notes')}
                            canEdit={!this.isFieldBlocked('notes')}
                            canDelete={!this.isFieldBlocked('notes')}
                            noteTypeOptions={instanceNoteTypeOptions}
                            noteTypeIdField="instanceNoteTypeId"
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.electronicAccess" />
                            </h3>
                          )}
                          id="instanceSection08"
                        >
                          <ElectronicAccessFields
                            relationship={referenceTables.electronicAccessRelationships}
                            canAdd={!this.isFieldBlocked('electronicAccess')}
                            canEdit={!this.isFieldBlocked('electronicAccess')}
                            canDelete={!this.isFieldBlocked('electronicAccess')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.subject" />
                            </h3>
                          )}
                          id="instanceSection09"
                        >
                          <SubjectFields
                            subjectSources={referenceTables.subjectSources}
                            subjectTypes={referenceTables.subjectTypes}
                            canAdd={!this.isFieldBlocked('subjects')}
                            canEdit={!this.isFieldBlocked('subjects')}
                            canDelete={!this.isFieldBlocked('subjects')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.classification" />
                            </h3>
                          )}
                          id="instanceSection10"
                        >
                          <ClassificationFields
                            classificationTypes={referenceTables.classificationTypes}
                            canAdd={!this.isFieldBlocked('classifications')}
                            canEdit={!this.isFieldBlocked('classifications')}
                            canDelete={!this.isFieldBlocked('classifications')}
                          />
                        </Accordion>
                        <Accordion
                          label={(
                            <h3>
                              <FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />
                            </h3>
                          )}
                          id="instanceSection11"
                        >
                          <ChildInstanceFields
                            relationshipTypes={relationshipTypes}
                            canAdd={!this.isFieldBlocked('childInstances')}
                            canEdit={!this.isFieldBlocked('childInstances')}
                            canDelete={!this.isFieldBlocked('childInstances')}
                          />
                          <ParentInstanceFields
                            relationshipTypes={relationshipTypes}
                            canAdd={!this.isFieldBlocked('parentInstances')}
                            canEdit={!this.isFieldBlocked('parentInstances')}
                            canDelete={!this.isFieldBlocked('publicInstances')}
                          />

                        </Accordion>
                      </AccordionSet>
                    </AccordionStatus>
                  </div>
                </Pane>
              </Paneset>
            </HasCommand>
          </form>
        )}
      </IntlConsumer>
    );
  }
}

export default withRouter(stripesFinalForm({
  validate,
  navigationCheck: true,
})(stripesConnect(InstanceForm)));
