import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  keyBy,
  map,
  concat,
  set,
  omit,
} from 'lodash';

import { psTitleRelationshipId } from '../utils';

const INITIAL_RESULT_COUNT = 100;

// HOC used to reuse instance manifest
const withData = WrappedComponent => class WithDataComponent extends React.Component {
  static manifest = Object.freeze(
    Object.assign({}, WrappedComponent.manifest, {
      numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
      query: {
        initialValue: {
          query: '',
          filters: '',
          sort: 'title',
        },
      },
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
      resultOffset: { initialValue: 0 },
      identifierTypes: {
        type: 'okapi',
        records: 'identifierTypes',
        path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      contributorTypes: {
        type: 'okapi',
        records: 'contributorTypes',
        path: 'contributor-types?limit=400&query=cql.allRecords=1 sortby name',
      },
      contributorNameTypes: {
        type: 'okapi',
        records: 'contributorNameTypes',
        path: 'contributor-name-types?limit=1000&query=cql.allRecords=1 sortby ordering',
      },
      instanceFormats: {
        type: 'okapi',
        records: 'instanceFormats',
        path: 'instance-formats?limit=1000&query=cql.allRecords=1 sortby name',
      },
      instanceTypes: {
        type: 'okapi',
        records: 'instanceTypes',
        path: 'instance-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      classificationTypes: {
        type: 'okapi',
        records: 'classificationTypes',
        path: 'classification-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      alternativeTitleTypes: {
        type: 'okapi',
        records: 'alternativeTitleTypes',
        path: 'alternative-title-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      locations: {
        type: 'okapi',
        records: 'locations',
        path: 'locations?limit=1000&query=cql.allRecords=1 sortby name',
      },
      instanceRelationshipTypes: {
        type: 'okapi',
        records: 'instanceRelationshipTypes',
        path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      instanceStatuses: {
        type: 'okapi',
        records: 'instanceStatuses',
        path: 'instance-statuses?limit=1000&query=cql.allRecords=1 sortby name',
      },
      modesOfIssuance: {
        type: 'okapi',
        records: 'issuanceModes',
        path: 'modes-of-issuance?limit=1000&query=cql.allRecords=1 sortby name',
      },
      instanceNoteTypes: {
        type: 'okapi',
        path: 'instance-note-types',
        params: {
          query: 'cql.allRecords=1 sortby name',
          limit: '1000',
        },
        records: 'instanceNoteTypes',
      },
      electronicAccessRelationships: {
        type: 'okapi',
        records: 'electronicAccessRelationships',
        path: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name',
      },
      statisticalCodeTypes: {
        type: 'okapi',
        records: 'statisticalCodeTypes',
        path: 'statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
      },
      statisticalCodes: {
        type: 'okapi',
        records: 'statisticalCodes',
        path: 'statistical-codes?limit=2000&query=cql.allRecords=1 sortby name',
      },
      illPolicies: {
        type: 'okapi',
        path: 'ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'illPolicies',
      },
      holdingsTypes: {
        type: 'okapi',
        path: 'holdings-types?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'holdingsTypes',
      },
      callNumberTypes: {
        type: 'okapi',
        path: 'call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'callNumberTypes',
      },
      holdingsNoteTypes: {
        type: 'okapi',
        path: 'holdings-note-types?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'holdingsNoteTypes',
      },
      itemNoteTypes: {
        type: 'okapi',
        path: 'item-note-types',
        params: {
          query: 'cql.allRecords=1 sortby name',
          limit: '1000',
        },
        records: 'itemNoteTypes',
      },
      itemDamagedStatuses: {
        type: 'okapi',
        path: 'item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'itemDamageStatuses',
      },
      natureOfContentTerms: {
        type: 'okapi',
        path: 'nature-of-content-terms?limit=1000&query=cql.allRecords=1 sortby name',
        records: 'natureOfContentTerms',
      },
      materialTypes: {
        type: 'okapi',
        path: 'material-types',
        params: {
          query: 'cql.allRecords=1 sortby name',
          limit: '1000',
        },
        records: 'mtypes',
      },
      itemsInTransitReport: {
        type: 'okapi',
        records: 'items',
        path: 'inventory-reports/items-in-transit',
        accumulate: true,
        fetch: false,
      },
    }),
  );

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
  };

  createInstance = (instance) => {
    // Massage record to add preceeding and succeeding title fields in the
    // right place.
    const instanceCopy = this.combineRelTitles(instance);

    // POST item record
    return this.props.mutator.records.POST(instanceCopy);
  };

  combineRelTitles = (instance) => {
    // preceding/succeeding titles are stored in parentInstances and childInstances
    // in the instance record. Each title needs to provide an instance relationship
    // type ID corresponding to 'preceeding-succeeding' in addition to the actual
    // parent/child instance ID.
    let instanceCopy = instance;
    const titleRelationshipTypeId = psTitleRelationshipId(this.props.resources.instanceRelationshipTypes.records);
    const precedingTitles = map(instanceCopy.precedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'parentInstances', concat(instanceCopy.parentInstances, precedingTitles));
    const succeedingTitles = map(instanceCopy.succeedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'childInstances', succeedingTitles);
    instanceCopy = omit(instanceCopy, ['precedingTitles', 'succeedingTitles']);

    return instanceCopy;
  }

  isLoading = () => {
    const { manifest } = WithDataComponent;
    const { resources } = this.props;

    for (const key in manifest) {
      if (!['records', 'itemsInTransitReport', 'recordsToExportIDs'].includes(key) && manifest[key].type === 'okapi' &&
        !(resources[key] && resources[key].hasLoaded)) {
        return true;
      }
    }

    return false;
  }

  getData = () => {
    const { manifest } = WithDataComponent;
    const { resources } = this.props;
    const data = {};

    for (const key in manifest) {
      if (!['records', 'itemsInTransitReport', 'recordsToExportIDs'].includes(key) && manifest[key].type === 'okapi') {
        data[key] = get(resources, `${key}.records`, []);
      }
    }

    data.locationsById = keyBy(data.locations, 'id');
    data.query = resources.query;

    return data;
  }

  render() {
    return (<WrappedComponent
      getData={this.getData}
      isLoading={this.isLoading}
      createInstance={this.createInstance}
      {...this.props}
    />);
  }
};


export default withData;
