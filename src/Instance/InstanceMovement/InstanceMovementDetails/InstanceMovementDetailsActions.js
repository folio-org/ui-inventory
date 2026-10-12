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
  IfPermission,
} from '@folio/stripes/core';
import {
  Icon,
  Button,
} from '@folio/stripes/components';

const InstanceMovementDetailsActions = ({
  onToggle,
  hasMarc,
  instance = {},
}) => {
  const history = useHistory();
  const location = useLocation();

  const viewSource = useCallback(() => {
    onToggle();

    history.push({
      pathname: `/inventory/viewsource/${instance.id}`,
      search: location.search,
      state: {
        hasPrevious: true,
      },
    });
  }, [instance.id, location.search, onToggle]);

  const editInstance = useCallback(() => {
    onToggle();

    history.push({
      pathname: `/inventory/instance/edit/${instance.id}`,
      search: location.search,
      state: {
        hasPrevious: true,
      },
    });
  }, [instance.id, location.search, onToggle]);

  return (
    <>
      <IfPermission perm="inventory.instances.item.put">
        <Button
          data-test-movement-details-edit-instance
          onClick={editInstance}
          buttonStyle="dropdownItem"
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-inventory.edit" />
          </Icon>
        </Button>
      </IfPermission>

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

export default InstanceMovementDetailsActions;
