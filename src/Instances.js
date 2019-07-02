import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';

import {
  stripesShape,
  AppIcon,
} from '@folio/stripes/core'; // eslint-disable-line import/no-unresolved
import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { onChangeFilter as commonChangeFilter } from '@folio/stripes/components';

import packageInfo from '../package';
import InstanceForm from './edit/InstanceForm';
import ViewInstance from './ViewInstance';
import formatters from './referenceFormatters';
import withLocation from './withLocation';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const emptyObj = {};
const emptyArr = [];

const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fre', name: 'French' },
  { code: 'ger', name: 'German' },
  { code: 'chi', name: 'Mandarin' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' },
];

// the empty 'values' properties will be filled in by componentWillUpdate
// as those are pulled from the backend
const filterConfig = [
  {
    label: <FormattedMessage id="ui-inventory.instances.resourceType" />,
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.language" />,
    name: 'language',
    cql: 'languages',
    values: languages.map(rec => ({ name: rec.name, cql: rec.code })),
  },
  {
    label: <FormattedMessage id="ui-inventory.instances.location" />,
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
];

const searchableIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'title="%{query.query}" or contributors adj "\\"name\\": \\"%{query.query}\\"" or identifiers adj "\\"value\\": \\"%{query.query}\\""' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title="%{query.query}"' },
  { label: 'ui-inventory.identifier', value: 'identifier', queryTemplate: 'identifiers adj "\\"value\\": \\"%{query.query}\\""' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers == "*\\"value\\": \\"%{query.query}\\", \\"identifierTypeId\\": \\"<%= identifierTypeId %>\\""' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers == "*\\"value\\": \\"%{query.query}\\", \\"identifierTypeId\\": \\"<%= identifierTypeId %>\\""' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors adj "\\"name\\": \\"%{query.query}\\""' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
];

class Instances extends React.Component {
  static defaultProps = {
    browseOnly: false,
    showSingleResult: true,
  }

  static manifest = Object.freeze({
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'instances',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'inventory/instances',
      GET: {
        params: {
          query: (...args) => {
            const [
              queryParams,
              pathComponents,
              resourceData,
              logger
            ] = args;
            const queryIndex = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === queryIndex);
            let queryTemplate = '';

            if (queryIndex === 'isbn' || queryIndex === 'issn') {
              const identifierType = resourceData.identifier_types.records.find(type => type.name.toLowerCase() === queryIndex);
              const identifierTypeId = identifierType ? identifierType.id : 'identifier-type-not-found';

              queryTemplate = _.template(searchableIndex.queryTemplate)({ identifierTypeId });
            } else {
              queryTemplate = searchableIndex.queryTemplate;
            }

            resourceData.query = { ...resourceData.query, qindex: '' };

            return makeQueryFunction(
              'cql.allRecords=1',
              queryTemplate,
              {
                Title: 'title',
                publishers: 'publication',
                Contributors: 'contributors',
              },
              filterConfig,
              2
            )(queryParams, pathComponents, resourceData, logger);
          }
        },
        staticFallback: { params: {} },
      },
    },
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
      path: 'statistical-codes?limit=1000&query=cql.allRecords=1 sortby name',
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

  });

  constructor(props) {
    super(props);

    this.cViewInstance = this.props.stripes.connect(ViewInstance);
    this.resultsList = null;
    this.SRStatus = null;

    this.onChangeFilter = commonChangeFilter.bind(this);
    this.copyInstance = this.copyInstance.bind(this);

    this.state = {};
  }

  /**
   * fill in the filter values
   */
  static getDerivedStateFromProps(props) {
    // resource types
    const rt = (props.resources.instanceTypes || {}).records || [];
    if (rt.length) {
      const oldValuesLength = filterConfig[0].values.length;
      filterConfig[0].values = rt.map(rec => ({ name: rec.name, cql: rec.id }));
      if (oldValuesLength === 0) {
        const numFiltersLoaded = props.resources.numFiltersLoaded;
        props.mutator.numFiltersLoaded.replace(numFiltersLoaded + 1); // triggers refresh of records
      }
    }

    // locations
    const locations = (props.resources.locations || {}).records || [];
    if (locations.length) {
      const oldValuesLength = filterConfig[2].values.length;
      filterConfig[2].values = locations.map(rec => ({ name: rec.name, cql: rec.id }));
      if (oldValuesLength === 0) {
        const numFiltersLoaded = props.resources.numFiltersLoaded;
        props.mutator.numFiltersLoaded.replace(numFiltersLoaded + 1); // triggers refresh of records
      }
    }

    return null;
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.updateLocation({ qindex });
  }

  updateFilters(prevFilters) { // provided for onChangeFilter
    const filters = Object.keys(prevFilters).filter(key => filters[key]).join(',');
    this.props.updateLocation({ filters });
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    this.props.updateLocation({ layer: null });
  }

  copyInstance(instance) {
    this.setState({ copiedInstance: _.omit(instance, ['id', 'hrid']) });
    this.props.updateLocation({ layer: 'create' });
  }

  createInstance = (instance) => {
    // POST item record
    this.props.mutator.records.POST(instance).then(() => {
      this.closeNewInstance();
    });
  }

  render() {
    const {
      resources,
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      visibleColumns,
      intl,
    } = this.props;

    if (!resources.contributorTypes || !resources.contributorTypes.hasLoaded
      || !resources.contributorNameTypes || !resources.contributorNameTypes.hasLoaded
      || !resources.identifierTypes || !resources.identifierTypes.hasLoaded
      || !resources.classificationTypes || !resources.classificationTypes.hasLoaded
      || !resources.instanceTypes || !resources.instanceTypes.hasLoaded
      || !resources.instanceFormats || !resources.instanceFormats.hasLoaded
      || !resources.alternativeTitleTypes || !resources.alternativeTitleTypes.hasLoaded
      || !resources.locations || !resources.locations.hasLoaded
      || !resources.instanceRelationshipTypes || !resources.instanceRelationshipTypes.hasLoaded
      || !resources.instanceStatuses || !resources.instanceStatuses.hasLoaded
      || !resources.modesOfIssuance || !resources.modesOfIssuance.hasLoaded
      || !resources.electronicAccessRelationships || !resources.electronicAccessRelationships.hasLoaded
      || !resources.statisticalCodeTypes || !resources.statisticalCodeTypes.hasLoaded
      || !resources.statisticalCodes || !resources.statisticalCodes.hasLoaded
      || !resources.illPolicies || !resources.illPolicies.hasLoaded
      || !resources.holdingsTypes || !resources.holdingsTypes.hasLoaded
      || !resources.callNumberTypes || !resources.callNumberTypes.hasLoaded
      || !resources.holdingsNoteTypes || !resources.holdingsNoteTypes.hasLoaded
    ) return null;

    const contributorTypes = (resources.contributorTypes || emptyObj).records || emptyArr;
    const contributorNameTypes = (resources.contributorNameTypes || emptyObj).records || emptyArr;
    const instanceRelationshipTypes = (resources.instanceRelationshipTypes || emptyObj).records || emptyArr;
    const identifierTypes = (resources.identifierTypes || emptyObj).records || emptyArr;
    const classificationTypes = (resources.classificationTypes || emptyObj).records || emptyArr;
    const instanceTypes = (resources.instanceTypes || emptyObj).records || emptyArr;
    const instanceFormats = (resources.instanceFormats || emptyObj).records || emptyArr;
    const alternativeTitleTypes = (resources.alternativeTitleTypes || emptyObj).records || emptyArr;
    const instanceStatuses = (resources.instanceStatuses || emptyObj).records || emptyArr;
    const modesOfIssuance = (resources.modesOfIssuance || emptyObj).records || emptyArr;
    const electronicAccessRelationships = (resources.electronicAccessRelationships || emptyObj).records || emptyArr;
    const statisticalCodeTypes = (resources.statisticalCodeTypes || emptyObj).records || emptyArr;
    const statisticalCodes = (resources.statisticalCodes || emptyObj).records || emptyArr;
    const illPolicies = (resources.illPolicies || emptyObj).records || emptyArr;
    const holdingsTypes = (resources.holdingsTypes || emptyObj).records || emptyArr;
    const callNumberTypes = (resources.callNumberTypes || emptyObj).records || emptyArr;
    const holdingsNoteTypes = (resources.holdingsNoteTypes || emptyObj).records || emptyArr;
    const locations = (resources.locations || emptyObj).records || emptyArr;
    const locationsById = _.keyBy(locations, 'id');

    const referenceTables = {
      contributorTypes,
      contributorNameTypes,
      instanceRelationshipTypes,
      identifierTypes,
      classificationTypes,
      instanceTypes,
      instanceFormats,
      alternativeTitleTypes,
      instanceStatuses,
      modesOfIssuance,
      electronicAccessRelationships,
      statisticalCodeTypes,
      statisticalCodes,
      illPolicies,
      holdingsTypes,
      callNumberTypes,
      holdingsNoteTypes,
      locationsById,
    };

    const resultsFormatter = {
      'title': ({ title }) => (
        <AppIcon
          size="small"
          app="inventory"
          iconKey="instance"
        >
          {title}
        </AppIcon>
      ),
      'relation': r => formatters.relationsFormatter(r, instanceRelationshipTypes),
      'publishers': r => r.publication.map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      'contributors': r => formatters.contributorsFormatter(r, contributorTypes),
    };

    const formattedSearchableIndexes = searchableIndexes.map(index => {
      const { prefix = '' } = index;
      const label = prefix + intl.formatMessage({ id: index.label });

      return { ...index, label };
    });

    return (
      <div data-test-inventory-instances>
        <SearchAndSort
          packageInfo={packageInfo}
          objectName="inventory"
          maxSortKeys={1}
          searchableIndexes={formattedSearchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          searchableIndexesPlaceholder={null}
          onChangeIndex={this.onChangeIndex}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordComponent={ViewInstance}
          editRecordComponent={InstanceForm}
          newRecordInitialValues={(this.state && this.state.copiedInstance) ? this.state.copiedInstance : { source: 'FOLIO' }}
          visibleColumns={visibleColumns || ['title', 'contributors', 'publishers', 'relation']}
          columnMapping={{
            title: intl.formatMessage({ id: 'ui-inventory.instances.columns.title' }),
            contributors: intl.formatMessage({ id: 'ui-inventory.instances.columns.contributors' }),
            publishers: intl.formatMessage({ id: 'ui-inventory.instances.columns.publishers' }),
            relation: intl.formatMessage({ id: 'ui-inventory.instances.columns.relation' }),
          }}
          columnWidths={{ title: '40%' }}
          resultsFormatter={resultsFormatter}
          onCreate={this.createInstance}
          viewRecordPerms="inventory-storage.instances.item.get"
          newRecordPerms="inventory-storage.instances.item.post"
          disableRecordCreation={disableRecordCreation || false}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          detailProps={{ referenceTables, onCopy: this.copyInstance }}
          path={`${this.props.match.path}/(view|viewsource)/:id/:holdingsrecordid?/:itemid?`}
          showSingleResult={showSingleResult}
          browseOnly={browseOnly}
          onSelectRow={onSelectRow}
        />
      </div>);
  }
}

Instances.propTypes = {
  stripes: stripesShape.isRequired,
  resources: PropTypes.shape({
    records: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      other: PropTypes.shape({
        totalRecords: PropTypes.number,
        total_records: PropTypes.number,
      }),
      successfulMutations: PropTypes.arrayOf(
        PropTypes.shape({
          record: PropTypes.shape({
            id: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }),
    numFiltersLoaded: PropTypes.number,
    resultCount: PropTypes.number,
    instanceTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    query: PropTypes.shape({
      qindex: PropTypes.string,
      term: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    addInstanceMode: PropTypes.shape({
      replace: PropTypes.func,
    }),
    numFiltersLoaded: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    records: PropTypes.shape({
      POST: PropTypes.func,
    }),
    resultCount: PropTypes.shape({
      replace: PropTypes.func,
    }),
    query: PropTypes.shape({
      update: PropTypes.func,
    }),
  }).isRequired,
  showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  browseOnly: PropTypes.bool,
  disableRecordCreation: PropTypes.bool,
  onSelectRow: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  updateLocation: PropTypes.func.isRequired,
  intl: intlShape,
};

export default injectIntl(withLocation(Instances));
