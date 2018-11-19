import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Button, TextField } from '@folio/stripes/components';

const PieceIdentifiers = ({ fields, meta: { touched, error, submitFailed } }) => {
  const handleAddIdentifier = () => fields.push();
  const errorIsVisible = touched || submitFailed;

  return (
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
            onClick={handleAddIdentifier}
          >
            <FormattedMessage id="ui-inventory.addPieceIdentifier" />
          </Button>
          {errorIsVisible && error &&
            <span>
              {error}
            </span>
          }
        </Col>
      </Row>
      {fields.map((pieceIdentifier, index) => (
        <Row key={pieceIdentifier}>
          <Col sm={6}>
            <Field
              name={pieceIdentifier}
              type="text"
              component={TextField}
              label={index === 0 ? <FormattedMessage id="ui-inventory.pieceIdentifier" /> : null}
            />
          </Col>
          <Col sm={1}>
            {index === 0 ? <br /> : null}
            <FormattedMessage
              id="ui-inventory.removeIdentifier"
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
};

PieceIdentifiers.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }),
};

PieceIdentifiers.defaultProps = {
  meta: {
    touched: false,
    error: '',
    submitFailed: false,
  },
};

export default PieceIdentifiers;
