import React from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  RepeatableField,
  TextField,
  TextArea,
  Row,
  Col,
  Label,
} from '@folio/stripes/components';

const PublicationFields = props => {
  const { formatMessage } = useIntl();

  const {
    canAdd,
    canEdit,
    canDelete,
  } = props;

  const headLabels = (
    <Row>
      <Col sm={3}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.publisher" />
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.publisherRole" />
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.place" />
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          <FormattedMessage id="ui-inventory.dateOfPublication" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={3}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.publisher' })}
          name={`${field}.publisher`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={formatMessage({ id: 'ui-inventory.publisherRole' })}
          name={`${field}.role`}
          component={TextField}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          aria-label={formatMessage({ id: 'ui-inventory.place' })}
          name={`${field}.place`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={formatMessage({ id: 'ui-inventory.dateOfPublication' })}
          name={`${field}.dateOfPublication`}
          component={TextField}
          disabled={!canEdit}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="publication"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.publications" />}
      addLabel={<FormattedMessage id="ui-inventory.addPublication" />}
      onAdd={fields => fields.push({
        publisher: '',
        role: '',
        place: '',
        dateOfPublication: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

PublicationFields.propTypes = {
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
PublicationFields.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default PublicationFields;
