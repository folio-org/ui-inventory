import {
  values,
  pick,
} from 'lodash';

import {
  areAllFieldsEmpty,
} from '../../utils';

export const getPublishingInfo = instance => {
  const publication = instance.publication && instance.publication[0];

  if (publication) {
    const publisherStr = publication.publisher ? ` • ${publication.publisher}` : '';
    const publishDateStr = publication.dateOfPublication ? ` • ${publication.dateOfPublication}` : '';

    return `${publisherStr}${publishDateStr}`;
  }

  return undefined;
};

export const getAccordionState = (instance = {}, accordions = {}) => {
  const instanceData = pick(
    instance,
    ['hrid', 'source', 'catalogedDate', 'statusId', 'statusUpdatedDate', 'modeOfIssuanceId', 'statisticalCodeIds'],
  );

  const titleData = pick(
    instance,
    ['title', 'alternativeTitles', 'indexTitle', 'series'],
  );

  const descriptiveData = pick(
    instance,
    [
      'publication', 'editions', 'physicalDescriptions', 'instanceTypeId',
      'natureOfContentTermIds', 'instanceFormatIds', 'languages',
      'publicationFrequency', 'publicationRange',
    ],
  );

  const instanceRelationship = pick(
    instance,
    ['childInstances', 'parentInstances'],
  );

  return ({
    [accordions.administrative]: !areAllFieldsEmpty(values(instanceData)),
    [accordions.title]: !areAllFieldsEmpty(values(titleData)),
    [accordions.identifiers]: !areAllFieldsEmpty([instance?.identifiers ?? []]),
    [accordions.contributors]: !areAllFieldsEmpty([instance?.contributors ?? []]),
    [accordions.descriptiveData]: !areAllFieldsEmpty(values(descriptiveData)),
    [accordions.notes]: !areAllFieldsEmpty([instance?.notes ?? []]),
    [accordions.electronicAccess]: !areAllFieldsEmpty([instance?.electronicAccess ?? []]),
    [accordions.subjects]: !areAllFieldsEmpty([instance?.subjects ?? []]),
    [accordions.classifications]: !areAllFieldsEmpty([instance?.classifications ?? []]),
    [accordions.relationship]: !areAllFieldsEmpty(values(instanceRelationship)),
  });
};
