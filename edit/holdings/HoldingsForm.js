import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';

function HoldingsForm(props) {
  const {
    handleSubmit,
    reset,  // eslint-disable-line no-unused-vars
    pristine,
    submitting,
    onCancel,
    initialValues,
  } = props;

  /* Menus for Add Item workflow */
  const addHoldingsFirstMenu = <PaneMenu><button onClick={onCancel} title="close" aria-label="Close New Holdings Dialog"><span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span></button></PaneMenu>;
  const addHoldingsLastMenu = <PaneMenu><Button id="clickable-create-item" type="submit" title="Create New Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Create holdings record</Button></PaneMenu>;
  const editHoldingsLastMenu = <PaneMenu><Button id="clickable-update-item" type="submit" title="Update Holdings Record" disabled={pristine || submitting} onClick={handleSubmit}>Update holdings record</Button></PaneMenu>;

  return (
    <form>
      <Paneset isRoot>
        <Pane defaultWidth="100%" firstMenu={addHoldingsFirstMenu} lastMenu={initialValues.title ? editHoldingsLastMenu : addHoldingsLastMenu} paneTitle={initialValues.title ? 'Edit Holdings' : 'New Holdings Record'}>
          <Row>
            <Col sm={5} smOffset={1}>
              <h2>Holdings Record</h2>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
}

HoldingsForm.propTypes = {
  onClose: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  newHoldingsRecord: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
};

export default stripesForm({
  form: 'holdingsForm',
  navigationCheck: true,
})(HoldingsForm);
