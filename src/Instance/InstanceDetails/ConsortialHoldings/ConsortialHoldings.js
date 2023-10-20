import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
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
import {
  useHoldingsAccordionState,
  useSearchForShadowInstanceTenants,
} from '../../../hooks';

const ConsortialHoldings = ({
  instance,
  userTenantPermissions,
}) => {
  const pathToAccordion = ['consortialHoldings', '_state'];
  const instanceId = instance?.id;

  const stripes = useStripes();
  const prevInstanceId = useRef(instanceId);
  const { consortiaTenantsById } = useContext(DataContext);
  const { tenants } = useSearchForShadowInstanceTenants({ instanceId });
  const [isConsortialAccOpen, setConsortialAccOpen] = useHoldingsAccordionState({ instanceId, pathToAccordion });

  useEffect(() => {
    if (instanceId !== prevInstanceId.current) {
      setConsortialAccOpen(false);
      prevInstanceId.current = instanceId;
    }
  }, [instanceId]);

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
        open={isConsortialAccOpen}
        onToggle={() => setConsortialAccOpen(prevState => !prevState)}
      >
        {!memberTenants.length
          ? <FormattedMessage id="stripes-components.tableEmpty" />
          : (
            <AccordionSet>
              {memberTenants.map(memberTenant => (
                <MemberTenantHoldings
                  key={`${memberTenant.id}.${instanceId}`}
                  memberTenant={memberTenant}
                  instance={instance}
                  userTenantPermissions={userTenantPermissions}
                />
              ))}
            </AccordionSet>
          )
        }
      </Accordion>
    </IfInterface>
  );
};

ConsortialHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
};

export default ConsortialHoldings;
