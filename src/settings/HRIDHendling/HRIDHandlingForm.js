import React, {
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Headline,
  Pane,
  Button,
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import {
  clone,
  isEmpty,
  keys,
  omit,
  parseInt,
} from 'lodash';
import css from './HRIDHandling.css';

const HRID_DESCRIPTIONS_ID = [
  'ui-inventory.hridHandling.description.line1',
  'ui-inventory.hridHandling.description.line2',
  'ui-inventory.hridHandling.description.line3',
];

const HRIDHandlingForm = ({
  handleSubmit,
  pristine,
  submitting,
  reset,
  mutator,
  children,
}) => {
  const calloutRef = useRef();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hridSettings, setHridSettings] = useState({});

  const lastMenu = (
    <Button
      data-test-submit-button
      type="submit"
      buttonStyle="primary"
      disabled={(pristine || submitting)}
      marginBottom0
    >
      <FormattedMessage id="stripes-core.button.save" />
    </Button>
  );

  const description = HRID_DESCRIPTIONS_ID.map((id, index) => (
    <Row
      key={index}
      className={css.descriptionRow}
    >
      <Col xs={12}>
        <FormattedMessage id={id} />
      </Col>
    </Row>
  ));

  const showCallout = (type, messageId) => {
    calloutRef.current.sendCallout({
      type,
      message: <FormattedMessage id={messageId} />,
    });
  };

  const onBeforeSave = value => {
    const settings = clone(value);

    keys(settings).forEach(key => {
      if (settings[key].startNumber) {
        const startNumber = settings[key].startNumber;

        settings[key].startNumber = parseInt(startNumber);
      }
    });

    return omit(settings, ['id']);
  };

  const onSubmit = data => {
    setConfirmModalOpen(true);
    setHridSettings(data);
  };

  const onEdit = () => {
    const data = !isEmpty(hridSettings) ? onBeforeSave(hridSettings) : {};

    return mutator.hridSettings.PUT(data)
      .then(() => showCallout('success', 'ui-inventory.hridHandling.toast.updated'))
      .catch(() => showCallout('error', 'ui-inventory.hridHandling.toast.error'));
  };

  return (
    <form
      data-test-hrid-handling-form
      id="hrid-handling-settings-form"
      onSubmit={handleSubmit(onSubmit)}
      className={css.form}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={<FormattedMessage id="ui-inventory.hridHandling" />}
        lastMenu={lastMenu}
      >
        <Row>
          <Col xs={12}>
            <Headline>
              <FormattedMessage id="ui-inventory.hridHandling" />
            </Headline>
          </Col>
        </Row>
        {description}
        {children}
      </Pane>
      <ConfirmationModal
        id="confirm-edit-hrid-settings-modal"
        open={isConfirmModalOpen}
        heading={<FormattedMessage id="ui-inventory.hridHandling.modal.header" />}
        message={<FormattedMessage id="ui-inventory.hridHandling.modal.body" />}
        confirmLabel={<FormattedMessage id="ui-inventory.hridHandling.modal.button.confirm" />}
        cancelLabel={<FormattedMessage id="ui-inventory.hridHandling.modal.button.close" />}
        onConfirm={() => {
          setConfirmModalOpen(false);
          onEdit();
        }}
        onCancel={() => {
          setConfirmModalOpen(false);
          reset();
        }}
        buttonStyle="default"
        cancelButtonStyle="primary"
      />
      <Callout ref={calloutRef} />
    </form>
  );
};

HRIDHandlingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default stripesForm({
  form: 'hridHandling',
  navigationCheck: true,
  enableReinitialize: true,
})(HRIDHandlingForm);
