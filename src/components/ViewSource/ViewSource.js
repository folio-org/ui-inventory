import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  LoadingView,
} from '@folio/stripes/components';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import { IfPermission } from '@folio/stripes/core';
import PrintPopup from '@folio/quick-marc/src/QuickMarcView/PrintPopup';
import {
  useInstance,
  useGoBack,
} from '../../common/hooks';

import styles from './ViewSource.css';

const ViewSource = ({
  mutator,
  instanceId,
  holdingsRecordId,
  isHoldingsRecord,
}) => {
  const intl = useIntl();
  const [isShownPrintPopup, setIsShownPrintPopup] = useState(false);
  const openPrintPopup = () => setIsShownPrintPopup(true);
  const closePrintPopup = () => setIsShownPrintPopup(false);

  const pathForGoBack = isHoldingsRecord
    ? `/inventory/view/${instanceId}/${holdingsRecordId}`
    : `/inventory/view/${instanceId}`;

  const goBack = useGoBack(pathForGoBack);

  const [marc, setMarc] = useState();
  const [isMarcLoading, setIsMarcLoading] = useState(true);

  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId, mutator.marcInstance);

  useEffect(() => {
    setIsMarcLoading(true);

    mutator.marcRecord.GET()
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

  const marcTitle = isHoldingsRecord
    ? <FormattedMessage id="ui-inventory.marcHoldingsRecord" />
    : <FormattedMessage id="ui-inventory.marcSourceRecord" />;

  return (
    <div className={styles.viewSource}>
      <MarcView
        paneTitle={paneTitle}
        marcTitle={marcTitle}
        marc={marc}
        onClose={goBack}
        lastMenu={
          <IfPermission perm="ui-quick-marc.quick-marc-editor.view">
            <Button
              marginBottom0
              buttonStyle="primary"
              onClick={openPrintPopup}
            >
              <FormattedMessage id="ui-quick-marc.print" />
            </Button>
          </IfPermission>
        }
      />
      <IfPermission perm="ui-quick-marc.quick-marc-editor.view">
        {isShownPrintPopup && (
        <PrintPopup
          marc={marc}
          paneTitle={isHoldingsRecord ? '' : paneTitle}
          marcTitle={isHoldingsRecord ? intl.formatMessage({ id:'ui-inventory.marcHoldingsRecord.paneTitle' }, { title: instance.title }) : marcTitle}
          onAfterPrint={closePrintPopup}
        />
        )}
      </IfPermission>
    </div>
  );
};


ViewSource.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  holdingsRecordId: PropTypes.string,
  isHoldingsRecord: PropTypes.bool,
};
ViewSource.defaultProps = {
  isHoldingsRecord: false,
};

export default ViewSource;
