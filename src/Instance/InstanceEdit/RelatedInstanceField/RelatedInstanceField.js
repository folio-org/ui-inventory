import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  KeyValue,
  Row,
  Col,
  Select,
} from '@folio/stripes/components';

import InstancePlugin from '../../../components/InstancePlugin';
import TitleLabel from '../../../components/TitleLabel';
import { getIdentifiers, convertInstanceFormatIdsToNames } from '../../../utils';
import { indentifierTypeNames } from '../../../constants';
import useReferenceData from '../../../hooks/useReferenceData';

const InstanceField = ({
  field,
  index,
  fields,
  isDisabled,
  relatedInstanceTypes,
}) => {
  const intl = useIntl();
  const { identifierTypesById, instanceFormatsById } = useReferenceData();
  const { update, value } = fields;
  const instance = value[index];
  const {
    id,
    hrid,
    title,
    identifiers,
    instanceFormatIds,
  } = instance;
  const {
    ISSN,
    ISBN,
  } = indentifierTypeNames;
  const issn = getIdentifiers(identifiers, ISSN, identifierTypesById);
  const isbn = getIdentifiers(identifiers, ISBN, identifierTypesById);
  const format = convertInstanceFormatIdsToNames(instanceFormatIds, instanceFormatsById);

  const handleSelect = (inst) => {
    update(index, {
      ...inst,
      relatedInstanceId: inst.id,
    });
  };

  return (
    <Row>
      <Col xs={2}>
        <KeyValue
          data-test={`related-instance-title-${index}`}
          label={
            <TitleLabel
              label={<FormattedMessage id="ui-inventory.precedingField.title" />}
              subLabel={id && <FormattedMessage id="ui-inventory.precedingField.connected" />}
              required
            />
          }
          value={title || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs={1}>
        <InstancePlugin onSelect={handleSelect} isDisabled={isDisabled} />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.instanceHrid" />}
          value={hrid || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.isbn" />}
          value={isbn || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.issn" />}
          value={issn || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.format" />}
          value={format || <FormattedMessage id="ui-inventory.notAvailable" />}
        />
      </Col>
      <Col xs>
        <Field
          component={Select}
          label={<FormattedMessage id="ui-inventory.typeOfRelation" />}
          name={`${field}.relatedInstanceTypeId`}
          dataOptions={relatedInstanceTypes}
          placeholder={intl.formatMessage({ id: 'ui-inventory.selectType' })}
          required
          disabled={isDisabled}
        />
      </Col>
    </Row>
  );
};

InstanceField.propTypes = {
  field: PropTypes.string,
  fields: PropTypes.object,
  index: PropTypes.number,
  isDisabled: PropTypes.bool,
  relatedInstanceTypes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceField;
