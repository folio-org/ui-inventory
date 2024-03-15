import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import { switchAffiliation } from '../../utils';

const CreateRequestButton = ({ newRequestLink }) => {
  const stripes = useStripes();
  const history = useHistory();

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

    const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
    const onCreateRequest = () => {
      history.push(newRequestLink);
    };

    // if data tenant
    return (
      <>
        <Button
          buttonStyle="dropdownItem"
          onClick={async () => {
            await switchAffiliation(stripes, centralTenantId, onCreateRequest);
          }}
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
