import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { TitleManager, useCallout } from '@folio/stripes/core';
import { LoadingPane, Paneset } from '@folio/stripes/components';

import { CardsPerVersionHistoryPageForm } from './components';
import { useAuditSettings } from '../../hooks';
import {
  INVENTORY_AUDIT_GROUP,
  VERSION_HISTORY_PAGE_SIZE_SETTING,
} from '../../constants';

export const CardsPerVersionHistoryPage = () => {
  const intl = useIntl();
  const callout = useCallout();
  const {
    settings,
    updateSetting,
    isSettingsLoading,
    isError,
  } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP });

  const setting = settings?.find(_setting => _setting.key === VERSION_HISTORY_PAGE_SIZE_SETTING);

  const initialValues = {
    cardsPerPage: setting?.value,
  };

  const handleSubmit = useCallback(async ({ cardsPerPage }) => {
    // destructure the setting object to keep other values
    await updateSetting({
      body: {
        ...setting,
        value: cardsPerPage,
      },
      settingKey: VERSION_HISTORY_PAGE_SIZE_SETTING,
    });

    callout.sendCallout({
      message: intl.formatMessage({ id: 'stripes-smart-components.cm.success' }),
    });
  }, [setting, updateSetting]);

  if (isError) {
    callout.sendCallout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-inventory.settings.versionHistory.versionHistoryCardsPerPage.loadError' }),
    });

    return null;
  }

  return (
    <TitleManager
      record={intl.formatMessage({ id: 'ui-inventory.settings.section.cardsPerPage' })}
    >
      <Paneset id="cardsPerPage">
        {isSettingsLoading ? (
          <LoadingPane />
        ) : (
          <CardsPerVersionHistoryPageForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
          />
        )}
      </Paneset>
    </TitleManager>
  );
};
