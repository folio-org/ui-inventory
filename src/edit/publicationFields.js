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

const PublicationFields = ({
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();

  const publisherLabel = formatMessage({ id: 'ui-inventory.publisher' });
  const publisherRoleLabel = formatMessage({ id: 'ui-inventory.publisherRole' });
  const placeLabel = formatMessage({ id: 'ui-inventory.place' });
  const dateOfPublicationLabel = formatMessage({ id: 'ui-inventory.dateOfPublication' });

  const headLabels = (
    <Row>
      <Col sm={3}>
        <Label tagName="legend">
          {publisherLabel}
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          {publisherRoleLabel}
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          {placeLabel}
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          {dateOfPublicationLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={3}>
        <Field
          aria-label={publisherLabel}
          name={`${field}.publisher`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={publisherRoleLabel}
          name={`${field}.role`}
          component={TextField}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          aria-label={placeLabel}
          name={`${field}.place`}
          component={TextArea}
          rows={1}
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          ariaLabel={dateOfPublicationLabel}
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

export default PublicationFields;
