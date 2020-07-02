import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';

import {
  useInstance,
  useGoBack,
} from '../../common/hooks';

import InstanceMarc from './InstanceMarc';

const InstanceMarcContainer = ({ mutator, instanceId }) => {
  const goBack = useGoBack(`/inventory/view/${instanceId}`);

  const [marc, setMarc] = useState();
  const [isMarcLoading, setIsMarcLoading] = useState(true);

  const { instance, isLoading: isInstanceLoading } = useInstance(instanceId, mutator.marcInstance);

  useEffect(() => {
    setIsMarcLoading(true);

    mutator.marcRecord.GET()
      .then((marcResponse) => setMarc(marcResponse.parsedRecord.content))
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

  return (
    <InstanceMarc
      instance={instance}
      marc={marc}
      onClose={goBack}
    />
  );
};

InstanceMarcContainer.manifest = Object.freeze({
  marcInstance: {
    type: 'okapi',
    records: 'instances',
    throwErrors: false,
    path: 'inventory/instances',
    accumulate: true,
  },
  marcRecord: {
    type: 'okapi',
    path: 'source-storage/records/!{instanceId}/formatted?idType=INSTANCE',
    accumulate: true,
    throwErrors: false,
  },
});

InstanceMarcContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default stripesConnect(InstanceMarcContainer);
