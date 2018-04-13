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

import AlternativeTitles from './alternativeTitles';
import SeriesFields from './seriesFields';
import ContributorFields from './contributorFields';
import IdentifierFields from './identifierFields';
import SubjectFields from './subjectFields';
import ClassificationFields from './classificationFields';
import PublicationFields from './publicationFields';
import URLFields from './urlFields';
import DescriptionFields from './descriptionFields';
import NoteFields from './noteFields';
import LanguageFields from './languageFields';

function validate(values) {
  const errors = {};

  const requiredTextMessage = 'Please fill this in to continue';
  const requiredSelectMessage = 'Please select to continue';

  if (!values.title) {
    errors.title = requiredTextMessage;
  }

  if (!values.instanceTypeId) {
    errors.instanceTypeId = requiredSelectMessage;
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
    const addInstanceLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-instance" type="submit" title="Create New Instance" disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Create instance</Button></PaneMenu>;
    const editInstanceLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-instance" type="submit" title="Update Instance" disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Update instance</Button></PaneMenu>;
    return (
      <form>
        <Paneset isRoot>
          <Pane defaultWidth="100%" dismissible onClose={onCancel} lastMenu={initialValues.id ? editInstanceLastMenu : addInstanceLastMenu} paneTitle={initialValues.id ? 'Edit Instance' : 'New Instance'}>
            <Row>
              <Col sm={12}><Headline size="large" tag="h3">Instance Record</Headline>

                <Accordion label={<h3>Title data</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection1} id="instanceSection1">
                  <Row>
                    <Col sm={9}>
                      <Row>
                        <Col sm={8}>
                          <Field
                            label="Title *"
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
                      <AlternativeTitles />
                      <ContributorFields contributorNameTypes={referenceTables.contributorNameTypes} contributorTypes={referenceTables.contributorTypes} />
                      <Row>
                        <Col sm={8}>
                          <Field
                            name="instanceTypeId"
                            id="select_instance_type"
                            type="text"
                            component={Select}
                            label="Resource type *"
                            dataOptions={[{ label: 'Select resource type', value: '' }, ...instanceTypeOptions]}
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
                            label="Format"
                            dataOptions={[{ label: 'Select format', value: '' }, ...instanceFormatOptions]}
                          />
                        </Col>
                      </Row>
                      <IdentifierFields identifierTypes={referenceTables.identifierTypes} />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={<h3>Descriptive data</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection2} id="instanceSection2">
                  <Row>
                    <Col sm={9}>
                      <PublicationFields />
                      <Row>
                        <Col sm={8}>
                          <Field label="Edition" name="edition" id="input_instance_edition" component={TextField} fullWidth />
                        </Col>
                      </Row>
                      <DescriptionFields />
                      <LanguageFields />
                      <URLFields />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={<h3>Content data</h3>} onToggle={this.onToggleSection} open={this.state.sections.instanceSection3} id="instanceSection3">
                  <Row>
                    <Col sm={9}>
                      <SeriesFields />
                      <SubjectFields />
                      <ClassificationFields classificationTypes={referenceTables.classificationTypes} />
                      <NoteFields />
                    </Col>
                  </Row>
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
};

export default stripesForm({
  form: 'instanceForm',
  validate,
  asyncValidate,
  navigationCheck: true,
})(InstanceForm);
