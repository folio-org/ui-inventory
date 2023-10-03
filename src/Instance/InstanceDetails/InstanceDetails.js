import React, { useMemo, useState, useContext, forwardRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  AppIcon,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Row,
  MessageBanner,
} from '@folio/stripes/components';

import { InstanceTitle } from './InstanceTitle';
import { InstanceAdministrativeView } from './InstanceAdministrativeView';
import { InstanceTitleData } from './InstanceTitleData';
import { InstanceIdentifiersView } from './InstanceIdentifiersView';
import { InstanceContributorsView } from './InstanceContributorsView';
import { InstanceDescriptiveView } from './InstanceDescriptiveView';
import { InstanceNotesView } from './InstanceNotesView';
import { InstanceElecAccessView } from './InstanceElecAccessView';
import { InstanceSubjectView } from './InstanceSubjectView';
import { InstanceClassificationView } from './InstanceClassificationView';
import { InstanceRelationshipView } from './InstanceRelationshipView';
import { InstanceNewHolding } from './InstanceNewHolding';
import { InstanceAcquisition } from './InstanceAcquisition';
import HelperApp from '../../components/HelperApp';

import { getAccordionState } from './utils';
import { hasMemberTenantPermission } from '../../utils';
import { DataContext } from '../../contexts';
import { ConsortialHoldings } from './ConsortialHoldings';

const accordions = {
  administrative: 'acc01',
  title: 'acc02',
  identifiers: 'acc03',
  contributors: 'acc04',
  descriptiveData: 'acc05',
  notes: 'instance-details-notes',
  electronicAccess: 'acc07',
  subjects: 'acc08',
  classifications: 'acc09',
  relationship: 'acc10',
  acquisition: 'acc11',
};

const InstanceDetails = forwardRef(({
  children,
  instance,
  paneTitle,
  paneSubtitle,
  onClose,
  actionMenu,
  tagsEnabled,
  userTenantPermissions,
  ...rest
}, ref) => {
  const intl = useIntl();
  const location = useLocation();
  const { okapi: { tenant: tenantId } } = useStripes();
  const searchParams = new URLSearchParams(location.search);

  const referenceData = useContext(DataContext);
  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);
  const [helperApp, setHelperApp] = useState();
  const tags = instance?.tags?.tagList;

  const canCreateHoldings = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.holdings.create', tenantId);

  const detailsLastMenu = useMemo(() => {
    return (
      <PaneMenu>
        {
          tagsEnabled && (
            <IconButton
              icon="tag"
              id="clickable-show-tags"
              onClick={() => setHelperApp('tags')}
              badgeCount={tags?.length}
              ariaLabel={intl.formatMessage({ id: 'ui-inventory.showTags' })}
            />
          )
        }
      </PaneMenu>
    );
  }, [tagsEnabled, tags, intl]);

  return (
    <>
      <Pane
        {...rest}
        data-test-instance-details
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={paneTitle}
        paneSub={paneSubtitle}
        dismissible
        onClose={onClose}
        actionMenu={actionMenu}
        defaultWidth="fill"
        lastMenu={detailsLastMenu}
      >
        <TitleManager record={instance.title} />

        <AccordionStatus ref={ref}>
          <Row>
            <Col xs={10}>
              <MessageBanner show={Boolean(instance.staffSuppress && !instance.discoverySuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.staffSuppressed" />
              </MessageBanner>
              <MessageBanner show={Boolean(instance.discoverySuppress && !instance.staffSuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.suppressedFromDiscovery" />
              </MessageBanner>
              <MessageBanner show={Boolean(instance.discoverySuppress && instance.staffSuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.suppressedFromDiscoveryAndStaffSuppressed" />
              </MessageBanner>
            </Col>
            <Col data-test-expand-all xs={2}>
              <ExpandAllButton />
            </Col>
          </Row>

          <InstanceTitle
            instance={instance}
            instanceTypes={referenceData.instanceTypes}
          />

          <AccordionSet initialStatus={accordionState}>
            {children}

            <InstanceNewHolding
              instance={instance}
              disabled={!canCreateHoldings}
            />

            {instance?.shared && (
              <ConsortialHoldings
                instance={instance}
                userTenantPermissions={userTenantPermissions}
              />
            )}

            <InstanceAdministrativeView
              id={accordions.administrative}
              instance={instance}
              instanceStatuses={referenceData.instanceStatuses}
              issuanceModes={referenceData.modesOfIssuance}
              statisticalCodes={referenceData.statisticalCodes}
              statisticalCodeTypes={referenceData.statisticalCodeTypes}
            />

            <InstanceTitleData
              id={accordions.title}
              instance={instance}
              titleTypes={referenceData.alternativeTitleTypes}
              identifierTypesById={referenceData.identifierTypesById}
              source={instance.source}
              segment={searchParams.get('segment')}
            />

            <InstanceIdentifiersView
              id={accordions.identifiers}
              identifiers={instance.identifiers}
              identifierTypes={referenceData.identifierTypes}
            />

            <InstanceContributorsView
              id={accordions.contributors}
              contributors={instance.contributors}
              contributorTypes={referenceData.contributorTypes}
              contributorNameTypes={referenceData.contributorNameTypes}
              source={instance.source}
              segment={searchParams.get('segment')}
            />

            <InstanceDescriptiveView
              id={accordions.descriptiveData}
              instance={instance}
              resourceTypes={referenceData.instanceTypes}
              resourceFormats={referenceData.instanceFormats}
              natureOfContentTerms={referenceData.natureOfContentTerms}
            />

            <InstanceNotesView
              id={accordions.notes}
              instance={instance}
              noteTypes={referenceData.instanceNoteTypes}
            />

            <InstanceElecAccessView
              id={accordions.electronicAccess}
              electronicAccessLines={instance.electronicAccess}
              electronicAccessRelationships={referenceData.electronicAccessRelationships}
            />

            <InstanceSubjectView
              id={accordions.subjects}
              subjects={instance.subjects}
              source={instance.source}
              segment={searchParams.get('segment')}
            />

            <InstanceClassificationView
              id={accordions.classifications}
              classifications={instance?.classifications}
              classificationTypes={referenceData.classificationTypes}
            />

            <InstanceAcquisition
              accordionId={accordions.acquisition}
              instanceId={instance.id}
            />

            <InstanceRelationshipView
              id={accordions.relationship}
              parentInstances={instance.parentInstances}
              childInstances={instance.childInstances}
            />
          </AccordionSet>
        </AccordionStatus>
      </Pane>
      { helperApp && <HelperApp appName={helperApp} onClose={setHelperApp} />}
    </>
  );
});

InstanceDetails.propTypes = {
  children: PropTypes.node,
  actionMenu: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  instance: PropTypes.object,
  paneTitle: PropTypes.object,
  paneSubtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tagsToggle: PropTypes.func,
  tagsEnabled: PropTypes.bool,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
};

InstanceDetails.defaultProps = {
  instance: {},
  tagsEnabled: false,
};

export default InstanceDetails;
