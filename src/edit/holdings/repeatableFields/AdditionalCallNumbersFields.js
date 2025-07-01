import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  TextArea,
  Select,
} from '@folio/stripes/components';

const AdditionalCallNumbersFields = ({
  callNumberTypeOptions,
  isFieldBlocked,
  canAdd = true,
  canEdit = true,
  canDelete = true,
}) => {
  const renderField = (name, index, fields) => (
    <Row key={index}>
      <Col sm={2}>
        <FormattedMessage id="ui-inventory.selectCallNumberType">
          {([label]) => (
            <Field
              label={<FormattedMessage id="ui-inventory.callNumberType" />}
              name={`${name}.callNumberTypeId`}
              id={`additem_callnumbertype_${index}`}
              component={Select}
              fullWidth
              dataOptions={[{ label, value: '' }, ...callNumberTypeOptions]}
              disabled={!canEdit || isFieldBlocked('callNumberTypeId')}
            />
          )}
        </FormattedMessage>
      </Col>
      <Col sm={2}>
        <Field
          label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
          name={`${name}.callNumberPrefix`}
          id={`additem_callnumberprefix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          format={v => v?.trim()}
          formatOnBlur
          disabled={!canEdit || isFieldBlocked('callNumberPrefix')}
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
          name={`${name}.callNumberSuffix`}
          id={`additem_callnumbersuffix_${index}`}
          component={TextArea}
          rows={1}
          fullWidth
          format={v => v?.trim()}
          formatOnBlur
          disabled={!canEdit || isFieldBlocked('callNumberSuffix')}
        />
      </Col>
      {canDelete && (
        <Col sm={2} style={{ paddingTop: '25px' }}>
          <Button
            onClick={() => fields.remove(index)}
            buttonStyle="danger"
          >
            <FormattedMessage id="stripes-core.button.delete" />
          </Button>
        </Col>
      )}
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
};

export default AdditionalCallNumbersFields;
