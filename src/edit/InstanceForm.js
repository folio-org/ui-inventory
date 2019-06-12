import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { cloneDeep, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  Accordion,
  Paneset,
  Pane,
  PaneMenu,
  Row,
  Col,
  Button,
  Icon,
  TextField,
  Select,
  Checkbox,
  Headline,
  Datepicker,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import RepeatableField from '../components/RepeatableField';

import AlternativeTitles from './alternativeTitles';
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
import ChildInstanceFields from './childInstanceFields';
import ParentInstanceFields from './parentInstanceFields';

function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-inventory.fillIn" />;
  const requiredSelectMessage = <FormattedMessage id="ui-inventory.selectToContinue" />;
  const requiredPublicationFieldMessage = <FormattedMessage id="ui-inventory.onePublicationFieldToContinue" />;

  if (!values.title) {
    errors.title = requiredTextMessage;
  }

  if (!values.instanceTypeId) {
    errors.instanceTypeId = requiredSelectMessage;
  }

  // Language not required, but must be not null if supplied
  if (values.languages && values.languages.length) {
    const errorList = [];
    values.languages.forEach((item, i) => {
      if (!item) {
        errorList[i] = requiredSelectMessage;
      }
    });
    if (errorList.length) errors.languages = errorList;
  }


  if (values.alternativeTitles && values.alternativeTitles.length) {
    const errorList = [];
    values.alternativeTitles.forEach((item, i) => {
      const error = {};

      if (!item.alternativeTitleTypeId) {
        error.alternativeTitleTypeId = requiredSelectMessage;
      }

      if (!item.alternativeTitleTypeId) {
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
  ];

  optionalLists.forEach((l) => {
    if (values[l.list] && values[l.list].length) {
      const errorList = [];
      values[l.list].forEach((item, i) => {
        const entryErrors = {};

        l.textFields.forEach((field) => {
          if (!item || !item[field]) {
            entryErrors[field] = requiredTextMessage;
            errorList[i] = entryErrors;
          }
        });

        l.selectFields.forEach((field) => {
          if (!item || !item[field]) {
            entryErrors[field] = requiredSelectMessage;
            errorList[i] = entryErrors;
          }
        });
      });

      if (errorList.length) {
        errors[l.list] = errorList;
      }
    }
  });
  return errors;
}

class InstanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: {
        instanceSection01: true,
        instanceSection02: true,
        instanceSection03: true,
        instanceSection04: true,
        instanceSection05: true,
        instanceSection06: true,
        instanceSection07: true,
        instanceSection08: true,
        instanceSection09: true,
        instanceSection10: true,
        instanceSection11: true,
        instanceSection12: true,
      },
    };

    this.onToggleSection = this.onToggleSection.bind(this);
    this.cViewMetaData = this.props.stripes.connect(ViewMetaData);
  }

  onToggleSection({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState); // remember to safely copy state! using lodash's cloneDeep() for example.
      newState.sections[id] = !curState.sections[id];
      return newState;
    });
  }

  getPaneTitle() {
    const {
      initialValues,
    } = this.props;

    const titleTranslationKey = initialValues.id ? 'ui-inventory.editInstance' : 'ui-inventory.newInstance';

    return (
      <span data-test-header-title>
        <FormattedMessage id={titleTranslationKey} />
      </span>
    );
  }

  getActionMenu = ({ onToggle }) => {
    const { onCancel } = this.props;
    const cancel = () => {
      onToggle();
      onCancel();
    };

    return (
      <Button
        buttonStyle="dropdownItem"
        id="cancel-instance-edition"
        onClick={cancel}
      >
        <Icon icon="times-circle">
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
      referenceTables,
      copy,
    } = this.props;

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
      return ref || {};
    };

    const instanceTypeOptions = referenceTables.instanceTypes ? referenceTables.instanceTypes.map(
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

    const statisticalCodeOptions = referenceTables.statisticalCodes ? referenceTables.statisticalCodes.map(
      it => ({
        label: refLookup(referenceTables.statisticalCodeTypes, it.statisticalCodeTypeId).name + ':    ' + it.code + ' - ' + it.name,
        value: it.id,
        selected: it.id === initialValues.statisticalCodeId,
      }),
    ) : [];

    /* Menus for Add Instance workflow */
    const addInstanceLastMenu = (
      <PaneMenu>
        <FormattedMessage id="ui-inventory.createInstance">
          {ariaLabel => (
            <Button
              buttonStyle="primary paneHeaderNewButton"
              id="clickable-create-instance"
              type="submit"
              aria-label={ariaLabel}
              disabled={(pristine || submitting) && !copy}
              onClick={handleSubmit}
              marginBottom0
            >
              <FormattedMessage id="ui-inventory.createInstance" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    );

    const editInstanceLastMenu = (
      <PaneMenu>
        <FormattedMessage id="ui-inventory.updateInstance">
          {ariaLabel => (
            <Button
              buttonStyle="primary paneHeaderNewButton"
              id="clickable-update-instance"
              type="submit"
              aria-label={ariaLabel}
              disabled={(pristine || submitting) && !copy}
              onClick={handleSubmit}
              marginBottom0
            >
              <FormattedMessage id="ui-inventory.updateInstance" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    );

    return (
      <form data-test-instance-page-type={initialValues.id ? 'edit' : 'create'}>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            lastMenu={initialValues.id ? editInstanceLastMenu : addInstanceLastMenu}
            paneTitle={this.getPaneTitle()}
            actionMenu={this.getActionMenu}
          >
            <div>
              <Headline
                size="large"
                tag="h3"
              >
                <FormattedMessage id="ui-inventory.instanceRecord" />
              </Headline>
              <Accordion
                label={
                  <h3>
                    <FormattedMessage id="ui-inventory.administrativeData" />
                  </h3>
                }
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection01}
                id="instanceSection01"
              >
                {(initialValues.metadata && initialValues.metadata.createdDate) &&
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
                    />
                  </Col>
                  <Col sm={3}>
                    <Field
                      label={<FormattedMessage id="ui-inventory.staffSuppress" />}
                      name="staffSuppress"
                      id="input_staff_suppress"
                      component={Checkbox}
                      type="checkbox"
                    />
                  </Col>
                  <Col sm={3}>
                    <Field
                      label={<FormattedMessage id="ui-inventory.previouslyHeld" />}
                      name="previouslyHeld"
                      id="input_previously_held"
                      component={Checkbox}
                      type="checkbox"
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
                    />
                  </Col>
                </Row>
                <Col sm={10}>
                  <FormattedMessage id="ui-inventory.selectInstanceStatus">
                    {placeholder => (
                      <Field
                        label={<FormattedMessage id="ui-inventory.instanceStatus" />}
                        name="statusId"
                        type="text"
                        component={Select}
                        placeholder={placeholder}
                        dataOptions={instanceStatusOptions}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <Col sm={10}>
                  <FormattedMessage id="ui-inventory.selectModeOfIssuance">
                    {placeholder => (
                      <Field
                        label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
                        name="modeOfIssuanceId"
                        type="text"
                        component={Select}
                        placeholder={placeholder}
                        dataOptions={modeOfIssuanceOptions}
                      />
                    )}
                  </FormattedMessage>
                </Col>
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
                label={
                  <h3>
                    <FormattedMessage id="ui-inventory.titleData" />
                  </h3>
                }
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection02}
                id="instanceSection02"
              >
                <Col sm={10}>
                  <Field
                    label={(
                      <FormattedMessage id="ui-inventory.resourceTitle">
                        {message => message}
                      </FormattedMessage>
                    )}
                    name="title"
                    id="input_instance_title"
                    component={TextField}
                    fullWidth
                    required
                  />
                </Col>
                <Field
                  type="hidden"
                  name="source"
                  component="input"
                />
                <AlternativeTitles alternativeTitleTypes={referenceTables.alternativeTitleTypes} />
                <Col sm={10}>
                  <Field
                    label={<FormattedMessage id="ui-inventory.indexTitle" />}
                    name="indexTitle"
                    id="input_index_title"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <SeriesFields />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.identifiers" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection03}
                id="instanceSection03"
              >
                <IdentifierFields identifierTypes={referenceTables.identifierTypes} />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.contributors" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection04}
                id="instanceSection04"
              >
                <ContributorFields
                  contributorNameTypes={referenceTables.contributorNameTypes}
                  contributorTypes={referenceTables.contributorTypes}
                />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.descriptiveData" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection05}
                id="instanceSection05"
              >
                <PublicationFields />
                <EditionFields />
                <DescriptionFields />
                <Col sm={10}>
                  <FormattedMessage id="ui-inventory.selectResourceType">
                    {placeholder => (
                      <Field
                        label={(
                          <FormattedMessage id="ui-inventory.resourceType">
                            {message => message}
                          </FormattedMessage>
                        )}
                        name="instanceTypeId"
                        id="select_instance_type"
                        type="text"
                        required
                        component={Select}
                        placeholder={placeholder}
                        dataOptions={instanceTypeOptions}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <InstanceFormatFields instanceFormats={referenceTables.instanceFormats} />
                <LanguageFields />
                <PublicationFrequencyFields />
                <PublicationRangeFields />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.notes" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection07}
                id="instanceSection07"
              >
                <NoteFields />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.electronicAccess" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection08}
                id="instanceSection08"
              >
                <ElectronicAccessFields relationship={referenceTables.electronicAccessRelationships} />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.subjects" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection09}
                id="instanceSection09"
              >
                <SubjectFields />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.classifications" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection10}
                id="instanceSection10"
              >
                <ClassificationFields classificationTypes={referenceTables.classificationTypes} />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.instanceRelationshipsAnalyticsBoundWith" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection11}
                id="instanceSection11"
              >
                <ParentInstanceFields instanceRelationshipTypes={referenceTables.instanceRelationshipTypes} />
                <ChildInstanceFields instanceRelationshipTypes={referenceTables.instanceRelationshipTypes} />
              </Accordion>
              <Accordion
                label={(
                  <h3>
                    <FormattedMessage id="ui-inventory.relatedInstances" />
                  </h3>
                )}
                onToggle={this.onToggleSection}
                open={this.state.sections.instanceSection12}
                id="instanceSection12"
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

InstanceForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newinstance: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  copy: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }),
};

export default stripesForm({
  form: 'instanceForm',
  validate,
  navigationCheck: true,
  enableReinitialize: true,
})(InstanceForm);
