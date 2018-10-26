import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Paneset,
  Pane,
  PaneMenu,
  Accordion,
  ExpandAllButton,
  Row,
  Col,
  Button,
  TextField,
  Select,
  Checkbox,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  LocationSelection,
  LocationLookup,
  ViewMetaData,
} from '@folio/stripes/smart-components';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';

import RepeatableField from '../../components/RepeatableField';


import HoldingsStatementFields from './holdingsStatementFields';
import HoldingsStatementForSupplementsFields from './holdingsStatementForSupplementsFields';
import HoldingsStatementForIndexesFields from './holdingsStatementForIndexesFields';
import ElectronicAccessFields from '../electronicAccessFields';


// eslint-disable-next-line no-unused-vars
function validate(values, props) {
  const errors = {};
  if (!values.permanentLocationId) {
    errors.permanentLocationId = props.formatMsg({ id: 'ui-inventory.selectToContinue' });
  }

  return errors;
}

class HoldingsForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    copy: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    instance: PropTypes.object,
    referenceTables: PropTypes.object.isRequired,
    change: PropTypes.func,
    formatMsg: PropTypes.func,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmPermanentLocation: false,
      confirmTemporaryLocation: false,
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

  componentDidMount() {
    const { initialValues } = this.props;
    const prevPermanentLocation = initialValues.permanentLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevPermanentLocation });

    const prevTemporaryLocation = initialValues.temporaryLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevTemporaryLocation });

    this.onSave = this.onSave.bind(this);
  }

  onSave(data) {
    if (!data.temporaryLocationId) {
      delete data.temporaryLocationId;
    }
    if (!data.permanentLocationId) {
      delete data.permanentLocationId;
    }

    this.props.onSubmit(data);
  }

  selectPermanentLocation(permanentLocation) {
    if (!permanentLocation) {
      this.props.change('permanentLocationId', '');
      return;
    }

    if (permanentLocation.isActive) {
      this.setState({ prevPermanentLocation: permanentLocation });
      setTimeout(() => this.props.change('permanentLocationId', permanentLocation.id));
    } else {
      this.setState({ confirmPermanentLocation: true, permanentLocation });
    }
  }

  selectTemporaryLocation(temporaryLocation) {
    if (!temporaryLocation) {
      this.props.change('temporaryLocationId', '');
      return;
    }

    if (temporaryLocation.isActive) {
      this.setState({ prevTemporaryLocation: temporaryLocation });
      setTimeout(() => this.props.change('temporaryLocationId', temporaryLocation.id));
    } else {
      this.setState({ confirmTemporaryLocation: true, temporaryLocation });
    }
  }

  confirmPermanentLocation(confirm) {
    const { permanentLocation, prevPermanentLocation } = this.state;
    const confirmPermanentLocation = false;
    const value = (confirm) ? permanentLocation.id : prevPermanentLocation.id;
    const prevPermanentLoc = (confirm) ? permanentLocation : prevPermanentLocation;
    setTimeout(() => this.props.change('permanentLocationId', value));
    this.setState({ confirmPermanentLocation, prevPermanentLocation: prevPermanentLoc });
  }

  confirmTemporaryLocation(confirm) {
    const { temporaryLocation, prevTemporaryLocation } = this.state;
    const confirmTemporaryLocation = false;
    const value = (confirm) ? temporaryLocation.id : prevTemporaryLocation.id;
    const prevTemporaryLoc = (confirm) ? temporaryLocation : prevTemporaryLocation;
    setTimeout(() => this.props.change('temporaryLocationId', value));
    this.setState({ confirmTemporaryLocation, prevTemporaryLocation: prevTemporaryLoc });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
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
      instance,
      referenceTables,
      copy,
    } = this.props;
    const formatMsg = this.props.formatMsg;
    const { confirmPermanentLocation, confirmTemporaryLocation } = this.state;

    /* Menus for Add Item workflow */
    const addHoldingsLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-create-item"
          type="submit"
          title={formatMsg({ id: 'ui-inventory.createHoldingsRecord' })}
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit(this.onSave)}
          marginBottom0
        >
          Create holdings record
        </Button>
      </PaneMenu>
    );
    const editHoldingsLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-update-item"
          type="submit"
          title={formatMsg({ id: 'ui-inventory.updateHoldingsRecord' })}
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit(this.onSave)}
          marginBottom0
        >
          Update holdings record
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
            lastMenu={initialValues.id ? editHoldingsLastMenu : addHoldingsLastMenu}
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                <strong>{instance.title}</strong>
                {(instance.publication && instance.publication.length > 0) &&
                  <div>
                    <em>
                      {instance.publication[0].publisher}
                      {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                    </em>
                  </div>
                }
              </div>
            }
          >
            <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
            <Row>
              <Col sm={5}>
                <h2>{formatMsg({ id: 'ui-inventory.holdingsRecord' })}</h2>
              </Col>
            </Row>
            <Accordion
              open={this.state.accordions.accordion01}
              id="accordion01"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.administrativeData' })}
            >
              <Row>
                <Col sm={4}>
                  <Field
                    label={`${formatMsg({ id: 'ui-inventory.discoverySuppress' })}`}
                    name="discoverySuppress"
                    id="input_discovery_suppress"
                    component={Checkbox}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={8}>
                  <Field
                    name="hrid"
                    type="text"
                    component={TextField}
                    label={`${formatMsg({ id: 'ui-inventory.holdingsHrid' })}`}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <RepeatableField
                    name="formerIds"
                    addButtonId="clickable-add-formerholdingsid"
                    template={[{
                      label: formatMsg({ id: 'ui-inventory.formerHoldingsId' }),
                      component: TextField,
                    }]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion02}
              id="accordion02"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.locations' })}
            >
              <Row>
                <Col sm={4}>
                  { (initialValues.metadata && initialValues.metadata.createdDate) &&
                  <this.cViewMetaData metadata={initialValues.metadata} />
                  }
                  <Field
                    label={`${formatMsg({ id: 'ui-inventory.permanentLocation' })} *`}
                    placeholder={formatMsg({ id: 'ui-inventory.selectLocation' })}
                    name="permanentLocationId"
                    id="additem_permanentlocation"
                    component={LocationSelection}
                    fullWidth
                    marginBottom0
                    onSelect={loc => this.selectPermanentLocation(loc)}
                  />
                  <LocationLookup onLocationSelected={loc => this.selectPermanentLocation(loc)} />
                </Col>
                <Col sm={4}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.temporaryLocation' })}
                    placeholder={formatMsg({ id: 'ui-inventory.selectLocation' })}
                    name="temporaryLocationId"
                    id="additem_temporarylocation"
                    component={LocationSelection}
                    fullWidth
                    marginBottom0
                    onSelect={loc => this.selectTemporaryLocation(loc)}
                  />
                  <LocationLookup onLocationSelected={loc => this.selectTemporaryLocation(loc)} isTemporaryLocation />
                </Col>
              </Row>
              <ConfirmationModal
                id="confirmPermanentLocationModal"
                open={confirmPermanentLocation}
                heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
                message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
                confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
                buttonStyle="default"
                cancelButtonStyle="primary"
                onConfirm={() => { this.confirmPermanentLocation(true); }}
                onCancel={() => { this.confirmPermanentLocation(false); }}
              />
              <ConfirmationModal
                id="confirmTemporaryLocationModal"
                open={confirmTemporaryLocation}
                heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
                message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
                confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
                buttonStyle="default"
                cancelButtonStyle="primary"
                onConfirm={() => { this.confirmTemporaryLocation(true); }}
                onCancel={() => { this.confirmTemporaryLocation(false); }}
              />
              <Row>
                <Col sm={4}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.shelvingOrder' })}
                    name="shelvingOrder"
                    id="additem_shelvingorder"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={4}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.shelvingTitle' })}
                    name="shelvingTitle"
                    id="additem_shelvingtitle"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.copyNumber' })}
                    name="copyNumber"
                    id="additem_copynumber"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.callNumberType' })}
                    name="callNumberTypeId"
                    id="additem_callnumbertype"
                    component={Select}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.callNumberPrefix' })}
                    name="callNumberPrefix"
                    id="additem_callnumberprefix"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.callNumber' })}
                    name="callNumber"
                    id="additem_callnumber"
                    component={TextField}
                    fullWidth
                  />
                </Col>
                <Col sm={2}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.callNumberSuffix' })}
                    name="callNumberSuffix"
                    id="additem_callnumbersuffix"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion03}
              id="accordion03"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.holdingsDetails' })}
            >
              <Row>
                <Col sm={8}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.numberOfItems' })}
                    name="numberOfItems"
                    id="edititem_numberofitems"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <HoldingsStatementFields formatMsg={formatMsg} />
                  <HoldingsStatementForSupplementsFields formatMsg={formatMsg} />
                  <HoldingsStatementForIndexesFields formatMsg={formatMsg} />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion04}
              id="accordion04"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.notes' })}
            >
              <Row>
                <Col sm={3}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.acquisitionFormat' })}
                    name="acquisitionFormat"
                    id="edit_acquisitionformat"
                    component={TextField}
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.acquisitionMethod' })}
                    name="acquisitionMethod"
                    id="edit_acquisitionmethod"
                    component={TextField}
                  />
                </Col>
                <Col sm={3}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.receiptStatus' })}
                    name="receiptStatus"
                    id="edit_receiptstatus"
                    component={TextField}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <RepeatableField
                    name="notes"
                    addButtonId="clickable-add-note"
                    template={[
                      {
                        name: 'type',
                        label: formatMsg({ id: 'ui-inventory.noteType' }),
                        component: Select,
                        dataOptions: [{ label: 'Select type', value: '' }, 
                                      { label: 'Action note', value: 'action note'},
                                      { label: 'Binding', value: 'binding'},
                                      { label: 'Copy note', value: 'copy note'},
                                      { label: 'Electronic bookplace', value: 'electronic bookplate'},
                                      { label: 'Note', value: 'note'},
                                      { label: 'Provenance', value: 'provenance'},
                                      { label: 'Reproduction', value: 'reproduction'},
                                     ],
                      },
                      {
                        name: 'note',
                        label: formatMsg({ id: 'ui-inventory.note' }),
                        component: TextField,
                      },
                      {
                        name: 'staffOnly',
                        label: formatMsg({ id: 'ui-inventory.staffOnly' }),
                        component: Checkbox,
                      }
                    ]}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion05}
              id="accordion05"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.acquisitions' })}
            />
            <Accordion
              open={this.state.accordions.accordion06}
              id="accordion06"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
            >
              <ElectronicAccessFields electronicAccessRelationships={referenceTables.electronicAccessRelationships} formatMsg={formatMsg} />
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion07}
              id="accordion07"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.receivingHistory' })}
            />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'holdingsForm',
  navigationCheck: true,
  validate,
})(HoldingsForm);
