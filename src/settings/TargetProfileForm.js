import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col, TextField, Button } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

class TargetProfileForm extends React.Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { pristine, submitting, initialValues, handleSubmit } = this.props;

    return (
      <form
        id="form-loan-rules"
        data-test-circulation-rules-form
        onSubmit={handleSubmit}
      >
        <Row end="xs">
          <Col xs={3}>
            <FormattedMessage id="ui-inventory.name">
              {placeholder => (
                <TextField
                  aria-label={placeholder}
                  placeholder={placeholder}
                  value={initialValues.name}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={3}>
            <Button
              fullWidth
              id="clickable-save-loan-rules"
              type="submit"
              disabled={pristine || submitting}
            >
              <FormattedMessage id="ui-inventory.save" />
            </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default stripesFinalForm({ navigationCheck: true })(TargetProfileForm);
