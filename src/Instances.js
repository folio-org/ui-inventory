import React from 'react';
import PropTypes from 'prop-types';
import {
  omit,
  keyBy,
  get,
  template,
} from 'lodash';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import {
  stripesShape,
  AppIcon,
} from '@folio/stripes/core';
import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';

import packageInfo from '../package';
import InstanceForm from './edit/InstanceForm';
import ViewInstance from './ViewInstance';
import formatters from './referenceFormatters';
import withLocation from './withLocation';
import { parseStrToFilters, parseFiltersToStr } from './utils';
import Filters from './Filters';
import { searchableIndexes, filterConfig } from './constants';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const emptyObj = {};
const emptyArr = [];

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

              queryTemplate = template(searchableIndex.queryTemplate)({ identifierTypeId });
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
    this.copyInstance = this.copyInstance.bind(this);

    this.state = {};
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.updateLocation({ qindex });
  }

  onFilterChangeHandler = ({ name, values }) => {
    const { resources: { query } } = this.props;
    const curFilters = parseStrToFilters(get(query, 'filters', ''));
    const filters = values.length
      ? { ...curFilters, [name]: values }
      : omit(curFilters, name);
    const filtersStr = parseFiltersToStr(filters);
    this.props.updateLocation({ filters: filtersStr });
  };

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    this.props.updateLocation({ layer: null });
  }

  copyInstance(instance) {
    this.setState({ copiedInstance: omit(instance, ['id', 'hrid']) });
    this.props.updateLocation({ layer: 'create' });
  }

  createInstance = (instance) => {
    // POST item record
    this.props.mutator.records.POST(instance).then(() => {
      this.closeNewInstance();
    });
  }

  renderFilters = (onChange) => {
    const { resources: { locations, instanceTypes, query } } = this.props;

    return (
      <Filters
        activeFilters={parseStrToFilters(get(query, 'filters', ''))}
        data={{
          locations: get(locations, 'records', []),
          resourceTypes: get(instanceTypes, 'records', []),
        }}
        onChange={onChange}
      />
    );
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
      || !resources.instanceNoteTypes || !resources.instanceNoteTypes.hasLoaded
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
    const instanceNoteTypes = resources.instanceNoteTypes.records;
    const statisticalCodeTypes = (resources.statisticalCodeTypes || emptyObj).records || emptyArr;
    const statisticalCodes = (resources.statisticalCodes || emptyObj).records || emptyArr;
    const illPolicies = (resources.illPolicies || emptyObj).records || emptyArr;
    const holdingsTypes = (resources.holdingsTypes || emptyObj).records || emptyArr;
    const callNumberTypes = (resources.callNumberTypes || emptyObj).records || emptyArr;
    const holdingsNoteTypes = (resources.holdingsNoteTypes || emptyObj).records || emptyArr;
    const locations = (resources.locations || emptyObj).records || emptyArr;
    const locationsById = keyBy(locations, 'id');

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
      instanceNoteTypes,
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
          selectedIndex={get(this.props.resources.query, 'qindex')}
          searchableIndexesPlaceholder={null}
          onChangeIndex={this.onChangeIndex}
          // filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordComponent={ViewInstance}
          editRecordComponent={InstanceForm}
          newRecordInitialValues={(this.state && this.state.copiedInstance) ? this.state.copiedInstance : {
            discoverySuppress: false,
            staffSuppress: false,
            previouslyHeld: false,
            source: 'FOLIO'
          }}
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
          renderFilters={this.renderFilters}
          onFilterChange={this.onFilterChangeHandler}
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
