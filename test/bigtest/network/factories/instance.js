import { faker } from '@bigtest/mirage';

import Factory from './application';

const { lorem, name } = faker;

export default Factory.extend({
  title: () => lorem.sentence(),
  contributors: () => [{ name: `${name.lastName()}, ${name.firstName()}` }],
  source: () => 'local',
  identifiers: () => [],
  publication: () => [],
  alternativeTitles: () => [],
  series: () => [],
  physicalDescriptions: () => [],
  languages: () => [],
  notes: () => [],
  electronicAccess: () => [],
  subjects: () => [],
  classifications: () => [],
  childInstances: () => [],
  parentInstances: () => [],

  afterCreate(instance, server) {
    instance.identifiers.forEach(identifier => {
      let { identifierTypeId } = identifier;
      if (!identifierTypeId) {
        let [issn] = server.db.identifierTypes.where({ name: 'issn' });
        if (!issn) {
          issn = server.create('identifier-type', { name: 'issn' });
        }
        identifierTypeId = issn.id;
      }
      identifier.identifierTypeId = identifierTypeId;
    });
    instance.contributors.forEach(contributor => {
      let { contributorNameTypeId } = contributor;
      if (!contributorNameTypeId) {
        let [type] = server.db.contributorNameTypes.where({ name: 'Personal name' });
        if (!type) {
          type = server.create('contributor-name-type', { name: 'Personal name' });
        }
        contributorNameTypeId = type.id;
      }
      contributor.contributorNameTypeId = contributorNameTypeId;
    });

    const holding = server.create('holding');
    instance.holdings = [holding];
    instance.save();
  }
});
