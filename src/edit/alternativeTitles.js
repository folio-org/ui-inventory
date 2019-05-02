import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  TextField,
  Select,
} from '@folio/stripes/components';

import RepeatableField from '../components/RepeatableField';

const AlternativeTitles = ({ alternativeTitleTypes }) => {
  const alternativeTitleTypeOptions = alternativeTitleTypes.map(
    it => ({
      label: it.name,
      value: it.id,
    }),
  );

  return (
    <FormattedMessage id="ui-inventory.selectAlternativeTitleType">
      {placeholder => (
        <RepeatableField
          name="alternativeTitles"
          label={<FormattedMessage id="ui-inventory.alternativeTitles" />}
          addLabel={
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-inventory.addAlternativeTitles" />
            </Icon>
          }
          addButtonId="clickable-add-alternativeTitle"
          template={[
            {
              name: 'alternativeTitleTypeId',
              label: <FormattedMessage id="ui-inventory.type" />,
              component: Select,
              placeholder,
              dataOptions: alternativeTitleTypeOptions,
              required: true,
            },
            {
              name: 'alternativeTitle',
              label: <FormattedMessage id="ui-inventory.alternativeTitle" />,
              component: TextField,
              required: true,
            }
          ]}
          newItemTemplate={{ alternativeTitleTypeId: '', alternativeTitle: '' }}
        />
      )}
    </FormattedMessage>
  );
};

AlternativeTitles.propTypes = {
  alternativeTitleTypes: PropTypes.arrayOf(PropTypes.object),
};

export default AlternativeTitles;
