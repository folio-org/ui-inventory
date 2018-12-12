import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Button, TextField } from '@folio/stripes/components';

const CopyNumbers = ({ fields, meta: { touched, error, submitFailed } }) => {
  const handleAddCopyNumber = () => fields.push();
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
            onClick={handleAddCopyNumber}
          >
            <FormattedMessage id="ui-inventory.addCopyNumber" />
          </Button>
          {errorIsVisible && error &&
            <span>
              {error}
            </span>
          }
        </Col>
      </Row>
      {fields.map((copyNumber, index) => (
        <Row key={copyNumber}>
          <Col sm={6}>
            <Field
              name={copyNumber}
              type="text"
              component={TextField}
              label={index === 0 ? <FormattedMessage id="ui-inventory.copyNumber" /> : null}
            />
          </Col>
          <Col sm={1}>
            {index === 0 ? <br /> : null}
            <FormattedMessage
              id="ui-inventory.removeCopyNumber"
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

CopyNumbers.propTypes = {
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

CopyNumbers.defaultProps = {
  meta: {
    touched: false,
    error: '',
    submitFailed: false,
  },
};

export default CopyNumbers;
