import React from 'react';
import PropTypes from 'prop-types';
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
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  LocationSelection,
  LocationLookup,
  ViewMetaData,
} from '@folio/stripes/smart-components';
import { Field, FieldArray } from 'redux-form';

import stripesForm from '@folio/stripes/form';

import renderStatements from './holdingsStatementFields';

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

    const platformOptions = (referenceTables.platforms || []).map(l => ({
      label: l.name,
      value: l.id,
      selected: initialValues.electronicLocation ? initialValues.electronicLocation.platformId === l.id : false,
    }));

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
              <Col sm={5} smOffset={1}>
                <h2>{formatMsg({ id: 'ui-inventory.holdingsRecord' })}</h2>
              </Col>
            </Row>
            <Accordion
              open={this.state.accordions.accordion01}
              id="accordion01"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.administrativeData' })}
            />
            <Accordion
              open={this.state.accordions.accordion02}
              id="accordion02"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.locations' })}
            >
              <Row>
                <Col sm={5} smOffset={1}>
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
                <Col sm={5} smOffset={1}>
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
              <Row>
                <Col sm={5} smOffset={1}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.callNumber' })}
                    name="callNumber"
                    id="additem_callnumber"
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
              <FieldArray name="holdingsStatements" component={renderStatements} formatMsg={formatMsg} />
            </Accordion>
            <Accordion
              open={this.state.accordions.accordion04}
              id="accordion04"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.notes' })}
            />
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
              <Row>
                <Col sm={5} smOffset={1}>
                  <Field
                    label={formatMsg({ id: 'ui-inventory.platform' })}
                    name="electronicLocation.platformId"
                    id="additem_platformid"
                    component={Select}
                    fullWidth
                    dataOptions={[{ label: formatMsg({ id: 'ui-inventory.selectPlatform' }), value: '' }, ...platformOptions]}
                  />
                  <Field
                    label={formatMsg({ id: 'ui-inventory.uri' })}
                    name="electronicLocation.uri"
                    id="additem_uri"
                    component={TextField}
                    fullWidth
                  />
                </Col>
              </Row>
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
