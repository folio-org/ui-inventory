import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Button,
  PaneFooter,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import css from './FastAddSettings.css';

const FastAddForm = ({
  handleSubmit,
  pristine,
  submitting,
  form: { reset },
  label,
  children,
}) => {
  const saveButton = (
    <Button
      data-test-submit-button
      type="submit"
      buttonStyle="primary mega"
      disabled={pristine || submitting}
      marginBottom0
    >
      <FormattedMessage id="ui-inventory.save" />
    </Button>
  );

  const cancelButton = (
    <Button
      data-test-cancel-button
      buttonStyle="default mega"
      disabled={pristine || submitting}
      onClick={reset}
      marginBottom0
    >
      <FormattedMessage id="ui-inventory.cancel" />
    </Button>
  );

  const footer = (
    <PaneFooter
      renderStart={cancelButton}
      renderEnd={saveButton}
      innerClassName={css.footer}
    />
  );

  return (
    <form
      data-test-fast-add-settings-form
      id="fast-add-settings-form"
      onSubmit={handleSubmit}
      className={css.form}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
        footer={footer}
      >
        {children}
      </Pane>
    </form>
  );
};

FastAddForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(FastAddForm);
