import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  TextArea,
  Select,
  Label,
  RepeatableField,
} from '@folio/stripes/components';

const CommonAdditionalCallNumbersFields = ({
  callNumberTypeOptions,
  onSwap,
  canAdd = true,
  canEdit = true,
  canDelete = true,
  item = false,
  name = 'additionalCallNumbers',
}) => {
  const { formatMessage } = useIntl();
  const callNumberTypeLabel = formatMessage({ id: 'ui-inventory.callNumberType' });
  const callNumberPrefixLabel = formatMessage({ id: 'ui-inventory.callNumberPrefix' });
  const callNumberLabel = formatMessage({ id: 'ui-inventory.callNumber' });
  const callNumberSuffixLabel = formatMessage({ id: 'ui-inventory.callNumberSuffix' });

  const headLabels = (
    <Row>
      <Col sm={2}>
        <Label tagName="legend">
          {callNumberTypeLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {callNumberPrefixLabel}
        </Label>
      </Col>
      <Col sm={3}>
        <Label tagName="legend">
          {callNumberLabel}
        </Label>
      </Col>
      <Col sm={2}>
        <Label tagName="legend">
          {callNumberSuffixLabel}
        </Label>
      </Col>
    </Row>
  );

  const renderField = (fieldName, index) => (
    <Row key={index}>
      <Col sm={2}>
        <FormattedMessage id="ui-inventory.selectCallNumberType">
          {([label]) => (
            <Field
              name={`${fieldName}.typeId`}
              aria-label={callNumberTypeLabel}
              id={`additem_callnumbertype_${index}`}
              component={Select}
              fullWidth
              dataOptions={[{ label, value: '' }, ...callNumberTypeOptions]}
              disabled={!canEdit}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col sm={2}>
        <Field
          name={`${fieldName}.prefix`}
          aria-label={callNumberPrefixLabel}
          id={`additem_prefix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          formatOnBlur
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Field
          name={`${fieldName}.callNumber`}
          aria-label={callNumberLabel}
          id={`additem_callnumber_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          formatOnBlur
          disabled={!canEdit}
        />
      </Col>
      <Col sm={2}>
        <Field
          name={`${fieldName}.suffix`}
          aria-label={callNumberSuffixLabel}
          id={`additem_suffix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          formatOnBlur
          disabled={!canEdit}
        />
      </Col>
      <Col sm={3}>
        <Button
          onClick={() => onSwap(index)}
          buttonStyle="default"
          fullWidth
        >
          <FormattedMessage id="ui-inventory.swapWithPrimaryCallNumber" />
        </Button>
      </Col>
    </Row>
  );

  return (
    <>
      <h3>{item ? <FormattedMessage id="ui-inventory.additionalItemCallNumbers" /> : <FormattedMessage id="ui-inventory.additionalHoldingsCallNumbers" />}</h3>
      <FieldArray
        name={name}
        component={RepeatableField}
        addLabel={canAdd ? <FormattedMessage id="ui-inventory.addAdditionalCallNumber" /> : ''}
        headLabels={headLabels}
        renderField={renderField}
        canAdd={canAdd}
        canRemove={canDelete}
      />
    </>
  );
};

CommonAdditionalCallNumbersFields.propTypes = {
  callNumberTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  item: PropTypes.bool,
  onSwap: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default CommonAdditionalCallNumbersFields;
