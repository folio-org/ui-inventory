import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  LoadingView,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';
import PrintPopup from '@folio/quick-marc/src/QuickMarcView/PrintPopup';

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';

import { isUserInConsortiumMode } from '../../utils';
import { getHeaders } from '@folio/quick-marc/src/QuickMarcEditor/utils';
import MARC_TYPES from './marcTypes';

import styles from './ViewSource.css';

const ViewSource = ({
  mutator,
  instanceId,
  holdingsRecordId,
  marcType,
}) => {
  const stripes = useStripes();
  const [isShownPrintPopup, setIsShownPrintPopup] = useState(false);
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

  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId);

  useEffect(() => {
    setIsMarcLoading(true);

    const tenantId = instance?.tenantId;
    const { okapi: { tenant, token, locale } } = stripes;

    mutator.marcRecord.GET({ headers: getHeaders(tenantId || tenant, token, locale )})
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

  const marcTitle = (
    <FormattedMessage
      id={`ui-inventory.marcSourceRecord.${marcType}`}
      values={{
        shared: isUserInConsortiumMode(stripes) ? instance.shared : null,
      }}
    />
  );

  return (
    <div className={styles.viewSource}>
      <MarcView
        paneTitle={paneTitle}
        marcTitle={marcTitle}
        marc={marc}
        onClose={goBack}
        lastMenu={
          isPrintAvailable &&
            <Button
              marginBottom0
              buttonStyle="primary"
              onClick={openPrintPopup}
            >
              <FormattedMessage id="ui-quick-marc.print" />
            </Button>
        }
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
  );
};


ViewSource.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  holdingsRecordId: PropTypes.string,
  marcType: PropTypes.oneOf(Object.values(MARC_TYPES)).isRequired,
};

export default ViewSource;
