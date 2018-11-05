import React from 'react';
import { get, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Paneset,
  Pane,
  PaneMenu,
  Row,
  Col,
  Button,
  Accordion,
  ExpandAllButton,
  ConfirmationModal,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import {
  ViewMetaData,
} from '@folio/stripes/smart-components';

function validate(values) {
  const errors = {};
  const selectToContinueMsg = <FormattedMessage id="ui-inventory.selectToContinue" />;

  if (!(values.materialType && values.materialType.id)) {
    errors.materialType = { id: selectToContinueMsg };
  }

  if (!(values.permanentLoanType && values.permanentLoanType.id)) {
    errors.permanentLoanType = { id: selectToContinueMsg };
  }

  return errors;
}

function checkUniqueBarcode(okapi, barcode) {
  return fetch(`${okapi.url}/inventory/items?query=(barcode=="${barcode}")`,
    { headers: Object.assign({}, { 'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
      'Content-Type': 'application/json' }) });
}

function asyncValidate(values, dispatch, props, blurredField) {
  const barcodeTakenMsg = props.intl.formatMessage({ id: 'ui-inventory.barcodeTaken' });
  if (blurredField === 'barcode' && values.barcode !== props.initialValues.barcode) {
    return new Promise((resolve, reject) => {
      // TODO: Should use stripes-connect (dispatching an action and update state)
      checkUniqueBarcode(props.okapi, values.barcode).then((response) => {
        if (response.status >= 400) {
          //
        } else {
          response.json().then((json) => {
            if (json.totalRecords > 0) {
              const error = { barcode: barcodeTakenMsg };
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

class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        itemAccordion: true,
        conditionsAccordion: true,
        locationAccordion: true,
        administrativeAccordion: true,
        enumerationAccordion: true,
        notesAccordion: true,
        loanDataAccordion: true,
        acquisitionsAccordion: true,
        electronicAccordion: true,
      },
      confirmPermanentLocation: false,
      confirmTemporaryLocation: false,
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
  }

  selectPermanentLocation(permanentLocation) {
    if (!permanentLocation) {
      this.props.change('permanentLocation', {});
      return;
    }

    if (permanentLocation.isActive) {
      setTimeout(() => this.props.change('permanentLocation.id', permanentLocation.id));
      this.setState({ prevPermanentLocation: permanentLocation });
    } else {
      this.setState({ confirmPermanentLocation: true, permanentLocation });
    }
  }

  selectTemporaryLocation(temporaryLocation) {
    if (!temporaryLocation) {
      this.props.change('temporaryLocation', {});
      return;
    }

    if (temporaryLocation.isActive) {
      setTimeout(() => this.props.change('temporaryLocation.id', temporaryLocation.id));
      this.setState({ prevTemporaryLocation: temporaryLocation });
    } else {
      this.setState({ confirmTemporaryLocation: true, temporaryLocation });
    }
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  confirmPermanentLocation(confirm) {
    const { permanentLocation, prevPermanentLocation } = this.state;
    const confirmPermanentLocation = false;
    const value = (confirm) ? permanentLocation.id : prevPermanentLocation.id;
    const prevPermanentLoc = (confirm) ? permanentLocation : prevPermanentLocation;

    setTimeout(() => this.props.change('permanentLocation.id', value));
    this.setState({ confirmPermanentLocation, prevPermanentLocation: prevPermanentLoc });
  }

  confirmTemporaryLocation(confirm) {
    const { temporaryLocation, prevTemporaryLocation } = this.state;
    const confirmTemporaryLocation = false;
    const value = (confirm) ? temporaryLocation.id : prevTemporaryLocation.id;
    const prevTemporaryLoc = (confirm) ? temporaryLocation : prevTemporaryLocation;

    setTimeout(() => this.props.change('temporaryLocation.id', value));
    this.setState({ confirmTemporaryLocation, prevTemporaryLocation: prevTemporaryLoc });
  }

  render() {
    const {
      handleSubmit,
      reset, // eslint-disable-line no-unused-vars
      pristine,
      submitting,
      onCancel,
      initialValues,
      instance,
      holdingsRecord,
      referenceTables,
      copy,
      intl,
    } = this.props;
    const formatMsg = intl.formatMessage;

    const { confirmPermanentLocation, confirmTemporaryLocation } = this.state;
    const { locationsById } = referenceTables;
    const holdingLocation = locationsById[holdingsRecord.permanentLocationId];

    /* Menus for Add Item workflow */
    const addItemLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-create-item"
          type="submit"
          title="Create New Item"
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          Create item
        </Button>
      </PaneMenu>
    );
    const editItemLastMenu = (
      <PaneMenu>
        <Button
          buttonStyle="primary paneHeaderNewButton"
          id="clickable-update-item"
          type="submit"
          title="Update Item"
          disabled={(pristine || submitting) && !copy}
          onClick={handleSubmit}
          marginBottom0
        >
          Update item
        </Button>
      </PaneMenu>
    );

    const labelLocation = get(holdingLocation, ['name'], '');
    const labelCallNumber = holdingsRecord.callNumber || '';

    return (
      <form>
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            dismissible
            onClose={onCancel}
            lastMenu={(initialValues.id) ? editItemLastMenu : addItemLastMenu}
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                <em>
                  Edit
                  {' '}
                  {instance.title}
                </em>
                {(instance.publication && instance.publication.length > 0) &&
                <span>
                  <em>, </em>
                  <em>
                    {instance.publication[0].publisher}
                    {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                  </em>
                </span>
                }
                <div>
                  &nbsp;
                  {`Holdings: ${labelLocation} > ${labelCallNumber}`}
                </div>
              </div>
            }
          >
            <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.accordions} onToggle={this.handleExpandAll} /></Col></Row>
            <Accordion
              open={this.state.accordions.administrativeAccordion}
              id="administrativeAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.administrativeData' })}
            />
            <Accordion
              open={this.state.accordions.itemAccordion}
              id="itemAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.itemData' })}
            />
            <Accordion
              open={this.state.accordions.enumerationAccordion}
              id="enumerationAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.enumerationData' })}
            />
            <Accordion
              open={this.state.accordions.conditionsAccordion}
              id="conditionsAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.conditions' })}
            />
            <Accordion
              open={this.state.accordions.notesAccordion}
              id="notesAccordion"
              onToggle={this.handleAccordionToggle}
              label={intl.formatMessage({ id: 'ui-inventory.notes' })}
            />
            <Accordion
              open={this.state.accordions.loanDataAccordion}
              id="loanDataAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.item.availability' })}
            />
            <Accordion
              open={this.state.accordions.acquisitionsAccordion}
              id="acquisitionsAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.acquisitions' })}
            />
            <Accordion
              open={this.state.accordions.locationAccordion}
              id="locationAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.location' })}
            />
            <Accordion
              open={this.state.accordions.electronicAccordion}
              id="electronicAccordion"
              onToggle={this.handleAccordionToggle}
              label={formatMsg({ id: 'ui-inventory.electronicAccess' })}
            />
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

          </Pane>
        </Paneset>
      </form>
    );
  }
}

ItemForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newItem: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  change: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  copy: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesForm({
  form: 'itemForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['barcode'],
  navigationCheck: true,
  enableReinitialize: true,
})(ItemForm);
