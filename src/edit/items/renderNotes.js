import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  Button,
  TextField,
} from '@folio/stripes/components';

const renderNotes = ({
  fields,
  meta: { touched, error, submitFailed },
}) => (
  <div>
    <Row>
      <Col
        sm={2}
        smOffset={5}
      >
        <Button
          type="button"
          buttonStyle="fullWidth secondary"
          id="clickable-add-notes"
          onClick={() => fields.push()}
        >
          <FormattedMessage id="ui-inventory.addNotes" />
        </Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((note, index) => (
      <Row key={index}>
        <Col sm={6}>
          <Field
            name={note}
            type="text"
            component={TextField}
            label={index === 0
              ? <FormattedMessage id="ui-inventory.notes" />
              : null
            }
          />
        </Col>
        <Col sm={1}>
          {index === 0 ? <br /> : null}
          <FormattedMessage
            id="ui-inventory.removeNotes"
            values={{ num: index + 1 }}
          >
            {title => (
              <Button
                buttonStyle="fullWidth secondary"
                type="button"
                title={title}
                onClick={() => fields.remove(index)}
              >
                <FormattedMessage id="ui-inventory.remove" />
              </Button>
            )}
          </FormattedMessage>
        </Col>
      </Row>
    ))}
  </div>
);
renderNotes.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
};

export default renderNotes;
