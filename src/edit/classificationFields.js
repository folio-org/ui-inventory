import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const ClassificationFields = ({ classificationTypes }) => {
  const classificationTypeOptions = classificationTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <FormattedMessage id="ui-inventory.selectClassification">
      {placeholder => (
        <RepeatableField
          name="classifications"
          label={<FormattedMessage id="ui-inventory.classifications" />}
          addLabel={
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-inventory.addClassifications" />
            </Icon>
          }
          addButtonId="clickable-add-classification"
          addDefaultItem={false}
          template={[
            {
              label: (
                <FormattedMessage id="ui-inventory.number">
                  {(message) => message + ' *'}
                </FormattedMessage>
              ),
              name: 'classificationNumber',
              component: TextField,
              required: true,
            },
            {
              label: (
                <FormattedMessage id="ui-inventory.type">
                  {(message) => message + ' *'}
                </FormattedMessage>
              ),
              name: 'classificationTypeId',
              component: Select,
              placeholder,
              dataOptions: classificationTypeOptions,
              required: true,
            },
          ]}
          newItemTemplate={{ classificationNumber: '', classificationTypeId: '' }}
        />
      )}
    </FormattedMessage>
  );
};

ClassificationFields.propTypes = {
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ClassificationFields;
