import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  IfInterface,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';

import { useUserAffiliations } from '@folio/consortia-settings/src/hooks';
import { MemberTenantHoldings } from '../MemberTenantHoldings';

const ConsortialHoldings = ({ instance }) => {
  const stripes = useStripes();
  const { affiliations } = useUserAffiliations({ userId: stripes.user.user.id });
  const otherMembers = affiliations.filter(affiliation => !affiliation.isPrimary && (affiliation.tenantId !== stripes.okapi.tenant));

  return (
    <IfInterface name="consortia">
      <Accordion
        id="consortial-holdings"
        label={<FormattedMessage id="ui-inventory.consortialHoldings" />}
        closedByDefault
      >
        <AccordionSet>
          {otherMembers.map(affiliation => (
            <MemberTenantHoldings
              affiliation={affiliation}
              instance={instance}
            />
          ))}
        </AccordionSet>
      </Accordion>
    </IfInterface>
  );
};

export default ConsortialHoldings;
