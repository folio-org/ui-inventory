import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Pane,
  PaneHeader,
  Button,
  Headline,
  PaneFooter,
  PaneCloseLink,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  keys,
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
  render,
  removeZeroes,
  form: {
    change,
    reset,
    getState,
  },
}) => {
  useEffect(() => {
    const fieldsValues = getState().values;

    keys(fieldsValues).forEach(key => {
      const entityStartNumber = fieldsValues[key].startNumber;

      if (entityStartNumber) {
        if (removeZeroes) {
          const updatedStartNumber = parseInt(entityStartNumber);

          change(`${key}.startNumber`, updatedStartNumber);
        } else {
          const value = entityStartNumber.toString();
          const updatedStartNumber = value.padStart(11, '0');

          change(`${key}.startNumber`, updatedStartNumber);
        }
      }
    });
  }, [removeZeroes]);

  const isButtonDisabled = pristine || submitting;

  const saveButton = (
    <Button
      data-test-submit-button
      type="submit"
      buttonStyle="primary mega"
      disabled={isButtonDisabled}
      marginBottom0
    >
      <FormattedMessage id="stripes-components.saveAndClose" />
    </Button>
  );

  const cancelButton = (
    <Button
      data-test-cancel-button
      buttonStyle="default mega"
      disabled={isButtonDisabled}
      onClick={reset}
      marginBottom0
    >
      <FormattedMessage id="stripes-components.cancel" />
    </Button>
  );

  const footer = (
    <PaneFooter
      renderStart={cancelButton}
      renderEnd={saveButton}
      innerClassName={css.footer}
    />
  );

  const closeButton = (
    <FormattedMessage id="ui-inventory.settings.goBack">
      {ariaLabel => (
        <PaneCloseLink
          ariaLabel={ariaLabel}
          to="/settings/inventory"
        />
      )}
    </FormattedMessage>
  );

  const header = renderProps => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-inventory.hridHandling" />}
      firstMenu={closeButton}
    />
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

  return (
    <form
      data-test-hrid-handling-form
      id="hrid-handling-settings-form"
      onSubmit={handleSubmit}
      className={css.form}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        renderHeader={header}
        footer={footer}
      >
        <Row>
          <Col xs={12}>
            <Headline>
              <FormattedMessage id="ui-inventory.hridHandling" />
            </Headline>
          </Col>
        </Row>
        {description}
        {render(reset)}
      </Pane>
    </form>
  );
};

HRIDHandlingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  render: PropTypes.func,
  removeZeroes: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
})(HRIDHandlingForm);
