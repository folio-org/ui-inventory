import {
  useCallback,
  useMemo,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  InfoPopover,
  LoadingPane,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
  useUserTenantPermissions,
} from '@folio/stripes/core';

import { CallNumberTypeList } from './CallNumberTypeList';
import { CallNumberTypeField } from './CallNumberTypeField';
import { useCallNumberTypesQuery } from '../../hooks';
import { CALL_NUMBER_BROWSE_COLUMNS } from './constants';

const CallNumberBrowseSettings = () => {
  const stripes = useStripes();
  const intl = useIntl();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const { callNumberTypes, isCallNumberTypesLoading } = useCallNumberTypesQuery({ tenantId: centralTenantId });
  const ConnectedControlledVocab = useMemo(() => stripes.connect(ControlledVocab), [stripes]);

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    tenantId: centralTenantId,
  });

  const permission = 'ui-inventory.settings.call-number-browse';
  const hasCentralTenantPerm = centralTenantPermissions.some(({ permissionName }) => permissionName === permission);
  const hasRequiredPermissions = stripes.hasInterface('consortia')
    ? (hasCentralTenantPerm && stripes.hasPerm(permission))
    : stripes.hasPerm(permission);

  const fieldLabels = {
    [CALL_NUMBER_BROWSE_COLUMNS.ID]: intl.formatMessage({ id: 'ui-inventory.name' }),
    [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: intl.formatMessage({ id: 'ui-inventory.callNumberTypes' }),
  };

  const columnMapping = useMemo(() => ({
    [CALL_NUMBER_BROWSE_COLUMNS.ID]: fieldLabels[CALL_NUMBER_BROWSE_COLUMNS.ID],
    [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: (
      <>
        {fieldLabels[CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]}
        <InfoPopover
          content={intl.formatMessage({ id: 'ui-inventory.settings.instanceCallNumber.identifierTypesPopover' })}
        />
      </>
    ),
  }));

  const callNumberTypeOptions = useMemo(() => callNumberTypes.map(type => ({
    id: type.id,
    label: type.name,
  })), [callNumberTypes]);

  const formatRowData = useCallback(rowData => {
    const callNumberType = rowData[CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]
      ?.map(id => callNumberTypeOptions.find(type => type.id === id));

    return {
      ...rowData,
      name: intl.formatMessage({ id: `ui-inventory.settings.instanceCallNumber.${rowData.id}` }),
      [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: callNumberType,
    };
  }, [callNumberTypeOptions]);

  const formatItemForSaving = useCallback((item) => ({
    [CALL_NUMBER_BROWSE_COLUMNS.ID]: item[CALL_NUMBER_BROWSE_COLUMNS.ID],
    [CALL_NUMBER_BROWSE_COLUMNS.SHELVING_ALGORITHM]: item[CALL_NUMBER_BROWSE_COLUMNS.SHELVING_ALGORITHM],
    [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: item[CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS].map(type => type.id),
  }), []);

  if (!hasRequiredPermissions) {
    return null;
  }

  if (isCentralTenantPermissionsLoading || isCallNumberTypesLoading) {
    return <LoadingPane />;
  }

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
      record={intl.formatMessage({ id: 'ui-inventory.callNumberTypes' })}
    >
      <ConnectedControlledVocab
        stripes={stripes}
        baseUrl="browse/config/instance-call-number"
        records="configs"
        objectLabel={null}
        label={<FormattedMessage id="ui-inventory.callNumberBrowse" />}
        labelSingular={intl.formatMessage({ id: 'ui-inventory.name' })}
        visibleFields={[CALL_NUMBER_BROWSE_COLUMNS.NAME, CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]}
        columnMapping={columnMapping}
        hiddenFields={[CALL_NUMBER_BROWSE_COLUMNS.SHELVING_ALGORITHM, 'lastUpdated', 'numberOfObjects']}
        formatter={{
          [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: CallNumberTypeList,
        }}
        readOnlyFields={[CALL_NUMBER_BROWSE_COLUMNS.NAME]}
        nameKey="name"
        formType="final-form"
        id="call-number-browse"
        preUpdateHook={formatItemForSaving}
        editable
        fieldComponents={{
          [CALL_NUMBER_BROWSE_COLUMNS.TYPE_IDS]: (callNumberTypeProps) => (
            <CallNumberTypeField
              {...callNumberTypeProps}
              fieldLabels={fieldLabels}
              callNumberTypeOptions={callNumberTypeOptions}
            />
          ),
        }}
        canCreate={false}
        parseRow={formatRowData}
        actionSuppressor={{
          delete: () => true,
          edit: () => false,
        }}
        translations={{
          termUpdated: 'ui-inventory.settings.instanceCallNumber.termUpdated'
        }}
        hideCreateButton
        tenant={centralTenantId}
      />
    </TitleManager>
  );
};

export default CallNumberBrowseSettings;
