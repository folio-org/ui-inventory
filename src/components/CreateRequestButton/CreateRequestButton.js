import PropTypes from 'prop-types';
// import { useCallback } from 'react';
// import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
  updateTenant,
} from '@folio/stripes/core';

const CreateRequestButton = ({ newRequestLink }) => {
  const stripes = useStripes();

  // if multi tenants
  if (stripes.hasInterface('consortia') && stripes.hasInterface('ecs-tlr')) {
    const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

    // if central tenant
    if (isUserInCentralTenant) {
      return (
        <Button
          to={newRequestLink}
          buttonStyle="dropdownItem"
          data-test-inventory-create-request-action
        >
          <Icon icon="plus-sign">
            New request in central tenant
          </Icon>
        </Button>
      );
    }

    const goToRequests = async () => {
      const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

      await updateTenant(stripes.okapi, centralTenantId);

      window.location.href = window.location.origin + newRequestLink;
    };

    // if data tenant
    return (
      <>
        <Button
          buttonStyle="dropdownItem"
          onClick={goToRequests}
        >
          <Icon icon="plus-sign">
            New request in central tenant
          </Icon>
        </Button>
        <Button
          to={newRequestLink}
          buttonStyle="dropdownItem"
        >
          <Icon icon="plus-sign">
            New request in data tenant
          </Icon>
        </Button>
      </>
    );
  }

  // if single tenant we leave olb version of "New request" button
  return (
    <Button
      to={newRequestLink}
      buttonStyle="dropdownItem"
      data-test-inventory-create-request-action
    >
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-inventory.newRequest" />
      </Icon>
    </Button>
  );
}

CreateRequestButton.propTypes = {
  newRequestLink: PropTypes.string.isRequired,
};

export default CreateRequestButton;
