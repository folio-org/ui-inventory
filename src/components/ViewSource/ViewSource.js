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
  Button,
  LoadingView,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import {
  useCallout,
  useStripes,
} from '@folio/stripes/core';
import {
  MarcView,
  PrintPopup,
  getHeaders,
} from '@folio/stripes-marc-components';

import { useGoBack } from '../../common/hooks';

import {
  isUserInConsortiumMode,
  handleKeyCommand,
  redirectToMarcEditPage,
} from '../../utils';
import MARC_TYPES from './marcTypes';

import styles from './ViewSource.css';
import ActionItem from '../ActionItem';
import { useQuickExport } from '../../hooks';
import { IdReportGenerator } from '../../reports';

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
  const { exportRecords } = useQuickExport();
  const openPrintPopup = () => setIsShownPrintPopup(true);
  const closePrintPopup = () => setIsShownPrintPopup(false);
  const isHoldingsRecord = marcType === MARC_TYPES.HOLDINGS;

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
    const pathname = `/inventory/quick-marc/edit-${isHoldingsRecord ? 'holdings' : 'bib'}/${urlId}`;

    redirectToMarcEditPage(pathname, instance, location, history);
  }, [isHoldingsRecord]);

  const canEdit = (marcType === MARC_TYPES.BIB && stripes.hasPerm('ui-quick-marc.quick-marc-editor.all'))
    || (marcType === MARC_TYPES.HOLDINGS && stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.all'));

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

    mutator.marcRecord.GET({ headers: getHeaders(tenantId ?? tenant, token, locale) })
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

  const canExport = !isHoldingsRecord && stripes.hasPerm('ui-data-export.app.enabled');

  const triggerQuickExport = useCallback(async () => {
    const instanceIds = [instanceId];
    try {
      await exportRecords({ uuids: instanceIds, recordType: 'INSTANCE' });
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
        shared: isUserInConsortiumMode(stripes) ? instance.shared : null,
      }}
    />
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <div className={styles.viewSource}>
        <MarcView
          paneTitle={paneTitle}
          marcTitle={marcTitle}
          marc={marc}
          onClose={goBack}
          actionMenu={actionMenu}
        />
        {isPrintAvailable && isShownPrintPopup && (
          <PrintPopup
            marc={marc}
            paneTitle={instance.title}
            marcTitle={marcTitle}
            onAfterPrint={closePrintPopup}
          />
        )}
      </div>
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
