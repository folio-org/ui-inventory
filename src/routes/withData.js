import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  keyBy,
} from 'lodash';

const dataManifest = {
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
  loanTypes: {
    type: 'okapi',
    path: 'loan-types',
    params: {
      query: 'cql.allRecords=1 sortby name',
      limit: '1000',
    },
    records: 'loantypes',
  },
};

// HOC used to reuse data dictionaries
const withData = WrappedComponent => class WithDataComponent extends React.Component {
  static manifest = Object.freeze(Object.assign({}, dataManifest, WrappedComponent.manifest));

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
  };

  isLoading = () => {
    const { resources } = this.props;

    for (const key in dataManifest) {
      if (dataManifest[key].type === 'okapi' &&
        !(resources[key] && resources[key].hasLoaded)) {
        return true;
      }
    }

    return false;
  }

  getData = () => {
    const { resources } = this.props;
    const data = {};

    for (const key in dataManifest) {
      if (dataManifest[key].type === 'okapi') {
        data[key] = get(resources, `${key}.records`, []);
      }
    }

    data.locationsById = keyBy(data.locations, 'id');
    data.identifierTypesById = keyBy(data.identifierTypes, 'id');
    data.identifierTypesByName = keyBy(data.identifierTypes, 'name');

    data.query = resources.query;

    return data;
  }

  render() {
    return (<WrappedComponent
      getData={this.getData}
      isLoading={this.isLoading}
      {...this.props}
    />);
  }
};


export default withData;
