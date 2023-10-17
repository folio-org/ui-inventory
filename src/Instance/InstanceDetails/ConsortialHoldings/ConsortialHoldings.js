import React, { useContext } from 'react';
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
import { DataContext } from '../../../contexts';
import { useSearchForShadowInstanceTenants } from '../../../hooks';

const ConsortialHoldings = ({ instance }) => {
  const stripes = useStripes();
  const { consortiaTenantsById } = useContext(DataContext);

  const { tenants } = useSearchForShadowInstanceTenants({ instanceId: instance?.id });

  if (!consortiaTenantsById) return null;

  const memberTenants = tenants
    .map(tenant => consortiaTenantsById[tenant.id])
    .filter(tenant => !tenant?.isCentral && (tenant?.id !== stripes.okapi.tenant))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <IfInterface name="consortia">
      <Accordion
        id="consortial-holdings"
        label={<FormattedMessage id="ui-inventory.consortialHoldings" />}
        closedByDefault
      >
        {!memberTenants.length
          ? <FormattedMessage id="stripes-components.tableEmpty" />
          : (
            <AccordionSet>
              {memberTenants.map(memberTenant => (
                <MemberTenantHoldings
                  key={memberTenant.id}
                  memberTenant={memberTenant}
                  instance={instance}
                />
              ))}
            </AccordionSet>
          )
        }
      </Accordion>
    </IfInterface>
  );
};

ConsortialHoldings.propTypes = { instance: PropTypes.object.isRequired };

export default ConsortialHoldings;
