import PropTypes from 'prop-types';

import {
  Label,
  Checkbox,
} from '@folio/stripes/components';

const propTypes = {
  fields: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  label: PropTypes.oneOf([PropTypes.node, PropTypes.string]).isRequired,
};

export const CheckboxGroup = ({ fields, options, label }) => {
  const handleCheck = (e, optionValue) => {
    const optionIndex = fields.value?.findIndex(option => option === optionValue);

    if (e.target.checked) {
      fields.push(optionValue);
    } else {
      fields.remove(optionIndex);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      {options.map(option => (
        <div key={option.value}>
          <Checkbox
            aria-label={option.label}
            checked={fields.value?.includes?.(option.value) ?? false}
            onChange={(e) => handleCheck(e, option.value)}
            type="checkbox"
            value={option.value}
            label={option.label}
          />
        </div>
      ))}
    </div>
  );
};

CheckboxGroup.propTypes = propTypes;
