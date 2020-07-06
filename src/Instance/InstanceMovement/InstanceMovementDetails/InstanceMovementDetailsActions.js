import React, {
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

const InstanceMovementDetailsActions = ({
  onToggle,
  instance,
  hasMarc,
}) => {
  const history = useHistory();
  const location = useLocation();

  const viewSource = useCallback(() => {
    onToggle();

    history.push({
      pathname: `/inventory/viewsource/${instance.id}`,
      search: location.search,
    });
  }, [location.search, onToggle]);

  return (
    <>
      {
        instance.source === 'MARC' && (
          <Button
            data-test-movement-details-view-source
            buttonStyle="dropdownItem"
            disabled={!hasMarc}
            onClick={viewSource}
          >
            <Icon icon="document">
              <FormattedMessage id="ui-inventory.viewSource" />
            </Icon>
          </Button>
        )
      }
    </>
  );
};

InstanceMovementDetailsActions.propTypes = {
  onToggle: PropTypes.func.isRequired,
  instance: PropTypes.object,
  hasMarc: PropTypes.bool,
};

InstanceMovementDetailsActions.defaultProps = {
  instance: {},
};

export default InstanceMovementDetailsActions;
