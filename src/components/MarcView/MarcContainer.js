import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';

import {
  isControlField,
} from './utils';
import MarcView from './MarcView';

const MarcContainer = ({
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
        const parsedMarc = marcResponse.parsedRecord.content;

        setMarc({
          leader: parsedMarc.leader,
          fields: [
            ...parsedMarc.fields.filter(isControlField),
            ...parsedMarc.fields.filter(field => !isControlField(field)),
          ],
        });
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


MarcContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  holdingsRecordId: PropTypes.string,
  isHoldingsRecord: PropTypes.bool,
};
MarcContainer.defaultProps = {
  isHoldingsRecord: false,
};

export default MarcContainer;
