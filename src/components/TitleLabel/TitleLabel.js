
import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  Layout,
} from '@folio/stripes/components';

const TitleLabel = ({ label, subLabel, required }) => (
  <Layout className="flex justified full">
    <Label required={required}>{label}</Label>
    <Label>{subLabel}</Label>
  </Layout>
);

TitleLabel.propTypes = {
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default TitleLabel;
