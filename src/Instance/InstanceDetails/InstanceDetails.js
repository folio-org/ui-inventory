import React, { useMemo, useState, useContext, forwardRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  AppIcon,
  checkIfUserInCentralTenant,
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
  Icon,
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

import { DataContext } from '../../contexts';
import { ConsortialHoldings } from './ConsortialHoldings';
import {
  getAccordionState,
  getPublishingInfo,
} from './utils';
import {
  getDate,
  isInstanceShadowCopy,
  isUserInConsortiumMode,
} from '../../utils';

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
  onClose,
  actionMenu,
  tagsEnabled,
  userTenantPermissions,
  isShared,
  isLoading,
  isInstanceSharing,
  ...rest
}, ref) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { okapi: { tenant: tenantId } } = stripes;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const referenceData = useContext(DataContext);
  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);
  const [helperApp, setHelperApp] = useState();

  const isBasicPane = isInstanceSharing || isLoading;
  const tags = instance?.tags?.tagList;
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const canCreateHoldings = stripes.hasPerm('ui-inventory.holdings.create');

  const detailsLastMenu = useMemo(() => {
    if (isBasicPane) return null;

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
  }, [isBasicPane, tagsEnabled, tags, intl]);
  const detailsActionMenu = useMemo(
    () => (isBasicPane ? null : actionMenu),
    [isBasicPane, actionMenu],
  );

  const renderPaneTitle = () => {
    if (isBasicPane) return intl.formatMessage({ id: 'ui-inventory.edit' });

    const isInstanceShared = Boolean(isShared || isInstanceShadowCopy(instance?.source));

    return (
      <FormattedMessage
        id={`ui-inventory.${isUserInConsortiumMode(stripes) ? 'consortia.' : ''}instanceRecordTitle`}
        values={{
          isShared: isInstanceShared,
          title: instance?.title,
          publisherAndDate: getPublishingInfo(instance),
        }}
      />
    );
  };

  const renderPaneSubtitle = () => {
    if (isBasicPane) return null;

    return (
      <FormattedMessage
        id="ui-inventory.instanceRecordSubtitle"
        values={{
          hrid: instance?.hrid,
          updatedDate: getDate(instance?.metadata?.updatedDate),
        }}
      />
    );
  };

  const renderDetails = () => {
    if (isInstanceSharing) {
      return (
        <div>
          <MessageBanner show={Boolean(isInstanceSharing)} type="warning">
            <FormattedMessage id="ui-inventory.warning.instance.sharingLocalInstance" />
          </MessageBanner>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div>
          <Icon
            icon="spinner-ellipsis"
            width="100px"
          />
        </div>
      );
    }

    const isConsortialHoldingsVisible = instance?.shared || isInstanceShadowCopy(instance?.source);

    return (
      <>
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

            {!isUserInCentralTenant && canCreateHoldings && (
              <InstanceNewHolding
                instance={instance}
                tenantId={tenantId}
              />
            )}

            {isConsortialHoldingsVisible && (
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
      </>
    );
  };

  return (
    <>
      <Pane
        {...rest}
        data-test-instance-details
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={renderPaneTitle()}
        paneSub={renderPaneSubtitle()}
        actionMenu={detailsActionMenu}
        lastMenu={detailsLastMenu}
        dismissible
        onClose={onClose}
        defaultWidth="fill"
      >
        {renderDetails()}
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
  tagsToggle: PropTypes.func,
  tagsEnabled: PropTypes.bool,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  isInstanceSharing: PropTypes.bool,
  isShared: PropTypes.bool,
};

InstanceDetails.defaultProps = {
  instance: {},
  tagsEnabled: false,
  isLoading: false,
  isInstanceSharing: false,
  isShared: false,
};

export default InstanceDetails;
