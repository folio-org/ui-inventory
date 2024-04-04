import React, {
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
  List,
  LoadingPane,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import {
  useClassificationIdentifierTypes,
  useUserTenantPermissions,
} from '../../hooks';
import getFieldComponents from './getFieldComponents';
import { OKAPI_TENANT_HEADER } from '../../constants';
import { CLASSIFICATION_BROWSE_COLUMNS } from './constants';

const ClassificationBrowseSettings = () => {
  const stripes = useStripes();
  const intl = useIntl();
  const { classificationTypes, isLoading: isClassificationTypesLoading } = useClassificationIdentifierTypes();
  const ConnectedControlledVocab = useMemo(() => stripes.connect(ControlledVocab), [stripes]);

  const userId = stripes?.user?.user?.id;
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const {
    userPermissions: centralTenantPermissions,
    isFetching: isCentralTenantPermissionsLoading,
  } = useUserTenantPermissions({
    userId,
    tenantId: centralTenantId,
  });

  const permission = 'ui-inventory.settings.classification-browse';
  const hasCentralTenantPerm = centralTenantPermissions.some(({ permissionName }) => permissionName === permission);
  const hasRequiredPermissions = stripes.hasInterface('consortia')
    ? (hasCentralTenantPerm && stripes.hasPerm(permission))
    : stripes.hasPerm(permission);

  const fieldLabels = {
    [CLASSIFICATION_BROWSE_COLUMNS.ID]: intl.formatMessage({ id: 'ui-inventory.name' }),
    [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: intl.formatMessage({ id: 'ui-inventory.classificationIdentifierTypes' }),
  };

  const columnMapping = useMemo(() => ({
    [CLASSIFICATION_BROWSE_COLUMNS.ID]: fieldLabels[CLASSIFICATION_BROWSE_COLUMNS.ID],
    [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: (
      <>
        {fieldLabels[CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]}
        <InfoPopover
          content={intl.formatMessage({ id: 'ui-inventory.settings.instanceClassification.identifierTypesPopover' })}
        />
      </>
    ),
  }));

  const classificationIdentifierTypes = useMemo(() => classificationTypes.map(type => ({
    id: type.id,
    label: type.name,
  })), [classificationTypes]);

  const formatRowData = useCallback((classificationType) => {
    const classificationIdentifierType = classificationType[CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]
      ?.map(id => classificationIdentifierTypes.find(type => type.id === id));

    return {
      ...classificationType,
      name: intl.formatMessage({ id: `ui-inventory.settings.instanceClassification.${classificationType.id}`}),
      [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: classificationIdentifierType,
    };
  }, [classificationIdentifierTypes]);

  const formatItemForSaving = useCallback((item) => ({
    [CLASSIFICATION_BROWSE_COLUMNS.ID]: item[CLASSIFICATION_BROWSE_COLUMNS.ID],
    [CLASSIFICATION_BROWSE_COLUMNS.SHELVING_ALGORITHM]: item[CLASSIFICATION_BROWSE_COLUMNS.SHELVING_ALGORITHM],
    [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: item[CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS].map(type => type.id),
  }), []);

  const renderClasificationTypes = (types = []) => (
    <List
      items={types}
      itemFormatter={type => <li>{type?.label}</li>}
      listStyle="bullets"
      marginBottom0
    />
  );

  // by default OkapiResource uses Accept: text/plain for PUT request. /browse/config/instance-classification however requiers application/json
  const optionsForUpdate = useMemo(() => ({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      [OKAPI_TENANT_HEADER]: stripes.okapi.tenant,
    },
  }));

  if (!hasRequiredPermissions) {
    return null;
  }

  if (isCentralTenantPermissionsLoading || isClassificationTypesLoading) {
    console.log(isCentralTenantPermissionsLoading, isClassificationTypesLoading);
    return <LoadingPane />;
  }

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
      record={intl.formatMessage({ id: 'ui-inventory.classificationIdentifierTypes' })}
    >
      <ConnectedControlledVocab
        stripes={stripes}
        baseUrl="browse/config/instance-classification"
        records="configs"
        label={<FormattedMessage id="ui-inventory.classificationBrowse" />}
        labelSingular={intl.formatMessage({ id: 'ui-inventory.name' })}
        visibleFields={[CLASSIFICATION_BROWSE_COLUMNS.NAME, CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]}
        columnMapping={columnMapping}
        hiddenFields={[CLASSIFICATION_BROWSE_COLUMNS.SHELVING_ALGORITHM, 'lastUpdated', 'numberOfObjects']}
        formatter={{
          [CLASSIFICATION_BROWSE_COLUMNS.TYPE_IDS]: ({ typeIds }) => renderClasificationTypes(typeIds),
        }}
        readOnlyFields={[CLASSIFICATION_BROWSE_COLUMNS.NAME]}
        nameKey="name"
        formType="final-form"
        id="classification-browse"
        preUpdateHook={formatItemForSaving}
        editable
        fieldComponents={getFieldComponents(fieldLabels, classificationIdentifierTypes)}
        canCreate={false}
        parseRow={formatRowData}
        optionsForUpdate={optionsForUpdate}
        actionSuppressor={{
          delete: () => true,
          edit: () => false,
        }}
        translations={{
          termUpdated: 'ui-inventory.settings.instanceClassification.termUpdated'
        }}
        hideCreateButton
      />
    </TitleManager>
  );
};

export default ClassificationBrowseSettings;
