import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage, useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  TextArea,
  Select, IconButton,
} from '@folio/stripes/components';

const AdditionalCallNumbersFields = ({
  callNumberTypeOptions,
  isFieldBlocked,
  onSwap,
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const { formatMessage } = useIntl();
  const ariaDeleteLabel = formatMessage({ id: 'stripes-components.deleteThisItem' });
  const renderField = (name, index, fields) => (
    <Row key={index}>
      <Col sm={2}>
        <FormattedMessage id="ui-inventory.selectCallNumberType">
          {([label]) => (
            <Field
              label={<FormattedMessage id="ui-inventory.callNumberType" />}
              name={`${name}.typeId`}
              id={`additem_typeId_${index}`}
              component={Select}
              fullWidth
              dataOptions={[{ label, value: '' }, ...callNumberTypeOptions]}
              disabled={!canEdit || isFieldBlocked('typeId')}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col sm={2}>
        <Field
          label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
          name={`${name}.prefix`}
          id={`additem_prefix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          format={v => v?.trim()}
          formatOnBlur
          disabled={!canEdit || isFieldBlocked('prefix')}
        />
      </Col>
      <Col sm={2}>
        <Field
          label={<FormattedMessage id="ui-inventory.callNumber" />}
          name={`${name}.callNumber`}
          id={`additem_callnumber_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          format={v => v?.trim()}
          formatOnBlur
          disabled={!canEdit || isFieldBlocked('callNumber')}
        />
      </Col>
      <Col sm={2}>
        <Field
          label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
          name={`${name}.suffix`}
          id={`additem_suffix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          format={v => v?.trim()}
          formatOnBlur
          disabled={!canEdit || isFieldBlocked('suffix')}
        />
      </Col>
      <Col xs={10} sm={3} style={{ paddingTop: '25px' }}>
        <Button
          onClick={() => onSwap(index)}
          buttonStyle="default"
          fullWidth
        >
          <FormattedMessage id="ui-inventory.swapWithPrimaryCallNumber" />
        </Button>
      </Col>
      <Col xs={1} sm={1} style={{ paddingTop: '25px' }}>
        <IconButton
          icon="trash"
          onClick={() => fields.remove(index)}
          size="medium"
          disabled={!canDelete}
          name={ariaDeleteLabel}
          aria-label={ariaDeleteLabel}
        />
      </Col>
    </Row>
  );

  return (
    <>
      <Row>
        <Col
          smOffset={0}
          sm={4}
        >
          <strong>
            <FormattedMessage id="ui-inventory.additionalCallNumbers" />
          </strong>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <FieldArray name="additionalCallNumbers">
            {({ fields }) => (
              <>
                {fields.map((name, index) => renderField(name, index, fields))}
                {canAdd && (
                <Row>
                  <Col xs={12}>
                    <Button
                      onClick={() => fields.push({})}
                      buttonStyle="default"
                    >
                      <FormattedMessage id="ui-inventory.addAdditionalCallNumber" />
                    </Button>
                  </Col>
                </Row>
                )}
              </>
            )}
          </FieldArray>
        </Col>
      </Row>
    </>
  );
};

AdditionalCallNumbersFields.propTypes = {
  callNumberTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  isFieldBlocked: PropTypes.func.isRequired,
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  onSwap: PropTypes.func.isRequired,
};

export default AdditionalCallNumbersFields;
