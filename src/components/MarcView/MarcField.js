import React from 'react';
import PropTypes from 'prop-types';

import {
  normalizeIndicator,
} from './utils';

const MarcField = ({
  field,
}) => {
  const fieldTag = Object.keys(field)[0];
  const hasIndicators = typeof field[fieldTag] !== 'string';
  const subFields = hasIndicators
    ? field[fieldTag].subfields.map(subFieldTag => {
      const subKey = Object.keys(subFieldTag)[0];

      return [<span key={`span${subKey}`}>&#8225;</span>, subKey, ' ', subFieldTag[subKey], ' '];
    })
    : field[fieldTag].replace(/\\/g, ' ');

  return (
    <tr data-test-instance-marc-field>
      <td>
        {fieldTag}
      </td>

      {
        hasIndicators && (
          <td>
            {`${normalizeIndicator(field[fieldTag].ind1)} ${normalizeIndicator(field[fieldTag].ind2)}`}
          </td>
        )
      }

      <td colSpan={hasIndicators ? 2 : 3}>
        {subFields}
      </td>
    </tr>
  );
};

MarcField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default MarcField;
