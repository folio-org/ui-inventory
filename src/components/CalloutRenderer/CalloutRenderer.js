import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import useCallout from '../../hooks/useCallout';

// Declarative way to render a callout with a given message
const CalloutRenderer = ({
  message,
  type = 'success',
}) => {
  const callout = useCallout();

  useEffect(() => {
    if (callout?.sendCallout) {
      callout.sendCallout({
        type,
        message,
      });
    }
  }, [callout]);

  return null;
};

CalloutRenderer.propTypes = {
  message: PropTypes.node,
  type: PropTypes.string,
};

export default CalloutRenderer;
