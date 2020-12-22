import React from 'react';
import PropTypes from 'prop-types';
import {
  omit,
  get,
  set,
  flowRight,
  size,
  isEmpty,
  noop,
} from 'lodash';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import saveAs from 'file-saver';
import moment from 'moment';

import {
  Pluggable,
  AppIcon,
  IfPermission,
  CalloutContext,
} from '@folio/stripes/core';
import { SearchAndSort } from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  Checkbox,
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
  omitFromArray,
} from '../../utils';
import {
  INSTANCES_ID_REPORT_TIMEOUT,
  QUICK_EXPORT_LIMIT,
} from '../../constants';
import {
  InTransitItemReport,
  InstancesIdReport,
} from '../../reports';
import ErrorModal from '../ErrorModal';
import CheckboxColumn from './CheckboxColumn';
import SelectedRecordsModal from '../SelectedRecordsModal';

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
    goTo: PropTypes.func.isRequired,
    getParams: PropTypes.func.isRequired,
    segment: PropTypes.string,
    intl: PropTypes.object,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
    }).isRequired,
    renderFilters: PropTypes.func.isRequired,
    searchableIndexes: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static contextType = CalloutContext;

  state = {
    showNewFastAddModal: false,
    inTransitItemsExportInProgress: false,
    instancesIdExportInProgress: false,
    instancesQuickExportInProgress: false,
    showErrorModal: false,
    selectedRows: {},
    isSelectedRecordsModalOpened: false,
  };

  onFilterChangeHandler = ({ name, values }) => {
    const {
      data: { query },
      match: { path },
      goTo,
      getParams,
    } = this.props;
    const curFilters = getCurrentFilters(get(query, 'filters', ''));
    const mergedFilters = values.length
      ? { ...curFilters, [name]: values }
      : omit(curFilters, name);
    const filtersStr = parseFiltersToStr(mergedFilters);
    const params = getParams();

    goTo(path, { ...params, filters: filtersStr });
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
    return this.createInstance(instance).then(() => this.closeNewInstance());
  }

  openCreateInstance = () => {
    this.props.updateLocation({ layer: 'create' });
  }

  copyInstance = (instance) => {
    const {
      precedingTitles,
      succeedingTitles,
    } = instance;
    let copiedInstance = omit(instance, ['id', 'hrid']);

    if (precedingTitles?.length) {
      copiedInstance.precedingTitles = omitFromArray(precedingTitles, 'id');
    }

    if (succeedingTitles?.length) {
      copiedInstance.succeedingTitles = omitFromArray(succeedingTitles, 'id');
    }

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

  generateInstancesIdReport = async (sendCallout) => {
    const { instancesIdExportInProgress } = this.state;

    if (instancesIdExportInProgress) return;

    this.setState({ instancesIdExportInProgress: true }, async () => {
      const {
        reset,
        GET,
      } = this.props.parentMutator.recordsToExportIDs;
      let infoCalloutTimer;

      try {
        reset();

        infoCalloutTimer = setTimeout(() => {
          sendCallout({
            type: 'info',
            message: <FormattedMessage id="ui-inventory.saveInstancesUIIDS.info" />,
          });
        }, INSTANCES_ID_REPORT_TIMEOUT);

        const items = await GET();

        clearTimeout(infoCalloutTimer);

        const report = new InstancesIdReport('SearchInstanceUUIDs');

        if (!isEmpty(items)) {
          report.toCSV(items, record => record.id);
        }
      } catch (error) {
        clearTimeout(infoCalloutTimer);

        sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-inventory.saveInstancesUIIDS.error" />,
        });
      } finally {
        this.setState({ instancesIdExportInProgress: false });
      }
    });
  };

  triggerQuickExport = async (sendCallout) => {
    const { instancesQuickExportInProgress } = this.state;

    if (instancesQuickExportInProgress) return;

    this.setState({ instancesQuickExportInProgress: true });

    try {
      const instanceIds = Object.keys(this.state.selectedRows).slice(0, QUICK_EXPORT_LIMIT);

      await this.props.parentMutator.quickExport.POST({
        uuids: instanceIds,
        type: 'uuid',
        recordType: 'INSTANCE'
      });
      new InstancesIdReport('QuickInstanceExport').toCSV(instanceIds);
    } catch (error) {
      sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-inventory.communicationProblem" />,
      });
    } finally {
      this.setState({ instancesQuickExportInProgress: false });
    }
  };

  generateCQLQueryReport = async () => {
    if (process.env.NODE_ENV !== 'test') {
      const { data } = this.props;

      const query = buildQuery(data.query, {}, data, { log: noop }, this.props);
      const fileName = `SearchInstanceCQLQuery${moment().format()}.cql`;

      saveAs(new Blob([query], { type: 'text/plain;charset=utf-8;' }), fileName);
    }
  }

  toggleNewFastAddModal = () => {
    this.setState((state) => {
      return { showNewFastAddModal: !state.showNewFastAddModal };
    });
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
    const selectedRowsCount = size(this.state.selectedRows);
    const isInstancesListEmpty = isEmpty(get(parentResources, ['records', 'records'], []));
    const isQuickExportLimitExceeded = selectedRowsCount > QUICK_EXPORT_LIMIT;

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler(this.context.sendCallout);
      };
    };

    return (
      <>
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
        <Pluggable
          id="clickable-create-inventory-records"
          onClose={this.toggleNewFastAddModal}
          open={this.state.showNewFastAddModal} // control the open modal via state var
          renderTrigger={() => (
            this.getActionItem({
              id: 'new-fast-add-record',
              icon: 'lightning',
              messageId: 'ui-inventory.newFastAddRecord',
              onClickHandler: buildOnClickHandler(this.toggleNewFastAddModal),
            })
          )}
          type="create-inventory-records"
        />
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
          onClickHandler: buildOnClickHandler(this.triggerQuickExport),
          isDisabled: !selectedRowsCount || isQuickExportLimitExceeded,
        })}
        {isQuickExportLimitExceeded && (
          <span
            className={css.feedbackError}
            data-test-quick-marc-export-limit-exceeded
          >
            <FormattedMessage
              id="ui-inventory.exportInstancesInMARCLimitExceeded"
              values={{ count: QUICK_EXPORT_LIMIT }}
            />
          </span>
        )}
        {this.getActionItem({
          id: 'dropdown-clickable-export-json',
          icon: 'download',
          messageId: 'ui-inventory.exportInstancesInJSON',
          onClickHandler: buildOnClickHandler(noop),
          isDisabled: true,
        })}
        {this.getActionItem({
          id: 'dropdown-clickable-show-selected-records',
          icon: 'eye-open',
          messageId: 'ui-inventory.instances.showSelectedRecords',
          onClickHandler: buildOnClickHandler(() => this.setState({ isSelectedRecordsModalOpened: true })),
          isDisabled: !selectedRowsCount,
        })}
      </>
    );
  };

  onErrorModalClose = () => {
    this.setState({ showErrorModal: false });
  };

  toggleRowSelection = ({
    id: rowId,
    ...rowData
  }) => {
    this.setState(({ selectedRows }) => {
      const isRowSelected = Boolean(selectedRows[rowId]);
      const newSelectedRows = { ...selectedRows };

      if (isRowSelected) {
        delete newSelectedRows[rowId];
      } else {
        newSelectedRows[rowId] = rowData;
      }

      return { selectedRows: newSelectedRows };
    });
  };

  handleResetAll = () => {
    this.setState({ selectedRows: {} });
  }

  handleSelectedRecordsModalCancel = () => {
    this.setState({ isSelectedRecordsModalOpened: false });
  }

  renderPaneSub() {
    const selectedRowsCount = size(this.state.selectedRows);

    return selectedRowsCount
      ? (
        <FormattedMessage
          id="ui-inventory.instances.rows.recordsSelected"
          values={{ count: selectedRowsCount }}
        />
      )
      : null;
  }

  formatCellStyles(defaultCellStyle) {
    return `${defaultCellStyle} ${css.cellAlign}`;
  }

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
    const {
      isSelectedRecordsModalOpened,
      selectedRows,
    } = this.state;

    const resultsFormatter = {
      'select': ({
        id,
        ...rowData
      }) => (
        <CheckboxColumn>
          <Checkbox
            checked={Boolean(selectedRows[id])}
            aria-label={intl.formatMessage({ id: 'ui-inventory.instances.rows.select' })}
            onChange={() => this.toggleRowSelection({
              id,
              ...rowData
            })}
          />
        </CheckboxColumn>
      ),
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

    const columnMapping = {
      select: '',
      title: intl.formatMessage({ id: 'ui-inventory.instances.columns.title' }),
      contributors: intl.formatMessage({ id: 'ui-inventory.instances.columns.contributors' }),
      publishers: intl.formatMessage({ id: 'ui-inventory.instances.columns.publishers' }),
      relation: intl.formatMessage({ id: 'ui-inventory.instances.columns.relation' }),
    };

    const formattedSearchableIndexes = searchableIndexes.map(index => {
      const { prefix = '' } = index;
      const label = prefix + intl.formatMessage({ id: index.label });

      return { ...index, label };
    });

    return (
      <>
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
            visibleColumns={visibleColumns || ['select', 'title', 'contributors', 'publishers', 'relation']}
            columnMapping={columnMapping}
            columnWidths={{
              select: '30px',
              title: '40%',
            }}
            getCellClass={this.formatCellStyles}
            customPaneSub={this.renderPaneSub()}
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
            basePath={path}
            path={`${path}/(view|viewsource)/:id/:holdingsrecordid?/:itemid?`}
            showSingleResult={showSingleResult}
            browseOnly={browseOnly}
            onSelectRow={onSelectRow}
            renderFilters={renderFilters}
            onFilterChange={this.onFilterChangeHandler}
            pageAmount={100}
            pagingType="click"
            hasNewButton={false}
            onResetAll={this.handleResetAll}
          />
        </div>
        <ErrorModal
          isOpen={this.state.showErrorModal}
          label={<FormattedMessage id="ui-inventory.reports.inTransitItem.emptyReport.label" />}
          content={<FormattedMessage id="ui-inventory.reports.inTransitItem.emptyReport.message" />}
          onClose={this.onErrorModalClose}
        />
        <SelectedRecordsModal
          isOpen={isSelectedRecordsModalOpened}
          selectedRecords={selectedRows}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          onCancel={this.handleSelectedRecordsModalCancel}
        />
      </>
    );
  }
}

export default flowRight(
  injectIntl,
  withLocation,
)(InstancesView);
