import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';
import { AuditLogPane } from '@folio/stripes-acq-components';

import { DataContext } from '../../contexts';

import { useInstanceAuditDataQuery } from '../../hooks';
import { getDateWithTime } from '../../utils';

const InstanceVersionHistory = ({
  instanceId,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const { data, isLoading } = useInstanceAuditDataQuery(instanceId);
  const referenceData = useContext(DataContext);

  const fieldLabelsMap = {
    administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    alternativeTitles: formatMessage({ id: 'ui-inventory.alternativeTitles' }),
    catalogedDate: formatMessage({ id: 'ui-inventory.catalogedDate' }),
    childInstances: formatMessage({ id: 'ui-inventory.childInstances' }),
    classifications: formatMessage({ id: 'ui-inventory.classifications' }),
    contributors: formatMessage({ id: 'ui-inventory.contributors' }),
    date1: formatMessage({ id: 'ui-inventory.date1' }),
    date2: formatMessage({ id: 'ui-inventory.date2' }),
    dateTypeId: formatMessage({ id: 'ui-inventory.dateType' }),
    deleted: formatMessage({ id: 'ui-inventory.setForDeletion' }),
    discoverySuppress: formatMessage({ id: 'ui-inventory.discoverySuppressed' }),
    editions: formatMessage({ id: 'ui-inventory.edition' }),
    electronicAccess: formatMessage({ id: 'ui-inventory.electronicAccess' }),
    hrid: formatMessage({ id: 'ui-inventory.instanceHrid' }),
    identifiers: formatMessage({ id: 'ui-inventory.identifiers' }),
    instanceFormatIds: formatMessage({ id: 'ui-inventory.instanceFormats' }),
    instanceTypeId: formatMessage({ id: 'ui-inventory.resourceType' }),
    indexTitle: formatMessage({ id: 'ui-inventory.indexTitle' }),
    languages: formatMessage({ id: 'ui-inventory.languages' }),
    modeOfIssuanceId: formatMessage({ id: 'ui-inventory.modeOfIssuance' }),
    natureOfContentTermIds: formatMessage({ id: 'ui-inventory.natureOfContentTerms' }),
    notes: formatMessage({ id: 'ui-inventory.instanceNotes' }),
    parentInstances: formatMessage({ id: 'ui-inventory.parentInstances' }),
    physicalDescriptions: formatMessage({ id: 'ui-inventory.physicalDescriptions' }),
    precedingTitles: formatMessage({ id: 'ui-inventory.precedingTitles' }),
    previouslyHeld: formatMessage({ id: 'ui-inventory.previouslyHeld' }),
    publication: formatMessage({ id: 'ui-inventory.publications' }),
    publicationFrequency: formatMessage({ id: 'ui-inventory.publicationFrequency' }),
    publicationRange: formatMessage({ id: 'ui-inventory.publicationRange' }),
    series: formatMessage({ id: 'ui-inventory.seriesStatements' }),
    source: formatMessage({ id: 'ui-inventory.source' }),
    staffSuppress: formatMessage({ id: 'ui-inventory.staffSuppressed' }),
    statisticalCodeIds: formatMessage({ id: 'ui-inventory.statisticalCodes' }),
    statusId: formatMessage({ id: 'ui-inventory.instanceStatus' }),
    statusUpdatedDate: formatMessage({ id: 'ui-inventory.instanceStatusUpdatedDate' }),
    subjects: formatMessage({ id: 'ui-inventory.subjects' }),
    succeedingTitles: formatMessage({ id: 'ui-inventory.succeedingTitles' }),
    tagList: formatMessage({ id: 'stripes-smart-components.tags' }),
    title: formatMessage({ id: 'ui-inventory.instances.columns.title' }),
  };
  const fieldFormatter = {
    alternativeTitleTypeId: value => referenceData.alternativeTitleTypes?.find(type => type.id === value)?.name,
    classificationTypeId: value => referenceData.classificationTypes?.find(type => type.id === value)?.name,
    contributorNameTypeId: value => referenceData.contributorNameTypes?.find(contributor => contributor.id === value)?.name,
    contributorTypeId: value => referenceData.contributorTypes?.find(contributor => contributor.id === value)?.name,
    contributorTypeText: value => value || <NoValue />,
    dateTypeId: value => referenceData.instanceDateTypes?.find(type => type.id === value)?.name,
    identifierTypeId: value => referenceData.identifierTypes?.find(type => type.id === value)?.name,
    instanceFormatIds: value => referenceData.instanceFormats?.find(format => format.id === value)?.name,
    instanceNoteTypeId: value => referenceData.instanceNoteTypes?.find(note => note.id === value)?.name,
    instanceTypeId: value => referenceData.instanceTypes?.find(type => type.id === value)?.name,
    modeOfIssuanceId: value => referenceData.modesOfIssuance?.find(mode => mode.id === value)?.name,
    natureOfContentTermIds: value => referenceData.natureOfContentTerms?.find(term => term.id === value)?.name,
    primary: value => value.toString(),
    relationshipId: value => referenceData.electronicAccessRelationships?.find(rel => rel.id === value)?.name,
    sourceId: value => referenceData.subjectSources?.find(source => source.id === value)?.name,
    staffOnly: value => value.toString(),
    statisticalCodeIds: value => referenceData.statisticalCodes?.find(code => code.id === value)?.name,
    statusId: value => referenceData.instanceStatuses?.find(status => status.id === value)?.name,
    statusUpdatedDate: value => getDateWithTime(value),
    typeId: value => referenceData.subjectTypes?.find(type => type.id === value)?.name,
    uri: value => value || <NoValue />,
  };


  return (
    <AuditLogPane
      onClose={onClose}
      isLoading={isLoading}
      versions={data}
      fieldLabelsMap={fieldLabelsMap}
      fieldFormatter={fieldFormatter}
    />
  );
};

InstanceVersionHistory.propTypes = {
  instanceId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default InstanceVersionHistory;
