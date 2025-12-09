import {
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  IconButton,
  NoValue,
  Pane,
  PaneCloseLink,
  PaneMenu,
  FormattedDate,
} from '@folio/stripes/components';
import {
  AppIcon,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { VersionHistoryButton } from '@folio/stripes-acq-components';

import InstanceDetailsContent from '../InstanceDetailsContent';
import InstanceLoadingPane from '../components/InstanceLoadingPane';
import InstanceWarningPane from '../components/InstanceWarningPane';
import InstanceVersionHistory from '../InstanceVersionHistory';
import { HelperApp } from '../../../components';

import { useSharedInstancesQuery } from '../../hooks';
import { useAuditSettings } from '../../../hooks';

import {
  getIsVersionHistoryEnabled,
  isInstanceShadowCopy,
  isUserInConsortiumMode,
} from '../../../utils';
import { getPublishingInfo } from '../utils';
import {
  HTTP_RESPONSE_STATUS_CODES,
  INVENTORY_AUDIT_GROUP,
} from '../../../constants';

const ViewInstancePane = ({
  id,
  instance = {},
  isShared = false,
  tenantId,
  mutateInstance,
  isLoading,
  isError = false,
  error,
  isCentralTenantPermissionsLoading,
  tagsEnabled = false,
  userTenantPermissions = [],
  onClose,
  actionMenu,
  isInstanceSharing = false,
  holdingsSection,
  paneTitleRef,
  closeButtonRef,
  accordionStatusRef,
  isRecordImporting,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { id: instanceId } = useParams();
  const tags = instance?.tags?.tagList;

  const [helperApp, setHelperApp] = useState();
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP, tenantId: instance?.tenantId });
  const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

  const { sharedInstances } = useSharedInstancesQuery({ searchParams: { instanceIdentifier: instanceId } });
  const isUserInConsortium = isUserInConsortiumMode(stripes);

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
    [isShared, instance?.source, instance?.title, isUserInConsortium, intl],
  );

  const paneSubTitle = useMemo(
    () => {
      const updatedDate = instance?.metadata?.updatedDate;

      return (
        <FormattedMessage
          id="ui-inventory.instanceRecordSubtitle"
          values={{
            hrid: instance?.hrid,
            date: updatedDate ? <FormattedDate value={updatedDate} /> : <NoValue />,
          }}
        />
      );
    },
    [instance?.hrid, instance?.metadata?.updatedDate],
  );

  const lastMenu = useMemo(() => (
    <PaneMenu>
      {tagsEnabled && (
        <IconButton
          icon="tag"
          id="clickable-show-tags"
          onClick={() => setHelperApp('tags')}
          badgeCount={tags?.length}
          ariaLabel={intl.formatMessage({ id: 'ui-inventory.showTags' })}
          disabled={isVersionHistoryOpen}
        />
      )}
      {isVersionHistoryEnabled && (
        <VersionHistoryButton
          disabled={isVersionHistoryOpen}
          onClick={() => setIsVersionHistoryOpen(true)}
        />
      )}
    </PaneMenu>
  ), [tagsEnabled, tags, intl, isVersionHistoryOpen, isVersionHistoryEnabled]);

  const getEntity = () => instance;

  if (isRecordImporting) {
    return (
      <InstanceWarningPane
        onClose={onClose}
        messageBannerText={<FormattedMessage id="ui-inventory.warning.instance.importingRecord" />}
      />
    );
  }

  if (isInstanceSharing) {
    return (
      <InstanceWarningPane
        onClose={onClose}
        messageBannerText={<FormattedMessage id="ui-inventory.warning.instance.sharingLocalInstance" />}
      />
    );
  }

  const isInstanceLoading = isLoading || !instance || isCentralTenantPermissionsLoading;
  const isUserLacksPermToViewSharedInstance = isError
    && error?.response?.status === HTTP_RESPONSE_STATUS_CODES.FORBIDDEN
    && isShared;

  if (isUserLacksPermToViewSharedInstance) {
    return (
      <InstanceWarningPane
        onClose={onClose}
        messageBannerText={<FormattedMessage id="ui-inventory.warning.instance.accessSharedInstance" />}
      />
    );
  }

  if (isInstanceLoading) {
    return <InstanceLoadingPane onClose={onClose} />;
  }

  return (
    <>
      <Pane
        id={id}
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={paneTitle}
        paneSub={paneSubTitle}
        lastMenu={lastMenu}
        actionMenu={actionMenu}
        firstMenu={(
          <PaneCloseLink
            onClick={onClose}
            aria-label={intl.formatMessage({ id: 'stripes-components.closeItem' }, { item: paneTitle })}
            closeButtonRef={closeButtonRef}
          />
        )}
        defaultWidth="fill"
        paneTitleRef={paneTitleRef}
      >
        <div>
          <TitleManager record={instance.title} />

          <InstanceDetailsContent
            instance={instance}
            tenantId={tenantId}
            userTenantPermissions={userTenantPermissions}
            holdingsSection={holdingsSection}
            accordionStatusRef={accordionStatusRef}
          />
        </div>
      </Pane>

      {isVersionHistoryOpen && (
        <InstanceVersionHistory
          instanceId={instanceId}
          onClose={() => setIsVersionHistoryOpen(false)}
          tenantId={instance?.tenantId}
          isSharedFromLocalRecord={!!sharedInstances?.[0]}
        />
      )}
      {helperApp && (
        <HelperApp
          getEntity={getEntity}
          mutateEntity={mutateInstance}
          appName={helperApp}
          onClose={setHelperApp}
        />
      )}
    </>
  );
};

ViewInstancePane.propTypes = {
  id: PropTypes.string,
  instance: PropTypes.object,
  isShared: PropTypes.bool,
  tenantId: PropTypes.string.isRequired,
  mutateInstance: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.object,
  isCentralTenantPermissionsLoading: PropTypes.bool,
  tagsEnabled: PropTypes.bool,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  actionMenu: PropTypes.func.isRequired,
  isInstanceSharing: PropTypes.bool,
  holdingsSection: PropTypes.node,
  paneTitleRef: PropTypes.object,
  closeButtonRef: PropTypes.object,
  accordionStatusRef: PropTypes.object,
  isRecordImporting: PropTypes.bool
};

export default ViewInstancePane;
