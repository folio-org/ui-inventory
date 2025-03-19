import React, {
  useMemo,
  useState,
  useContext,
  forwardRef,
  useRef,
} from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  PaneCloseLink,
  Layout,
} from '@folio/stripes/components';
import { VersionHistoryButton } from '@folio/stripes-acq-components';

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
import { ConsortialHoldings } from '../HoldingsList/consortium/ConsortialHoldings';
import { InstanceVersionHistory } from '../InstanceVersionHistory';

import {
  getAccordionState,
  getPublishingInfo,
} from './utils';
import {
  getDate,
  getIsVersionHistoryEnabled,
  isInstanceShadowCopy,
  isUserInConsortiumMode,
} from '../../utils';
import { useAuditSettings } from '../../hooks';
import { INVENTORY_AUDIT_GROUP } from '../../constants';

import css from './InstanceDetails.css';

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
  onClose,
  actionMenu,
  mutateInstance,
  instance = {},
  userTenantPermissions = [],
  tagsEnabled = false,
  isShared = false,
  ...rest
}, ref) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { okapi: { tenant: tenantId } } = stripes;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const prevInstanceId = useRef(instance?.id);
  const referenceData = useContext(DataContext);
  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);
  const [helperApp, setHelperApp] = useState();
  const [isAllExpanded, setIsAllExpanded] = useState();
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP, tenantId: instance?.tenantId });
  const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

  const canCreateHoldings = stripes.hasPerm('ui-inventory.holdings.create');
  const tags = instance?.tags?.tagList;
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
  const isConsortialHoldingsVisible = instance?.shared || isInstanceShadowCopy(instance?.source);
  const isUserInConsortium = isUserInConsortiumMode(stripes);

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
              disabled={isVersionHistoryOpen}
            />
          )
        }
        {isVersionHistoryEnabled && (
          <VersionHistoryButton
            disabled={isVersionHistoryOpen}
            onClick={() => setIsVersionHistoryOpen(true)}
          />
        )}
      </PaneMenu>
    );
  }, [tagsEnabled, tags, intl, isVersionHistoryOpen, isVersionHistoryEnabled]);

  const updatePrevInstanceId = id => {
    prevInstanceId.current = id;
  };

  const getEntity = () => instance;

  const paneTitle = useMemo(
    () => {
      const isInstanceShared = Boolean(isShared || isInstanceShadowCopy(instance?.source));

      return intl.formatMessage(
        { id: `ui-inventory.${isUserInConsortium ? 'consortia.' : ''}instanceRecordTitle` },
        {
          isShared: isInstanceShared,
          title: instance?.title,
          publisherAndDate: getPublishingInfo(instance),
        }
      );
    },
    [isShared, instance?.source, isUserInConsortium],
  );
  const paneSubTitle = useMemo(
    () => {
      return (
        <FormattedMessage
          id="ui-inventory.instanceRecordSubtitle"
          values={{
            hrid: instance?.hrid,
            updatedDate: getDate(instance?.metadata?.updatedDate),
          }}
        />
      );
    },
    [instance?.hrid, instance?.metadata?.updatedDate],
  );

  const onToggle = newState => {
    const isExpanded = Object.values(newState)[0];

    setIsAllExpanded(isExpanded);
  };

  const warningBanners = [
    {
      condition: !instance.deleted && instance.staffSuppress && !instance.discoverySuppress,
      messageId: 'ui-inventory.warning.instance.staffSuppressed',
    },
    {
      condition: !instance.deleted && instance.discoverySuppress && !instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.suppressedFromDiscovery',
    },
    {
      condition: !instance.deleted && instance.discoverySuppress && instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.suppressedFromDiscoveryAndStaffSuppressed',
    },
    {
      condition: instance.deleted && instance.discoverySuppress && instance.staffSuppress,
      messageId: 'ui-inventory.warning.instance.setForDeletionAndSuppressedFromDiscoveryAndStaffSuppressed',
    },
  ];

  const warningBannersClassNames = classNames(
    'display-flex full flex-align-items-center justify-end',
    css.hasMarginBottom,
  );

  return (
    <>
      <Pane
        {...rest}
        data-test-instance-details
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={paneTitle}
        paneSub={paneSubTitle}
        actionMenu={!isVersionHistoryOpen ? actionMenu : null}
        firstMenu={(
          <PaneCloseLink
            autoFocus={location.state?.isClosingFocused}
            onClick={onClose}
            aria-label={intl.formatMessage({ id: 'stripes-components.closeItem' }, { item: paneTitle })}
          />
        )}
        lastMenu={detailsLastMenu}
        defaultWidth="fill"
      >
        <TitleManager record={instance.title} />

        <AccordionStatus ref={ref}>
          <Row>
            <Layout className={warningBannersClassNames}>
              <Col xs={10}>
                {warningBanners.map(({ condition, messageId }) => (
                  <MessageBanner marginTop0 key={messageId} show={Boolean(condition)} type="warning">
                    <FormattedMessage id={messageId} />
                  </MessageBanner>
                ))}
              </Col>
              <Col data-test-expand-all xs={2}>
                <ExpandAllButton onToggle={onToggle} />
              </Col>
            </Layout>
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
                prevInstanceId={prevInstanceId.current}
                updatePrevInstanceId={updatePrevInstanceId}
                userTenantPermissions={userTenantPermissions}
                isAllExpanded={isAllExpanded}
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
              instanceDateTypes={referenceData.instanceDateTypes}
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
              subjectSources={referenceData.subjectSources}
              subjectTypes={referenceData.subjectTypes}
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
      {isVersionHistoryOpen && (
        <InstanceVersionHistory
          instanceId={instance?.id}
          onClose={() => setIsVersionHistoryOpen(false)}
        />
      )}
      { helperApp &&
        <HelperApp
          getEntity={getEntity}
          mutateEntity={mutateInstance}
          appName={helperApp}
          onClose={setHelperApp}
        />
      }
    </>
  );
});

InstanceDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  actionMenu: PropTypes.func,
  mutateInstance: PropTypes.func,
  instance: PropTypes.object,
  tagsToggle: PropTypes.func,
  tagsEnabled: PropTypes.bool,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
  isShared: PropTypes.bool,
};

export default InstanceDetails;
