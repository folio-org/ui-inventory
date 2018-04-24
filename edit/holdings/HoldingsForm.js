import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import LocationSelection from '@folio/stripes-smart-components/lib/LocationSelection';
import LocationLookup from '@folio/stripes-smart-components/lib/LocationLookup';
import { Field, FieldArray } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';

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
    initialValues: PropTypes.object,
    instance: PropTypes.object,
    referenceTables: PropTypes.object.isRequired,
    change: PropTypes.func,
    formatMsg: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      confirmLocation: false,
    };
  }

  componentDidMount() {
    const { initialValues } = this.props;
    const prevLocation = initialValues.temporaryLocation || {};
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ prevLocation });
  }

  selectLocation(location) {
    if (!location.id) return;

    if (location.isActive) {
      this.props.change('temporaryLocation.id', location.id);
      this.setState({ prevLocation: location });
    } else {
      this.setState({ confirmLocation: true, location });
    }
  }

  confirmLocation(confirm) {
    const { location, prevLocation } = this.state;
    const confirmLocation = false;
    const value = (confirm) ? location.id : prevLocation.id;
    const prevLoc = (confirm) ? location : prevLocation;

    this.props.change('temporaryLocation.id', value);
    this.setState({ confirmLocation, prevLocation: prevLoc });
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
    const { confirmLocation } = this.state;

    /* Menus for Add Item workflow */
    const addHoldingsLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-create-item" type="submit" title={formatMsg({ id: 'ui-inventory.createHoldingsRecord' })} disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Create holdings record</Button></PaneMenu>;
    const editHoldingsLastMenu = <PaneMenu><Button buttonStyle="primary paneHeaderNewButton" id="clickable-update-item" type="submit" title={formatMsg({ id: 'ui-inventory.updateHoldingsRecord' })} disabled={(pristine || submitting) && !copy} onClick={handleSubmit}>Update holdings record</Button></PaneMenu>;

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
                    <em>{instance.publication[0].publisher}{instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}</em>
                  </div>
                }
              </div>
            }
          >
            <Row>
              <Col sm={5} smOffset={1}>
                <h2>{formatMsg({ id: 'ui-inventory.holdingsRecord' })}</h2>
              </Col>
            </Row>
            <Row >
              <Col sm={5} smOffset={1}>
                <Field
                  label={formatMsg({ id: 'ui-inventory.permanentLocation' })}
                  name="permanentLocationId"
                  id="additem_permanentlocation"
                  component={LocationSelection}
                  fullWidth
                  marginBottom0
                />
                <LocationLookup onLocationSelected={loc => this.selectLocation(loc)} />
              </Col>
            </Row>
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
            <Row >
              <Col sm={5} smOffset={1}>
                <Field label={formatMsg({ id: 'ui-inventory.callNumber' })} name="callNumber" id="additem_callnumber" component={TextField} fullWidth />
              </Col>
            </Row>
            <FieldArray name="holdingsStatements" component={renderStatements} formatMsg={formatMsg} />
            <ConfirmationModal
              open={confirmLocation}
              heading={formatMsg({ id: 'ui-inventory.confirmLocation.header' })}
              message={formatMsg({ id: 'ui-inventory.confirmLocation.message' })}
              confirmLabel={formatMsg({ id: 'ui-inventory.confirmLocation.selectBtn' })}
              onConfirm={() => { this.confirmLocation(true); }}
              onCancel={() => { this.confirmLocation(false); }}
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
