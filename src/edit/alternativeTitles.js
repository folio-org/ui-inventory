import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  TextArea,
  RepeatableField,
  Select,
  Label,
  Row,
  Col,
} from '@folio/stripes/components';

const AlternativeTitles = props => {
  const { formatMessage } = useIntl();

  const {
    alternativeTitleTypes,
    canAdd,
    canEdit,
    canDelete,
  } = props;
  const alternativeTitleTypeOptions = alternativeTitleTypes.map(it => ({
    label: it.name,
    value: it.id,
  }));

  const headLabels = (
    <Row>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.type" />
        </Label>
      </Col>
      <Col sm={6}>
        <Label tagName="legend" required>
          <FormattedMessage id="ui-inventory.alternativeTitle" />
        </Label>
      </Col>
    </Row>
  );

  const renderField = field => (
    <Row>
      <Col sm={6}>
        <Field
          name={`${field}.alternativeTitleTypeId`}
          component={Select}
          dataOptions={alternativeTitleTypeOptions}
          placeholder={formatMessage({ id: 'ui-inventory.selectAlternativeTitleType' })}
          aria-label={formatMessage({ id: 'ui-inventory.type' })}
          disabled={!canEdit}
          required
        />
      </Col>
      <Col sm={6}>
        <Field
          name={`${field}.alternativeTitle`}
          component={TextArea}
          aria-label={formatMessage({ id: 'ui-inventory.alternativeTitle' })}
          disabled={!canEdit}
          required
          fullWidth
          rows={1}
        />
      </Col>
    </Row>
  );

  return (
    <FieldArray
      name="alternativeTitles"
      component={RepeatableField}
      legend={<FormattedMessage id="ui-inventory.alternativeTitles" />}
      addLabel={<FormattedMessage id="ui-inventory.addAlternativeTitles" />}
      onAdd={fields => fields.push({
        alternativeTitleTypeId: '',
        alternativeTitle: '',
      })}
      headLabels={headLabels}
      renderField={renderField}
      canAdd={canAdd}
      canRemove={canDelete}
    />
  );
};

AlternativeTitles.propTypes = {
  alternativeTitleTypes: PropTypes.arrayOf(PropTypes.object),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
AlternativeTitles.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default AlternativeTitles;
