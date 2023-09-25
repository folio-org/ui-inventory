import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfInterface,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';

import { MemberTenantHoldings } from '../MemberTenantHoldings';
import { useUserAffiliations } from '../../../hooks';

const ConsortialHoldings = ({ instance }) => {
  const stripes = useStripes();
  const { affiliations } = useUserAffiliations({ userId: stripes.user.user.id });

  const memberTenants = affiliations.filter(affiliation => {
    const isNotCentralTenant = !affiliation.isPrimary;
    const isNotCurrentTenant = (affiliation.tenantId !== stripes.okapi.tenant);

    return isNotCentralTenant && isNotCurrentTenant;
  });

  return (
    <IfInterface name="consortia">
      <Accordion
        id="consortial-holdings"
        label={<FormattedMessage id="ui-inventory.consortialHoldings" />}
        closedByDefault
      >
        <AccordionSet>
          {memberTenants.map(memberTenant => (
            <MemberTenantHoldings
              memberTenant={memberTenant}
              instance={instance}
            />
          ))}
        </AccordionSet>
      </Accordion>
    </IfInterface>
  );
};

ConsortialHoldings.propTypes = { instance: PropTypes.object.isRequired };

export default ConsortialHoldings;
