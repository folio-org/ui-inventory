import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  omit,
  get,
  set,
  flowRight,
  isEmpty,
  noop,
} from 'lodash';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';

import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  Button,
  Icon
} from '@folio/stripes/components';

import FilterNavigation from '../FilterNavigation';
import packageInfo from '../../../package';
import InstanceForm from '../../edit/InstanceForm';
import ViewInstance from '../../ViewInstance';
import formatters from '../../referenceFormatters';
import withLocation from '../../withLocation';
import {
  getCurrentFilters,
  parseFiltersToStr,
  marshalInstance,
} from '../../utils';
import {
  InTransitItemReport,
  InstancesIdReport,
  exportStringToCSV,
} from '../../reports';
import ErrorModal from '../ErrorModal';
import { buildQuery } from '../../routes/buildManifestObject';

import css from './instances.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class InstancesView extends React.Component {
  static defaultProps = {
    browseOnly: false,
    showSingleResult: true,
  };

  static propTypes = {
    data: PropTypes.object,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    updateLocation: PropTypes.func.isRequired,
    segment: PropTypes.string,
    intl: intlShape,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
    }).isRequired,
    renderFilters: PropTypes.func.isRequired,
    searchableIndexes: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    inTransitItemsExportInProgress: false,
    instancesIdExportInProgress: false,
    showErrorModal: false,
  };

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.updateLocation({ qindex });
  };

  onFilterChangeHandler = ({ name, values }) => {
    const { data: { query } } = this.props;
    const curFilters = getCurrentFilters(get(query, 'filters', ''));
    const mergedFilters = values.length
      ? { ...curFilters, [name]: values }
      : omit(curFilters, name);
    const filtersStr = parseFiltersToStr(mergedFilters);

    this.props.updateLocation({ filters: filtersStr });
  };

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    this.props.updateLocation({ layer: null });
  };

  createInstance = (instance) => {
    const { data: { identifierTypesByName } } = this.props;

    // Massage record to add preceeding and succeeding title fields
    marshalInstance(instance, identifierTypesByName);

    // POST item record
    return this.props.parentMutator.records.POST(instance);
  };

  onCreate = (instance) => {
    this.createInstance(instance).then(() => this.closeNewInstance());
  }

  openCreateInstance = () => {
    this.props.updateLocation({ layer: 'create' });
  }

  copyInstance = (instance) => {
    let copiedInstance = omit(instance, ['id', 'hrid']);
    copiedInstance = set(copiedInstance, 'source', 'FOLIO');
    this.setState({ copiedInstance });
    this.openCreateInstance();
  }

  renderNavigation = () => (
    <FilterNavigation segment={this.props.segment} />
  );

  generateInTransitItemReport = async () => {
    const {
      reset,
      GET,
    } = this.props.parentMutator.itemsInTransitReport;

    try {
      reset();
      const items = await GET();

      if (!isEmpty(items)) {
        const report = new InTransitItemReport({ formatMessage: this.props.intl.formatMessage });
        report.toCSV(items);
      } else {
        this.setState({ showErrorModal: true });
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      this.setState({ inTransitItemsExportInProgress: false });
    }
  };

  startInTransitReportGeneration = () => {
    const { inTransitItemsExportInProgress } = this.state;

    if (inTransitItemsExportInProgress) {
      return;
    }

    this.setState({ inTransitItemsExportInProgress: true }, this.generateInTransitItemReport);
  };

  generateInstancesIdReport = async () => {
    const { instancesIdExportInProgress } = this.state;

    if (instancesIdExportInProgress) return;

    this.setState({ instancesIdExportInProgress: true }, async () => {
      const {
        reset,
        GET,
      } = this.props.parentMutator.recordsToExportIDs;

      try {
        reset();

        const items = await GET();
        const report = new InstancesIdReport();

        if (!isEmpty(items)) {
          report.toCSV(items);
        }
      } catch (error) {
        throw new Error(error);
      } finally {
        this.setState({ instancesIdExportInProgress: false });
      }
    });
  };

  generateCQLQueryReport = async () => {
    const { data } = this.props;

    const cqlQuery = buildQuery(data.query, {}, data, { log: noop }, this.props);

    exportStringToCSV(cqlQuery);
  }

  getActionItem = ({ id, icon, messageId, onClickHandler, isDisabled = false }) => {
    return (
      <Button
        buttonStyle="dropdownItem"
        id={id}
        disabled={isDisabled}
        onClick={onClickHandler}
      >
        <Icon
          icon={icon}
          size="medium"
          iconClassName={css.actionIcon}
        />
        <FormattedMessage id={messageId} />
      </Button>
    );
  }

  getActionMenu = ({ onToggle }) => {
    const { parentResources } = this.props;
    const isInstancesListEmpty = isEmpty(get(parentResources, ['records', 'records'], []));

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler();
      };
    };

    return (
      <Fragment>
        <IfPermission perm="ui-inventory.instance.create">
          <Button
            buttonStyle="dropdownItem"
            id="clickable-newinventory"
            onClick={buildOnClickHandler(this.openCreateInstance)}
          >
            <Icon
              icon="plus-sign"
              size="medium"
              iconClassName={css.actionIcon}
            />
            <FormattedMessage id="stripes-smart-components.new" />
          </Button>
        </IfPermission>

        {this.getActionItem({
          id: 'dropdown-clickable-get-report',
          icon: 'report',
          messageId: 'ui-inventory.inTransitReport',
          onClickHandler: buildOnClickHandler(this.startInTransitReportGeneration),
        })}
        {this.getActionItem({
          id: 'dropdown-clickable-get-items-uiids',
          icon: 'save',
          messageId: 'ui-inventory.saveInstancesUIIDS',
          onClickHandler: buildOnClickHandler(this.generateInstancesIdReport),
          isDisabled: isInstancesListEmpty,
        })}
        {this.getActionItem({
          id: 'dropdown-clickable-get-cql-query',
          icon: 'search',
          messageId: 'ui-inventory.saveInstancesCQLQuery',
          onClickHandler: buildOnClickHandler(this.generateCQLQueryReport),
          isDisabled: isInstancesListEmpty,
        })}
        {this.getActionItem({
          id: 'dropdown-clickable-export-marc',
          icon: 'download',
          messageId: 'ui-inventory.exportInstancesInMARC',
          onClickHandler: buildOnClickHandler(noop),
          isDisabled: true,
        })}
        {this.getActionItem({
          id: 'dropdown-clickable-export-json',
          icon: 'download',
          messageId: 'ui-inventory.exportInstancesInJSON',
          onClickHandler: buildOnClickHandler(noop),
          isDisabled: true,
        })}
      </Fragment>
    );
  };

  onErrorModalClose = () => {
    this.setState({ showErrorModal: false });
  };

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      visibleColumns,
      intl,
      data,
      parentResources,
      parentMutator,
      renderFilters,
      searchableIndexes,
      match: {
        path,
      }
    } = this.props;

    const resultsFormatter = {
      'title': ({ title }) => (
        <AppIcon
          size="small"
          app="inventory"
          iconKey="instance"
          iconAlignment="baseline"
        >
          {title}
        </AppIcon>
      ),
      'relation': r => formatters.relationsFormatter(r, data.instanceRelationshipTypes),
      'publishers': r => r.publication.map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      'contributors': r => formatters.contributorsFormatter(r, data.contributorTypes),
    };

    const formattedSearchableIndexes = searchableIndexes.map(index => {
      const { prefix = '' } = index;
      const label = prefix + intl.formatMessage({ id: index.label });

      return { ...index, label };
    });

    return (
      <React.Fragment>
        <div data-test-inventory-instances>
          <SearchAndSort
            actionMenu={this.getActionMenu}
            packageInfo={packageInfo}
            objectName="inventory"
            maxSortKeys={1}
            renderNavigation={this.renderNavigation}
            searchableIndexes={formattedSearchableIndexes}
            selectedIndex={get(data.query, 'qindex')}
            searchableIndexesPlaceholder={null}
            onChangeIndex={this.onChangeIndex}
            initialResultCount={INITIAL_RESULT_COUNT}
            resultCountIncrement={RESULT_COUNT_INCREMENT}
            viewRecordComponent={ViewInstance}
            editRecordComponent={InstanceForm}
            newRecordInitialValues={(this.state && this.state.copiedInstance) ? this.state.copiedInstance : {
              discoverySuppress: false,
              staffSuppress: false,
              previouslyHeld: false,
              source: 'FOLIO',
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
            onCreate={this.onCreate}
            viewRecordPerms="ui-inventory.instance.view"
            newRecordPerms="ui-inventory.instance.create"
            disableRecordCreation={disableRecordCreation || false}
            parentResources={parentResources}
            parentMutator={parentMutator}
            detailProps={{
              referenceTables: data,
              onCopy: this.copyInstance,
            }}
            path={`${path}/(view|viewsource)/:id/:holdingsrecordid?/:itemid?`}
            showSingleResult={showSingleResult}
            browseOnly={browseOnly}
            onSelectRow={onSelectRow}
            renderFilters={renderFilters}
            onFilterChange={this.onFilterChangeHandler}
            pageAmount={100}
            pagingType="click"
            hasNewButton={false}
          />
        </div>
        <ErrorModal
          isOpen={this.state.showErrorModal}
          label={<FormattedMessage id="ui-inventory.reports.inTransitItem.emptyReport.label" />}
          content={<FormattedMessage id="ui-inventory.reports.inTransitItem.emptyReport.message" />}
          onClose={this.onErrorModalClose}
        />
      </React.Fragment>
    );
  }
}

export default flowRight(
  injectIntl,
  withLocation,
)(InstancesView);
