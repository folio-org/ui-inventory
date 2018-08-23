import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import Select from '@folio/stripes-components/lib/Select';
import { Accordion } from '@folio/stripes-components/lib/Accordion';
import Headline from '@folio/stripes-components/lib/Headline';
import ViewMetaData from '@folio/stripes-smart-components/lib/ViewMetaData';

import AlternativeTitles from './alternativeTitles';
import SeriesFields from './seriesFields';
import ContributorFields from './contributorFields';
import IdentifierFields from './identifierFields';
import SubjectFields from './subjectFields';
import ClassificationFields from './classificationFields';
import PublicationFields from './publicationFields';
import PrecedingTitleFields from "./precedingTitleFields";
import SucceedingTitleFields from "./succeedingTitleFields";
import URLFields from './urlFields';
import DescriptionFields from './descriptionFields';
import NoteFields from './noteFields';
import LanguageFields from './languageFields';

function validate(values, props) {
  const errors = {};
  const formatMsg = props.stripes.intl.formatMessage;

  const requiredTextMessage = formatMsg({ id: 'ui-inventory.fillIn' });
  const requiredSelectMessage = formatMsg({ id: 'ui-inventory.selectToContinue' });
  const requiredPublicationFieldMessage = formatMsg({ id: 'ui-inventory.onePublicationFieldToContinue' });
  const requiredPrecedingTitleFieldMessage = formatMsg({ id: 'ui-inventory.onePrecedingTitleFieldToContinue' });
  const requiredSucceedingTitleFieldMessage = formatMsg({ id: 'ui-inventory.oneSucceedingTitleFieldToContinue' });


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
      if (!item || (!item.publisher && !item.dateOfPublication && !item.place && !item.role)) {
        entryErrors.publisher = requiredPublicationFieldMessage;
        errorList[i] = entryErrors;
      }
    });
    if (errorList.length) errors.publication = errorList;
  }

  if (values.precedingTitle) {
    const errorList = [];
    values.publication.forEach((item, i) => {
      const entryErrors = {};
      if (!item || (!item.title && !item.issn && !item.isbn)) {
        entryErrors.precedingTitle = requiredPrecedingTitleFieldMessage;
        errorList[i] = entryErrors;
      }
    });
    if (errorList.length) errors.precedingTitle = errorList;
  }

  if (values.succeedingTitle) {
    const errorList = [];
    values.publication.forEach((item, i) => {
      const entryErrors = {};
      if (!item || (!item.title && !item.issn && !item.isbn)) {
        entryErrors.succeedingTitle = requiredSucceedingTitleFieldMessage;
        errorList[i] = entryErrors;
      }
    });
    if (errorList.length) errors.succeedingTitle = errorList;
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

function asyncValidate(/* values, dispatch, props, blurredField */) {
  return new Promise(resolve => resolve());
}

class InstanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: {
        instanceSection1: true,
        instanceSection2: true,
        instanceSection3: true,
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

    const instanceFormatOptions = referenceTables.instanceFormats ? referenceTables.instanceFormats.map(
      it => ({
        label: it.name,
        value: it.id,
        selected: it.id === initialValues.instanceFormatId,
      }),
    ) : [];

    /* Menus for Add Instance workflow */
    const addInstanceLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-instance" type="submit" title={formatMsg({ id: 'ui-inventory.createInstance' })} disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>{formatMsg({ id: 'ui-inventory.createInstance' })}</Button></PaneMenu>;
    const editInstanceLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-instance" type="submit" title={formatMsg({ id: 'ui-inventory.updateInstance' })} disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>{formatMsg({ id: 'ui-inventory.updateInstance' })}</Button></PaneMenu>;
    return (
      <form>
        <Paneset isRoot>
          <Pane defaultWidth="100%" dismissible onClose={onCancel} lastMenu={initialValues.id ? editInstanceLastMenu : addInstanceLastMenu} paneTitle={initialValues.id ? 'Edit Instance' : 'New Instance'}>
            <Row>
              <Col sm={12}><Headline size="large" tag="h3">{formatMsg({ id: 'ui-inventory.instanceRecord' })}</Headline>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.administrativeData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.administrativeDataAccordion} id="administrativeDataAccordion">
                  { (initialValues.metadata && initialValues.metadata.createdDate) &&
                  <this.cViewMetaData metadata={initialValues.metadata} />
                  }
                  <Row>
                    <Col sm={9}>
                      <SeriesFields formatMsg={formatMsg} />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.titleData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.titleAccordion} id="titleAccordion">
                  <Row>
                    <Col sm={9}>
                      <Row>
                        <Col sm={8}>
                          <Field
                            label={`${formatMsg({ id: 'ui-inventory.resourceTitle' })} *`}
                            name="title"
                            id="input_instance_title"
                            component={TextField}
                            fullWidth
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={8}>
                          <Field
                            type="hidden"
                            name="source"
                            component="input"
                          />
                        </Col>
                      </Row>
                      <AlternativeTitles formatMsg={formatMsg} />
                      <Row>
                        <Col sm={8}>
                          <Field label={formatMsg({ id: 'ui-inventory.indexTitle' })} name="indexTitle" id="input_instance_indexTitle" component={TextField} fullWidth />
                        </Col>
                      </Row>
                      <PrecedingTitleFields formatMsg={formatMsg} />
                      <SucceedingTitleFields formatMsg={formatMsg} />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.identifiers' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.identifiersAccordion} id="identifiersAccordion">
                  <IdentifierFields identifierTypes={referenceTables.identifierTypes} formatMsg={formatMsg} />
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.contributors' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.contributionsAccordion} id="contributionsAccordion">
                  <ContributorFields contributorNameTypes={referenceTables.contributorNameTypes} contributorTypes={referenceTables.contributorTypes} />
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.descriptiveData' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.desctiptiveDataAccordion} id="desctiptiveDataAccordion">
                  <Row>
                    <Col sm={9}>
                      <PublicationFields formatMsg={formatMsg} />
                      <Row>
                        <Col sm={8}>
                          <Field label={formatMsg({ id: 'ui-inventory.edition' })} name="edition" id="input_instance_edition" component={TextField} fullWidth />
                        </Col>
                      </Row>
                      <DescriptionFields formatMsg={formatMsg} />
                      <Row>
                      <Col sm={8}>
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
                    </Row>
                      <Row>
                        <Col sm={8}>
                          <Field
                            name="instanceFormatId"
                            type="text"
                            component={Select}
                            label={formatMsg({ id: 'ui-inventory.format' })}
                            dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectFormat' }), value: '' }, ...instanceFormatOptions]}
                          />
                        </Col>
                      </Row>
                      <LanguageFields formatMsg={formatMsg} />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.notes' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.notesAccordion} id="notesAccordion">
                  <NoteFields formatMsg={formatMsg} />
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.electronicAccess' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.electronicAccessAccordion} id="electronicAccessAccordion">
                  <URLFields formatMsg={formatMsg} />
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.subjects' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.subjectsAccordion} id="subjectsAccordion">
                  <SubjectFields formatMsg={formatMsg} />
                </Accordion>
                <Accordion label={<h3>{formatMsg({ id: 'ui-inventory.classification' })}</h3>} onToggle={this.onToggleSection} open={this.state.sections.classificationAccordion} id="classificationAccordion">
                  <ClassificationFields classificationTypes={referenceTables.classificationTypes} formatMsg={formatMsg} />
                </Accordion>
              </Col>
            </Row>
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
  navigationCheck: true,
})(InstanceForm);
