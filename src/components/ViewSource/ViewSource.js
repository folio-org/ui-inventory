import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  LoadingView,
} from '@folio/stripes/components';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';

const ViewSource = ({
  mutator,
  instanceId,
  holdingsRecordId,
  isHoldingsRecord,
}) => {
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
    <MarcView
      paneTitle={paneTitle}
      marcTitle={marcTitle}
      marc={marc}
      onClose={goBack}
    />
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
