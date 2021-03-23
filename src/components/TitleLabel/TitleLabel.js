
import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  Layout,
} from '@folio/stripes/components';

const TitleLabel = ({ label, subLabel, required }) => (
  <Layout className="flex justified full">
    <Label required={required}>{label}</Label>
    {subLabel && <Label style={{ fontWeight: 'normal' }}>{subLabel}</Label>}
  </Layout>
);

TitleLabel.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  subLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  required: PropTypes.bool,
};

export default TitleLabel;
