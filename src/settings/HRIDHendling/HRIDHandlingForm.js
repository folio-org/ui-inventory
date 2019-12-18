import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Headline,
  Pane,
  Button,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes-form/lib/stripesForm';

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
  children,
}) => {
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
    </form>
  );
};

export default stripesForm({
  form: 'hridHandling',
  navigationCheck: true,
  enableReinitialize: true,
})(HRIDHandlingForm);
