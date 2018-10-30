import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {
  Accordion,
  Paneset,
  Pane,
  PaneMenu,
  Row,
  Col,
  Button,
  TextField,
  Select,
  Checkbox,
  Headline,
  Datepicker,
} from '@folio/stripes/components';

import { Field } from 'redux-form';
import stripesForm from '@folio/stripes/form';
import { ViewMetaData } from '@folio/stripes/smart-components';

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

function validate(values, props) {
  const errors = {};
  const formatMsg = props.stripes.intl.formatMessage;

  const requiredTextMessage = formatMsg({ id: 'ui-inventory.fillIn' });
  const requiredSelectMessage = formatMsg({ id: 'ui-inventory.selectToContinue' });
  const requiredPublicationFieldMessage = formatMsg({ id: 'ui-inventory.onePublicationFieldToContinue' });

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

function checkUniqueHrid(okapi, hrid) {
  return fetch(`${okapi.url}/inventory/instances?query=(hrid=="${hrid}")`,
    { headers: Object.assign({}, { 'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json' }) });
}

function asyncValidate(values, dispatch, props, blurredField) {
  const hridTakenMsg = props.stripes.intl.formatMessage({ id: 'ui-inventory.hridTaken' });
  if (blurredField === 'hrid' && values.hrid !== props.initialValues.hrid) {
    return new Promise((resolve, reject) => {
      checkUniqueHrid(props.stripes.okapi, values.hrid).then((response) => {
        if (response.status >= 400) {
          //
        } else {
          response.json().then((json) => {
            if (json.totalRecords > 0) {
              const error = { hrid: hridTakenMsg };
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
    const formatMsg = this.props.stripes.intl.formatMessage;

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

    /* Menus for Add Instance workflow */
    const addInstanceLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-create-instance"
          type="submit"
          title={formatMsg({ id: 'ui-inventory.createInstance' })}
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          {formatMsg({ id: 'ui-inventory.createInstance' })}
        </Button>
      </PaneMenu>
    );
    const editInstanceLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-update-instance"
          type="submit"
          title={formatMsg({ id: 'ui-inventory.updateInstance' })}
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          {formatMsg({ id: 'ui-inventory.updateInstance' })}
        </Button>
      </PaneMenu>
    );
    return (
      <form>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            lastMenu={initialValues.id ? editInstanceLastMenu : addInstanceLastMenu}
            paneTitle={initialValues.id ? 'Edit Instance' : 'New Instance'}
          >
            <div>
              <Headline size="large" tag="h3">{formatMsg({ id: 'ui-inventory.instanceRecord' })}</Headline>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.administrativeData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection01} id="instanceSection01">
                { (initialValues.metadata && initialValues.metadata.createdDate) &&
                  <this.cViewMetaData metadata={initialValues.metadata} />
                }
                <Row>
                  <Col sm={3}>
                    <Field
                      label={`${formatMsg({ id: 'ui-inventory.discoverySuppress' })}`}
                      name="discoverySuppress"
                      id="input_discovery_suppress"
                      component={Checkbox}
                    />
                  </Col>
                  <Col sm={3}>
                    <Field
                      label={`${formatMsg({ id: 'ui-inventory.staffSuppress' })}`}
                      name="staffSuppress"
                      id="input_staff_suppress"
                      component={Checkbox}
                    />
                  </Col>
                  <Col sm={3}>
                    <Field
                      label={`${formatMsg({ id: 'ui-inventory.previouslyHeld' })}`}
                      name="previouslyHeld"
                      id="input_previously_held"
                      component={Checkbox}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs={10} sm={5}>
                    <Field
                      name="hrid"
                      type="text"
                      component={TextField}
                      label={`${formatMsg({ id: 'ui-inventory.instanceHrid' })}`}
                    />
                  </Col>
                  <Col xs={10} sm={5}>
                    <Field
                      name="source"
                      type="text"
                      component={TextField}
                      disabled
                      label={`${formatMsg({ id: 'ui-inventory.metadataSource' })} *`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={10} sm={5}>
                    <Field
                      name="catalogedDate"
                      dateFormat="YYYY-MM-DD"
                      backendDateStandard="YYYY-MM-DD"
                      component={Datepicker}
                      label={formatMsg({ id: 'ui-inventory.catalogedDate' })}
                    />
                  </Col>
                </Row>
                <Col sm={10}>
                  <Field
                    name="statusId"
                    type="text"
                    component={Select}
                    label={formatMsg({ id: 'ui-inventory.instanceStatus' })}
                    dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectInstanceStatus' }), value: '' }, ...instanceStatusOptions]}
                  />
                </Col>
                <Col sm={10}>
                  <Field
                    name="modeOfIssuanceId"
                    type="text"
                    component={Select}
                    label={formatMsg({ id: 'ui-inventory.modeOfIssuance' })}
                    dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectModeOfIssuance' }), value: '' }, ...modeOfIssuanceOptions]}
                  />
                </Col>
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.titleData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection02} id="instanceSection02">
                <Col sm={10}>
                  <Field
                    label={`${formatMsg({ id: 'ui-inventory.resourceTitle' })} *`}
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
                <AlternativeTitles formatMsg={formatMsg} />
                <Col sm={10}>
                  <Field
                    label={`${formatMsg({ id: 'ui-inventory.indexTitle' })} *`}
                    name="indexTitle"
                    id="input_index_title"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <SeriesFields formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.identifiers' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection03} id="instanceSection03">
                <IdentifierFields identifierTypes={referenceTables.identifierTypes} formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.contributors' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection04} id="instanceSection04">
                <ContributorFields contributorNameTypes={referenceTables.contributorNameTypes} contributorTypes={referenceTables.contributorTypes} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.descriptiveData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection05} id="instanceSection05">
                <PublicationFields formatMsg={formatMsg} />
                <EditionFields formatMsg={formatMsg} />
                <DescriptionFields formatMsg={formatMsg} />
                <Col sm={10}>
                  <Field
                    name="instanceTypeId"
                    id="select_instance_type"
                    type="text"
                    component={Select}
                    label={`${formatMsg({ id: 'ui-inventory.resourceType' })} *`}
                    dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectResourceType' }), value: '' }, ...instanceTypeOptions]}
                    required
                  />
                </Col>
                <InstanceFormatFields instanceFormats={referenceTables.instanceFormats} formatMsg={formatMsg} />
                <LanguageFields formatMsg={formatMsg} />
                <PublicationFrequencyFields formatMsg={formatMsg} />
                <PublicationRangeFields formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.notes' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection07} id="instanceSection07">
                <NoteFields formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.electronicAccess' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection08} id="instanceSection08">
                <ElectronicAccessFields electronicAccessRelationships={referenceTables.electronicAccessRelationships} formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.subjects' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection09} id="instanceSection09">
                <SubjectFields formatMsg={formatMsg} />
              </Accordion>
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.classifications' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection10} id="instanceSection10">
                <ClassificationFields classificationTypes={referenceTables.classificationTypes} formatMsg={formatMsg} />
              </Accordion>
              {/* <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.otherRelatedInstances' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection11} id="instanceSection11">
              </Accordion> */}
              <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.instanceRelationships' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection11} id="instanceSection12">
                <ParentInstanceFields instanceRelationshipTypes={referenceTables.instanceRelationshipTypes} />
                <ChildInstanceFields instanceRelationshipTypes={referenceTables.instanceRelationshipTypes} />
              </Accordion>
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
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
  }),
};

export default stripesForm({
  form: 'instanceForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['hrid'],
  navigationCheck: true,
  enableReinitialize: true,
})(InstanceForm);
