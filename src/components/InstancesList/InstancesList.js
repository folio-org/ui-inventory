import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  omit,
  get,
  set,
  flowRight,
  isEmpty
} from 'lodash';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
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
} from '../../utils';
import {
  InTransitItemReport,
  InstancesIdReport,
} from '../../reports';
import ErrorModal from '../ErrorModal';

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
    onCreate: PropTypes.func,
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

  onCreate = (instance) => {
    this.props.onCreate(instance).then(() => this.closeNewInstance());
  }

  copyInstance = (instance) => {
    let copiedInstance = omit(instance, ['id', 'hrid']);
    copiedInstance = set(copiedInstance, 'source', 'FOLIO');
    this.setState({ copiedInstance });
    this.props.updateLocation({ layer: 'create' });
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

  getActionMenu = ({ onToggle }) => {
    const { parentResources } = this.props;

    return (
      <Fragment>
        <Button
          buttonStyle="dropdownItem"
          id="dropdown-clickable-get-report"
          onClick={() => {
            onToggle();

            this.startInTransitReportGeneration();
          }}
        >
          <Icon
            icon="report"
            size="medium"
            iconClassName={css.actionIcon}
          />
          <FormattedMessage id="ui-inventory.inTransitReport" />
        </Button>
        <Button
          disabled={isEmpty(get(parentResources, ['records', 'records'], []))}
          buttonStyle="dropdownItem"
          id="dropdown-clickable-get-items-uiids"
          onClick={() => {
            onToggle();

            this.generateInstancesIdReport();
          }}
        >
          <Icon
            icon="save"
            size="medium"
            iconClassName={css.actionIcon}
          />
          <FormattedMessage id="ui-inventory.saveInstancesUIIDS" />
        </Button>
        <Button
          disabled
          buttonStyle="dropdownItem"
          id="dropdown-clickable-export-marc"
        >
          <Icon
            icon="download"
            size="medium"
            iconClassName={css.actionIcon}
          />
          <FormattedMessage id="ui-inventory.exportInstancesMARC" />
        </Button>
        <Button
          disabled
          buttonStyle="dropdownItem"
          id="dropdown-clickable-export-json"
        >
          <Icon
            icon="download"
            size="medium"
            iconClassName={css.actionIcon}
          />
          <FormattedMessage id="ui-inventory.exportInstancesJSON" />
        </Button>
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
