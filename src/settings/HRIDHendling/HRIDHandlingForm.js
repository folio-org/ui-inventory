import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Headline,
  Pane,
  Button,
} from '@folio/stripes/components';

import css from './HRIDHandling.css';

const HRID_HANDLING_DESCRIPTION = [
  'ui-inventory.hridHandling.description.line1',
  'ui-inventory.hridHandling.description.line2',
  'ui-inventory.hridHandling.description.line3',
];

const HRIDHandlingForm = ({
  isSubmitDisabled = false,
  onSubmit,
  children,
}) => {
  const lastMenu = (
    <Button
      data-test-submit-button
      buttonStyle="primary"
      disabled={isSubmitDisabled}
      marginBottom0
      type="submit"
    >
      <FormattedMessage id="stripes-core.button.save" />
    </Button>
  );

  return (
    <form
      data-test-hrid-handling-form
      id="hrid-handling-settings-form"
      onSubmit={onSubmit}
      className={css.form}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={<FormattedMessage id="ui-inventory.hridHandling" />}
        lastMenu={lastMenu}
      >
        <Row>
          <Col
            xs={12}
          >
            <Headline>
              <FormattedMessage id="ui-inventory.hridHandling" />
            </Headline>
          </Col>
        </Row>
        {HRID_HANDLING_DESCRIPTION.map((description, index) => (
          <Row
            key={index}
            className={css.descriptionRow}
          >
            <Col
              xs={12}
            >
              <FormattedMessage id={description} />
            </Col>
          </Row>
        ))}
        {children}
      </Pane>
    </form>
  );
};

HRIDHandlingForm.propTypes = {
  isSubmitDisabled: PropTypes.bool,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default HRIDHandlingForm;
