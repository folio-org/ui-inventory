import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import { callNumberLabel } from '../../../utils';

const HoldingAccordionLabel = ({
  location,
  holding,
}) => {
  return (
    <>
      <FormattedMessage
        id="ui-inventory.holdingsHeader"
        values={{
          location,
          callNumber: callNumberLabel(holding),
          copyNumber: holding.copyNumber,
        }}
      />
      {holding.discoverySuppress &&
        <span>
          <Icon
            size="medium"
            icon="exclamation-circle"
            status="warn"
          />
        </span>
      }
    </>
  );
};

HoldingAccordionLabel.propTypes = {
  location: PropTypes.string,
  holding: PropTypes.object,
};

export default HoldingAccordionLabel;
