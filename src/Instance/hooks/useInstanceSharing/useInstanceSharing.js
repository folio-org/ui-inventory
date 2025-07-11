import { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useShareLocalInstance from '../useShareLocalInstance';
import useInstanceModalsContext from '../useInstanceModalsContext';
import { INSTANCE_SHARING_STATUSES } from '../../../constants';

const useInstanceSharing = ({
  instance,
  tenantId,
  centralTenantId,
  refetchInstance,
  sendCallout,
}) => {
  const [isInstanceSharing, setIsInstanceSharing] = useState(false);
  const intervalRef = useRef(null);
  const ky = useOkapiKy();
  const stripes = useStripes();

  const { id: consortiumId } = stripes.user.user.consortium || {};

  const { shareInstance } = useShareLocalInstance();

  const {
    setIsShareLocalInstanceModalOpen,
    setIsUnlinkAuthoritiesModalOpen,
    setIsShareButtonDisabled,
  } = useInstanceModalsContext();

  const handleSharingError = () => {
    clearInterval(intervalRef.current);

    setIsInstanceSharing(false);
    setIsShareButtonDisabled(false);

    sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.shareLocalInstance.toast.unsuccessful" values={{ instanceTitle: instance.title }} />,
    });
  };

  const checkSharingStatus = async () => {
    try {
      const response = await ky.get(`consortia/${consortiumId}/sharing/instances`, {
        searchParams: {
          sourceTenantId: tenantId,
          instanceIdentifier: instance?.id,
        },
      }).json();

      const status = response?.sharingInstances?.[0]?.status;

      if (status === INSTANCE_SHARING_STATUSES.COMPLETE) {
        clearInterval(intervalRef.current);
        await refetchInstance();
        setIsInstanceSharing(false);
        sendCallout({
          type: 'success',
          message: <FormattedMessage id="ui-inventory.shareLocalInstance.toast.successful" values={{ instanceTitle: instance.title }} />,
        });
      } else if (status === INSTANCE_SHARING_STATUSES.ERROR) {
        handleSharingError();
      }
    } catch (error) {
      handleSharingError();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleShareLocalInstance = async () => {
    const sourceTenantId = tenantId;
    const instanceIdentifier = instance.id;

    try {
      await shareInstance({
        consortiumId,
        body: {
          sourceTenantId,
          instanceIdentifier,
          targetTenantId: centralTenantId,
        },
      });

      setIsUnlinkAuthoritiesModalOpen(false);
      setIsShareLocalInstanceModalOpen(false);
      setIsInstanceSharing(true);
      setIsShareButtonDisabled(false);

      // Start polling
      intervalRef.current = setInterval(checkSharingStatus, 2000);
    } catch (error) {
      setIsUnlinkAuthoritiesModalOpen(false);
      setIsShareLocalInstanceModalOpen(false);

      handleSharingError();
    }
  };

  return {
    isInstanceSharing,
    handleShareLocalInstance,
  };
};

export default useInstanceSharing;
