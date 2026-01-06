import {
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfInterface,
  useStripes,
  getUserTenantsPermissions,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  ExpandAllButton,
} from '@folio/stripes/components';

import { MemberTenantHoldings } from '../MemberTenantHoldings';
import { DataContext } from '../../../../contexts';
import {
  useSearchForShadowInstanceTenants,
  useHoldingsFromStorage,
} from '../../../../hooks';

const ConsortialHoldings = ({
  instance,
  prevInstanceId,
  updatePrevInstanceId,
  isAllExpanded,
}) => {
  const instanceId = instance?.id;

  const stripes = useStripes();
  const { consortiaTenantsById } = useContext(DataContext);
  const { tenants } = useSearchForShadowInstanceTenants({ instanceId });
  const [status, updateStatus] = useHoldingsFromStorage({ defaultValue: {} });
  const [userTenantPermissions, setUserTenantPermissions] = useState(null);

  useEffect(() => {
    if (instanceId !== prevInstanceId) {
      updateStatus({});
      updatePrevInstanceId(instanceId);
    }
  }, []);

  useEffect(() => {
    getUserTenantsPermissions(stripes, tenants).then(perms => setUserTenantPermissions(perms));
  }, [tenants]);

  useEffect(() => {
    if (typeof isAllExpanded === 'boolean') {
      updateStatus(curStatus => {
        const newStatus = {};
        Object.keys(curStatus).forEach((s) => {
          newStatus[s] = isAllExpanded;
        });
        return newStatus;
      });
    }
  }, [isAllExpanded]);

  if (!consortiaTenantsById) return null;

  const memberTenants = tenants
    .map(tenant => consortiaTenantsById[tenant.id])
    .filter(tenant => !!tenant && !tenant?.isCentral && (tenant?.id !== stripes.okapi.tenant))
    .sort((a, b) => a.name.localeCompare(b.name));

  const onToggle = ({ id }) => {
    updateStatus(current => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const onRegisterNewAcc = id => {
    updateStatus(current => ({
      ...current,
      [id]: current[id] || false,
    }));
  };

  const renderExpandAllButton = (
    <ExpandAllButton
      accordionStatus={status}
      setStatus={updateStatus}
    />
  );

  return (
    <IfInterface name="consortia">
      <AccordionSet
        accordionStatus={status}
        onToggle={onToggle}
        onRegisterAccordion={onRegisterNewAcc}
      >
        <Accordion
          id={`consortialHoldings.${instance?.id}`}
          label={<FormattedMessage id="ui-inventory.consortialHoldings" />}
          displayWhenClosed={renderExpandAllButton}
          displayWhenOpen={renderExpandAllButton}
        >
          {!memberTenants.length
            ? <FormattedMessage id="stripes-components.tableEmpty" />
            : (
              <>
                {memberTenants.map(memberTenant => (
                  <MemberTenantHoldings
                    key={`${memberTenant.id}.${instanceId}`}
                    memberTenant={memberTenant}
                    instance={instance}
                    userTenantPermissions={userTenantPermissions}
                  />
                ))}
              </>
            )
          }
        </Accordion>
      </AccordionSet>
    </IfInterface>
  );
};

ConsortialHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  prevInstanceId: PropTypes.string,
  updatePrevInstanceId: PropTypes.func,
  isAllExpanded: PropTypes.bool,
};

export default ConsortialHoldings;
