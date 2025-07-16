import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  LoadingView,
  HasCommand,
  checkScope,
  Paneset,
  PaneMenu,
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@folio/stripes/components';
import {
  useCallout,
  useStripes,
  checkIfUserInMemberTenant,
  useUserTenantPermissions,
} from '@folio/stripes/core';
import {
  MarcView,
  PrintPopup,
  getHeaders,
  MarcVersionHistory,
} from '@folio/stripes-marc-components';
import { VersionHistoryButton } from '@folio/stripes-acq-components';

import ActionItem from '../ActionItem';
import { useGoBack } from '../../common/hooks';
import {
  useAuditSettings,
  useQuickExport,
  useSharedInstancesQuery,
} from '../../hooks';
import { IdReportGenerator } from '../../reports';
import {
  isUserInConsortiumMode,
  handleKeyCommand,
  redirectToMarcEditPage,
  flattenCentralTenantPermissions,
  getIsVersionHistoryEnabled,
} from '../../utils';
import MARC_TYPES from './marcTypes';
import {
  INSTANCE_RECORD_TYPE,
  INVENTORY_AUDIT_GROUP,
} from '../../constants';

import styles from './ViewSource.css';

const ViewSource = ({
  mutator,
  instance = {},
  instanceId,
  isInstanceLoading,
  holdingsRecordId,
  tenantId,
  marcType,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const location = useLocation();
  const history = useHistory();
  const callout = useCallout();
  const [isShownPrintPopup, setIsShownPrintPopup] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  const { exportRecords } = useQuickExport();
  const { sharedInstances } = useSharedInstancesQuery({ searchParams: { instanceIdentifier: instanceId } });

  const openPrintPopup = () => setIsShownPrintPopup(true);
  const closePrintPopup = () => setIsShownPrintPopup(false);
  const isHoldingsRecord = marcType === MARC_TYPES.HOLDINGS;
  const isBibRecord = marcType === MARC_TYPES.BIB;
  const isSharedFromLocalRecord = !!sharedInstances?.[0];

  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const isPrintBibAvailable = !isHoldingsRecord && stripes.hasPerm('ui-quick-marc.quick-marc-editor.view');
  const isPrintHoldingsAvailable = isHoldingsRecord && stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.view');
  const isPrintAvailable = isPrintBibAvailable || isPrintHoldingsAvailable;

  const pathForGoBack = isHoldingsRecord
    ? `/inventory/view/${instanceId}/${holdingsRecordId}`
    : `/inventory/view/${instanceId}`;

  const goBack = useGoBack(pathForGoBack);

  const [marc, setMarc] = useState();
  const [isMarcLoading, setIsMarcLoading] = useState(true);

  const redirectToMARCEdit = useCallback(() => {
    const urlId = isHoldingsRecord ? `${instanceId}/${holdingsRecordId}` : instanceId;
    const pathname = `/inventory/quick-marc/edit-${isHoldingsRecord ? 'holdings' : 'bibliographic'}/${urlId}`;

    redirectToMarcEditPage(pathname, instance, location, history);
  }, [isHoldingsRecord]);

  const { userPermissions: centralTenantPermissions } = useUserTenantPermissions({
    tenantId: centralTenantId,
  }, {
    enabled: Boolean(instance?.shared && checkIfUserInMemberTenant(stripes)),
  });

  const flattenedPermissions = useMemo(() => flattenCentralTenantPermissions(centralTenantPermissions), [centralTenantPermissions]);

  const canEdit = useMemo(() => {
    if (marcType === MARC_TYPES.HOLDINGS) {
      return stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.all');
    }

    if (checkIfUserInMemberTenant(stripes) && instance?.shared) {
      return flattenedPermissions.has('ui-quick-marc.quick-marc-editor.all');
    }

    return stripes.hasPerm('ui-quick-marc.quick-marc-editor.all');
  }, [marcType, instance?.shared]);

  const shortcuts = useMemo(() => [
    {
      name: 'editMARC',
      handler: handleKeyCommand(() => {
        if (!canEdit) {
          callout.sendCallout({
            type: 'error',
            message: intl.formatMessage({ id: 'ui-inventory.shortcut.editMARC.noPermission' }),
          });
          return;
        }

        redirectToMARCEdit();
      }),
    },
  ], [stripes, redirectToMARCEdit]);

  useEffect(() => {
    setIsMarcLoading(true);

    const { okapi: { tenant, token, locale } } = stripes;

    // MARC Holdings doesn't support shared records yet
    // so we should always request MARC Holdings records from a current tenant
    const paramsForMarcSource = marcType === MARC_TYPES.HOLDINGS
      ? null
      : { headers: getHeaders(tenantId ?? tenant, token, locale) };

    mutator.marcRecord.GET(paramsForMarcSource)
      .then((marcResponse) => {
        setMarc(marcResponse);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('MARC record getting ERROR: ', error);

        goBack();
      })
      .finally(() => {
        setIsMarcLoading(false);
      });
  }, []);

  const canExport = !isHoldingsRecord && stripes.hasPerm('ui-data-export.edit');

  const triggerQuickExport = useCallback(async () => {
    const instanceIds = [instanceId];
    try {
      await exportRecords({ uuids: instanceIds, recordType: INSTANCE_RECORD_TYPE });
      new IdReportGenerator('QuickInstanceExport').toCSV(instanceIds);
    } catch (e) {
      callout.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-inventory.communicationProblem' }),
      });
    }
  }, []);

  const actionMenu = useCallback(({ onToggle }) => {
    if (!canEdit && !canExport && !isPrintAvailable) {
      return null;
    }

    return (
      <>
        {canEdit && (
          <ActionItem
            id="edit-marc"
            icon="edit"
            messageId={`ui-inventory.${isHoldingsRecord ? 'editMARCHoldings' : 'editInstanceMarc'}`}
            onClickHandler={() => {
              onToggle();
              redirectToMARCEdit();
            }}
          />
        )}
        {canExport && (
          <ActionItem
            id="quick-export-trigger"
            icon="download"
            messageId="ui-inventory.exportInstanceInMARC"
            onClickHandler={() => {
              onToggle();
              triggerQuickExport();
            }}
          />
        )}
        {isPrintAvailable && (
          <ActionItem
            id="print-marc"
            icon="print"
            messageId="ui-inventory.print"
            onClickHandler={() => {
              onToggle();
              openPrintPopup();
            }}
          />
        )}
      </>
    );
  }, []);

  const { settings } = useAuditSettings({ tenantId, group: INVENTORY_AUDIT_GROUP, enabled: isBibRecord });

  const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

  const showVersionHistoryButton = marcType === MARC_TYPES.BIB && isVersionHistoryEnabled;

  const actionsDropdown = (
    <Dropdown
      disabled={isVersionHistoryOpen}
      className={styles.actionsDropdown}
      renderTrigger={({ getTriggerProps }) => (
        <DropdownButton
          data-testid="actions-dropdown"
          buttonStyle="primary"
          marginBottom0
          {...getTriggerProps()}
        >
          <FormattedMessage id="stripes-smart-components.actions" />
        </DropdownButton>
      )}
      renderMenu={({ onToggle }) => (
        <DropdownMenu>
          {actionMenu({ onToggle })}
        </DropdownMenu>
      )}
    />
  );

  const lastMenu = (
    <PaneMenu>
      {actionsDropdown}
      {showVersionHistoryButton && <VersionHistoryButton onClick={() => setIsVersionHistoryOpen(true)} />}
    </PaneMenu>
  );

  if (isMarcLoading || isInstanceLoading) return <LoadingView />;

  if (!(marc && instance)) return null;

  const paneTitle = isHoldingsRecord
    ? (
      <FormattedMessage
        id="ui-inventory.marcHoldingsRecord.paneTitle"
        values={{ title: instance.title }}
      />
    )
    : instance.title;

  const marcTitle = (
    <FormattedMessage
      id={`ui-inventory.marcSourceRecord.${marcType}`}
      values={{
        shared: isUserInConsortiumMode(stripes) ? marcType === MARC_TYPES.BIB && instance.shared : null,
      }}
    />
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset id="view-source-paneset">
        <MarcView
          paneTitle={paneTitle}
          marcTitle={marcTitle}
          marc={marc}
          onClose={goBack}
          lastMenu={lastMenu}
          paneWidth="fill"
          wrapperClass={styles.viewSource}
          isPaneset={false}
        />
        {isPrintAvailable && isShownPrintPopup && (
          <PrintPopup
            marc={marc}
            paneTitle={instance.title}
            marcTitle={marcTitle}
            onAfterPrint={closePrintPopup}
          />
        )}
        {isVersionHistoryOpen && (
          <MarcVersionHistory
            id={marc.matchedId}
            onClose={() => setIsVersionHistoryOpen(false)}
            marcType="bib"
            tenantId={tenantId}
            isSharedFromLocalRecord={isSharedFromLocalRecord}
          />
        )}
      </Paneset>
    </HasCommand>
  );
};


ViewSource.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  instance: PropTypes.object,
  isInstanceLoading: PropTypes.bool,
  holdingsRecordId: PropTypes.string,
  tenantId: PropTypes.string,
  marcType: PropTypes.oneOf(Object.values(MARC_TYPES)).isRequired,
};

export default ViewSource;
