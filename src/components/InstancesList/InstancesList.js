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
  uniqBy,
} from 'lodash';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import saveAs from 'file-saver';
import moment from 'moment';
import classnames from 'classnames';
import { stringify } from 'query-string';

import {
  Pluggable,
  AppIcon,
  IfPermission,
  CalloutContext,
  stripesConnect,
  withNamespace,
  checkIfUserInCentralTenant,
  TitleManager,
  getUserTenantsPermissions,
} from '@folio/stripes/core';
import {
  SearchAndSort,
  buildUrl,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  Checkbox,
  MenuSection,
  Select,
  HasCommand,
  MCLPagingTypes,
  TextLink,
  DefaultMCLRowFormatter,
} from '@folio/stripes/components';
import {
  advancedSearchQueryBuilder,
  queryIndexes,
  advancedSearchIndexes,
  segments,
  OKAPI_TENANT_HEADER,
  getCurrentFilters,
  buildSearchQuery,
  SORT_OPTIONS,
  SEARCH_COLUMNS,
  TOGGLEABLE_COLUMNS,
  getSearchResultsFormatter,
  SEARCH_COLUMN_MAPPINGS,
  withReset,
  getDefaultQindex,
} from '@folio/stripes-inventory-components';

import ViewInstanceRoute from '../../routes/ViewInstanceRoute';
import FilterNavigation from '../FilterNavigation';
import SearchModeNavigation from '../SearchModeNavigation';
import packageInfo from '../../../package';
import InstanceForm from '../../edit/InstanceForm';
import formatters from '../../referenceFormatters';
import {
  withLocation,
  withUseResourcesIds,
  withSingleRecordImport,
} from '../../hocs';
import {
  getNextSelectedRowsState,
  parseFiltersToStr,
  marshalInstance,
  omitFromArray,
  isTestEnv,
  handleKeyCommand,
  buildSingleItemQuery,
  isUserInConsortiumMode,
  switchAffiliation,
  getSortOptions,
  hasMemberTenantPermission,
} from '../../utils';
import {
  INSTANCES_ID_REPORT_TIMEOUT,
  CONTENT_TYPE_HEADER,
  OKAPI_TOKEN_HEADER,
  INSTANCE_RECORD_TYPE,
} from '../../constants';
import {
  IdReportGenerator,
  InTransitItemsReport,
} from '../../reports';
import ErrorModal from '../ErrorModal';
import CheckboxColumn from './CheckboxColumn';
import SelectedRecordsModal from '../SelectedRecordsModal';
import ImportRecordModal from '../ImportRecordModal';
import {
  getItem,
  setItem,
} from '../../storage';

import css from './instances.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const NON_TOGGLEABLE_COLUMNS = [
  SEARCH_COLUMNS.SELECT,
  SEARCH_COLUMNS.TITLE,
];
const ALL_COLUMNS = Array.from(new Set([
  ...NON_TOGGLEABLE_COLUMNS,
  SEARCH_COLUMNS.CONTRIBUTORS,
  SEARCH_COLUMNS.PUBLISHERS,
  SEARCH_COLUMNS.DATE,
  SEARCH_COLUMNS.RELATION,
  SEARCH_COLUMNS.HRID,
]));
const VISIBLE_COLUMNS_STORAGE_KEY = 'inventory-visible-columns';
const SORTABLE_COLUMNS = Object.values(SORT_OPTIONS)
  .filter(column => column !== SORT_OPTIONS.RELEVANCE);
const NON_INTERACTIVE_HEADERS = [SEARCH_COLUMNS.SELECT];

class InstancesList extends React.Component {
  static defaultProps = {
    canUseSingleRecordImport: false,
    segment: segments.instances,
  };

  static propTypes = {
    canUseSingleRecordImport: PropTypes.bool,
    data: PropTypes.object,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    publishOnReset: PropTypes.func.isRequired,
    disableRecordCreation: PropTypes.bool,
    unsubscribeFromReset: PropTypes.func.isRequired,
    updateLocation: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    getParams: PropTypes.func.isRequired,
    getResourcesIds: PropTypes.func.isRequired,
    isRequestUrlExceededLimit: PropTypes.bool.isRequired,
    segment: PropTypes.string,
    intl: PropTypes.object,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.object.isRequired,
    }).isRequired,
    namespace: PropTypes.string,
    renderFilters: PropTypes.func.isRequired,
    searchableIndexes: PropTypes.arrayOf(PropTypes.object).isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired,
    }),
    location: PropTypes.shape({
      search: PropTypes.string,
      state: PropTypes.object,
      pathname: PropTypes.string,
    }),
    stripes: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
      listen: PropTypes.func,
      replace: PropTypes.func,
    }),
    getLastBrowse: PropTypes.func.isRequired,
    getLastSearchOffset: PropTypes.func.isRequired,
    storeLastSearch: PropTypes.func.isRequired,
    storeLastSearchOffset: PropTypes.func.isRequired,
    storeLastSegment: PropTypes.func.isRequired,
  };

  static contextType = CalloutContext;

  static manifest = Object.freeze({
    query: {},
  });

  constructor(props) {
    super(props);

    this.paneTitleRef = React.createRef();

    this.state = {
      showNewFastAddModal: false,
      inTransitItemsExportInProgress: false,
      instancesIdExportInProgress: false,
      holdingsIdExportInProgress: false,
      instancesQuickExportInProgress: false,
      showErrorModal: false,
      selectedRows: {},
      isSelectedRecordsModalOpened: false,
      visibleColumns: this.getInitialToggleableColumns(),
      isImportRecordModalOpened: false,
      searchAndSortKey: 0,
      segmentsSortBy: this.getInitialSegmentsSortBy(),
      searchInProgress: false,
      userTenantPermissions: [],
    };
  }

  componentDidMount() {
    const {
      history,
      location: _location,
      getParams,
      data,
      stripes,
    } = this.props;

    const params = getParams();
    const defaultSort = data.displaySettings.defaultSort;

    this.unlisten = history.listen((location) => {
      const hasReset = new URLSearchParams(location.search).get('reset');

      if (hasReset) {
        // imperative way is used because it's no option in SearchAndSort reset/focus filters from outside
        document.getElementById('clickable-reset-all')?.click();
        this.inputRef.current.focus();

        history.replace({ search: 'segment=instances' });
      }
    });

    if (params.selectedBrowseResult === 'true') {
      this.paneTitleRef.current.focus();
    }

    this.processLastSearchTermsOnMount();

    const searchParams = new URLSearchParams(_location.search);

    let isSortingUpdated = false;

    if (!params.sort) {
      isSortingUpdated = true;
      searchParams.set('sort', defaultSort);
    }

    if (isSortingUpdated) {
      this.redirectToSearchParams(searchParams);
    }

    if (isUserInConsortiumMode(stripes)) {
      this.getCurrentTenantPermissions();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      data,
      location,
      segment,
      parentMutator,
      getLastSearchOffset,
    } = this.props;
    const sortBy = this.getSortFromParams();

    this.storeLastSearchTerms(prevProps);

    // change sortBy action only if sort parameter exists. It is absent for a while after reset is hit.
    if (sortBy && this.state.segmentsSortBy.find(x => x.name === segment && x.sort !== sortBy)) {
      this.setSegmentSortBy(sortBy);
    }

    const prevId = this.getInstanceIdFromLocation(prevProps.location);
    const id = this.getInstanceIdFromLocation(this.props.location);

    if (id) {
      setItem(`${this.props.namespace}.${this.props.segment}.lastOpenRecord`, id);
    } else if (prevId) {
      setItem(`${this.props.namespace}.${this.props.segment}.lastOpenRecord`, null);
    }

    const searchParams = new URLSearchParams(location.search);

    let isSortingUpdated = false;

    // `sort` is missing after reset button is hit
    if (!sortBy) {
      isSortingUpdated = true;
      searchParams.set('sort', data.displaySettings.defaultSort);
    }

    if (isSortingUpdated) {
      this.redirectToSearchParams(searchParams);
    }

    if (prevProps.segment !== segment) {
      const lastSearchOffset = getLastSearchOffset(segment);

      parentMutator.resultOffset.replace(lastSearchOffset);
    }

    if (prevProps.data.displaySettings !== this.props.data.displaySettings) {
      this.setState({
        visibleColumns: this.getInitialToggleableColumns(),
      });
    }
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;

    this.unlisten();
    parentMutator.records.reset();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  inputRef = React.createRef();
  indexRef = React.createRef();

  extraParamsToReset = {
    selectedBrowseResult: false,
    authorityId: '',
  };

  redirectToSearchParams = (searchParams) => {
    const {
      history,
      location,
    } = this.props;

    history.replace({
      pathname: location.pathname,
      search: searchParams.toString(),
      state: location.state,
    });
  }

  getInstanceIdFromLocation = (location) => {
    return location.pathname.split('/')[3];
  };

  getPageTitle = () => {
    const {
      data: { query },
      intl,
    } = this.props;

    if (!query.query) {
      return intl.formatMessage({ id: 'ui-inventory.meta.title' });
    }

    return intl.formatMessage({ id: 'ui-inventory.documentTitle.search' }, { query: query.query });
  }

  processLastSearchTermsOnMount = () => {
    const {
      getParams,
      parentMutator,
      getLastSearchOffset,
      segment: currentSegment,
    } = this.props;
    const params = getParams();
    const lastSearchOffset = getLastSearchOffset(currentSegment);
    const offset = params.selectedBrowseResult === 'true' ? 0 : lastSearchOffset;

    parentMutator.resultOffset.replace(offset);
  }

  storeLastSearchTerms = (prevProps) => {
    const {
      location,
      parentResources,
      storeLastSearch,
      storeLastSearchOffset,
      segment,
    } = this.props;

    if (prevProps.location.search !== location.search) {
      storeLastSearch(location.search, segment);
    }

    if (prevProps.parentResources.resultOffset !== parentResources.resultOffset) {
      storeLastSearchOffset(parentResources.resultOffset, segment);
    }
  }

  getSortFromParams = () => {
    const params = new URLSearchParams(this.props.location.search);
    return params.get('sort');
  }

  getInitialToggleableColumns = () => {
    const { defaultColumns } = this.props.data.displaySettings;

    return getItem(VISIBLE_COLUMNS_STORAGE_KEY) || defaultColumns || [];
  }

  getInitialSegmentsSortBy = () => {
    const { data } = this.props;

    return Object.keys(segments).map(name => ({
      name,
      sort: data.displaySettings.defaultSort,
    }));
  }

  getVisibleColumns = () => {
    const columns = this.state.visibleColumns;
    const visibleColumns = new Set([...columns, ...NON_TOGGLEABLE_COLUMNS]);

    return ALL_COLUMNS.filter(key => visibleColumns.has(key));
  }

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

  onSubmitSearch = () => {
    this.setState({
      searchInProgress: true,
    });
  }

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.setState({ copiedInstance: null });
    this.props.updateLocation({ layer: null });
  };

  createInstance = (instanceData) => {
    const { data: { identifierTypesByName, instanceDateTypesByCode } } = this.props;

    // Massage record to add preceeding and succeeding title fields
    const instance = marshalInstance(instanceData, identifierTypesByName, instanceDateTypesByCode);

    // POST item record
    return this.props.parentMutator.records.POST(instance);
  };

  onCreate = (instance) => {
    return this.createInstance(instance).then(() => this.closeNewInstance());
  }

  openCreateInstance = () => {
    this.props.updateLocation({ layer: 'create' });
  }

  openCreateMARCRecord = () => {
    const searchParams = new URLSearchParams(this.props.location.search);
    this.props.goTo(`/inventory/quick-marc/create-bibliographic?${searchParams}`);
  }

  copyInstance = (instance) => {
    const {
      precedingTitles,
      succeedingTitles,
      childInstances,
      parentInstances,
    } = instance;
    let copiedInstance = omit(instance, ['id', 'hrid']);

    if (precedingTitles?.length) {
      copiedInstance.precedingTitles = omitFromArray(precedingTitles, 'id');
    }

    if (succeedingTitles?.length) {
      copiedInstance.succeedingTitles = omitFromArray(succeedingTitles, 'id');
    }

    if (childInstances?.length) {
      copiedInstance.childInstances = omitFromArray(childInstances, 'id');
    }

    if (parentInstances?.length) {
      copiedInstance.parentInstances = omitFromArray(parentInstances, 'id');
    }

    copiedInstance = set(copiedInstance, 'source', 'FOLIO');

    this.setState({ copiedInstance });
    this.openCreateInstance();
  }

  refocusOnInputSearch = (segment) => {
    const { storeLastSegment } = this.props;

    // when navigation button is clicked to change the search segment
    // the focus stays on the button so refocus back on the input search.
    // https://issues.folio.org/browse/UIIN-1358
    storeLastSegment(segment);
    this.inputRef.current.focus();
  }

  handleSearchSegmentChange = (segment) => {
    const {
      unsubscribeFromReset,
    } = this.props;

    this.refocusOnInputSearch(segment);
    this.setState({ selectedRows: {} });
    unsubscribeFromReset();
  }

  onSearchModeSwitch = () => {
    const {
      namespace,
      location: { pathname },
      segment,
    } = this.props;

    const id = pathname.split('/')[3];

    if (id) {
      setItem(`${namespace}.${segment}.lastOpenRecord`, id);
    }
  }

  renderNavigation = () => (
    <>
      <SearchModeNavigation
        search={this.props.getLastBrowse()}
        onSearchModeSwitch={this.onSearchModeSwitch}
      />
      <FilterNavigation
        data={this.props.data}
        segment={this.props.segment}
        onChange={this.handleSearchSegmentChange}
      />
    </>
  );

  generateInTransitItemReport = async () => {
    const {
      intl: {
        formatMessage,
      },
      parentMutator,
    } = this.props;
    const { sendCallout, removeCallout } = this.context;
    const calloutId = sendCallout({
      message: <FormattedMessage id="ui-inventory.exportInProgress" />,
      timeout: 0,
    });

    try {
      const report = new InTransitItemsReport(parentMutator, formatMessage);
      const items = await report.toCSV();

      if (!items?.length) {
        this.setState({ showErrorModal: true });
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      removeCallout(calloutId);
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
    const {
      data,
      getResourcesIds,
    } = this.props;

    if (instancesIdExportInProgress) return;

    this.setState({ instancesIdExportInProgress: true }, async () => {
      let infoCalloutTimer;

      try {
        infoCalloutTimer = setTimeout(() => {
          sendCallout({
            type: 'info',
            message: <FormattedMessage id="ui-inventory.saveInstancesUIIDS.info" />,
          });
        }, INSTANCES_ID_REPORT_TIMEOUT);

        const query = buildSearchQuery()(data.query, {}, data, { log: noop }, this.props);

        const report = new IdReportGenerator('SearchInstanceUUIDs');

        const items = await getResourcesIds(query, 'INSTANCE');

        clearTimeout(infoCalloutTimer);

        if (!isEmpty(items)) {
          report.toCSV(uniqBy(items, 'id'), record => record.id);
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
      const instanceIds = Object.keys(this.state.selectedRows);

      await this.props.parentMutator.quickExport.POST({
        uuids: instanceIds,
        type: 'uuid',
        recordType: INSTANCE_RECORD_TYPE,
      });
      new IdReportGenerator('QuickInstanceExport').toCSV(instanceIds);
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
    if (!isTestEnv()) {
      const { data } = this.props;

      const query = buildSearchQuery()(data.query, {}, data, { log: noop }, this.props);
      const fileName = `SearchInstanceCQLQuery${moment().format()}.cql`;

      saveAs(new Blob([query], { type: 'text/plain;charset=utf-8;' }), fileName);
    }
  }

  toggleNewFastAddModal = () => {
    this.setState((state) => {
      return { showNewFastAddModal: !state.showNewFastAddModal };
    });
  }

  focusSearchField = () => {
    setTimeout(() => {
      this.inputRef.current?.focus();
    });
  }

  handleFastAddModalClose = ({ instanceRecord } = {}) => {
    const {
      history,
      location,
    } = this.props;

    if (instanceRecord?.id) {
      history.push({
        pathname: `/inventory/view/${instanceRecord.id}`,
        search: location.search,
      });
    } else {
      this.focusSearchField();
    }

    this.toggleNewFastAddModal();
  }

  generateHoldingsIdReport = async (sendCallout) => {
    const {
      data,
      getResourcesIds,
    } = this.props;
    const { holdingsIdExportInProgress } = this.state;

    if (holdingsIdExportInProgress) return;

    this.setState({ holdingsIdExportInProgress: true }, async () => {
      let infoCalloutTimer;

      try {
        infoCalloutTimer = setTimeout(() => {
          sendCallout({
            type: 'info',
            message: <FormattedMessage id="ui-inventory.saveHoldingsUIIDS.info" />,
          });
        }, INSTANCES_ID_REPORT_TIMEOUT);

        const query = buildSearchQuery()(data.query, {}, data, { log: noop }, this.props);

        const items = await getResourcesIds(query, 'HOLDINGS');

        clearTimeout(infoCalloutTimer);

        const report = new IdReportGenerator('SearchHoldingsUUIDs');

        if (!isEmpty(items)) {
          report.toCSV(items, record => record.id);
        }
      } catch (error) {
        clearTimeout(infoCalloutTimer);

        sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-inventory.saveHoldingsUIIDS.error" />,
        });
      } finally {
        this.setState({ holdingsIdExportInProgress: false });
      }
    });
  };

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

  handleToggleColumn = ({ target: { value: key } }) => {
    this.setState(({ visibleColumns }) => ({
      visibleColumns: visibleColumns.includes(key) ? visibleColumns.filter(k => key !== k) : [...visibleColumns, key]
    }), () => {
      setItem(VISIBLE_COLUMNS_STORAGE_KEY, this.state.visibleColumns);
    });
  }

  onMarkPosition = (position) => {
    const { namespace } = this.props;
    setItem(`${namespace}.position`, position);
  }

  resetMarkedPosition = () => {
    const { namespace } = this.props;
    setItem(`${namespace}.position`, null);
  }

  setSegmentSortBy = (sortBy) => {
    const { segment } = this.props;

    this.setState(prevState => ({
      segmentsSortBy: prevState.segmentsSortBy.map((key) => {
        if (key.name === segment) {
          key.sort = sortBy;
          return key;
        }
        return key;
      }),
    }));
  }

  getActionMenu = ({ onToggle }) => {
    const {
      canUseSingleRecordImport,
      parentResources,
      intl,
      segment,
      stripes,
      isRequestUrlExceededLimit,
    } = this.props;
    const { inTransitItemsExportInProgress } = this.state;
    const selectedRowsCount = size(this.state.selectedRows);
    const isInstancesListEmpty = isEmpty(get(parentResources, ['records', 'records'], []));
    const visibleColumns = this.getVisibleColumns();
    const columnMapping = this.getColumnMapping();
    const canExportMarc = stripes.hasPerm('ui-data-export.edit');
    const canCreateItemsInTransitReport = stripes.hasPerm('ui-inventory.items.in-transit-report.create');

    const buildOnClickHandler = onClickHandler => {
      return () => {
        onToggle();

        onClickHandler(this.context.sendCallout);
      };
    };

    const setSortedColumn = (event) => {
      const {
        match: { path },
        goTo,
        getParams,
      } = this.props;

      onToggle();

      const params = getParams();
      params.sort = event.target.value;

      this.setSegmentSortBy(params.sort);

      const { sort, ...rest } = params;
      const queryParams = params.sort === '' ? rest : { sort, ...rest };

      goTo(path, { ...queryParams });
    };

    const getSortByValue = () => {
      return this.state.segmentsSortBy.find(x => x.name === segment).sort?.replace('-', '') || '';
    };

    return (
      <>
        <MenuSection label={intl.formatMessage({ id: 'ui-inventory.actions' })} id="actions-menu-section">
          <IfPermission perm="ui-inventory.instance.create">
            {this.getActionItem({
              id: 'clickable-newinventory',
              icon: checkIfUserInCentralTenant(stripes) ? 'graph' : 'plus-sign',
              messageId: !isUserInConsortiumMode(stripes)
                ? 'stripes-smart-components.new'
                : (checkIfUserInCentralTenant(stripes) ? 'ui-inventory.newSharedRecord' : 'ui-inventory.newLocalRecord'),
              onClickHandler: buildOnClickHandler(this.openCreateInstance),
            })}
          </IfPermission>
          {!checkIfUserInCentralTenant(stripes) && (
            <Pluggable
              id="clickable-create-inventory-records"
              onClose={this.handleFastAddModalClose}
              renderInPaneset={false}
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
          )}
          <IfPermission perm="ui-quick-marc.quick-marc-editor.create">
            <Button
              buttonStyle="dropdownItem"
              id="clickable-newmarcrecord"
              onClick={buildOnClickHandler(this.openCreateMARCRecord)}
            >
              <Icon
                icon="plus-sign"
                size="medium"
                iconClassName={css.actionIcon}
              />
              <FormattedMessage id="ui-inventory.newMARCRecord" />
            </Button>
          </IfPermission>

          {
          inTransitItemsExportInProgress ?
            this.getActionItem({
              id: 'dropdown-clickable-get-report',
              icon: 'report',
              messageId: 'ui-inventory.exportInProgress',
            }) :
            canCreateItemsInTransitReport && !checkIfUserInCentralTenant(stripes) && this.getActionItem({
              id: 'dropdown-clickable-get-report',
              icon: 'report',
              messageId: 'ui-inventory.inTransitReport',
              onClickHandler: buildOnClickHandler(this.startInTransitReportGeneration),
            })
        }
          {this.getActionItem({
            id: 'dropdown-clickable-get-instances-uiids',
            icon: 'save',
            messageId: 'ui-inventory.saveInstancesUIIDS',
            onClickHandler: buildOnClickHandler(this.generateInstancesIdReport),
            isDisabled: isInstancesListEmpty && !isRequestUrlExceededLimit,
          })}
          {segment === 'holdings' && this.getActionItem({
            id: 'dropdown-clickable-get-holdings-uiids',
            icon: 'save',
            messageId: 'ui-inventory.saveHoldingsUIIDS',
            onClickHandler: buildOnClickHandler(this.generateHoldingsIdReport),
            isDisabled: isInstancesListEmpty,
          })}
          {this.getActionItem({
            id: 'dropdown-clickable-get-cql-query',
            icon: 'search',
            messageId: 'ui-inventory.saveInstancesCQLQuery',
            onClickHandler: buildOnClickHandler(this.generateCQLQueryReport),
            isDisabled: isInstancesListEmpty,
          })}
          {canExportMarc && this.getActionItem({
            id: 'dropdown-clickable-export-marc',
            icon: 'download',
            messageId: 'ui-inventory.exportInstancesInMARC',
            onClickHandler: buildOnClickHandler(this.triggerQuickExport),
            isDisabled: !selectedRowsCount,
          })}
          {canUseSingleRecordImport && this.getActionItem({
            id: 'dropdown-clickable-import-record',
            icon: 'lightning',
            messageId: 'ui-inventory.copycat.import',
            onClickHandler: buildOnClickHandler(() => this.setState({ isImportRecordModalOpened: true })),
          })}
          {this.getActionItem({
            id: 'dropdown-clickable-show-selected-records',
            icon: 'eye-open',
            messageId: 'ui-inventory.instances.showSelectedRecords',
            onClickHandler: buildOnClickHandler(() => this.setState({ isSelectedRecordsModalOpened: true })),
            isDisabled: !selectedRowsCount,
          })}
        </MenuSection>
        <MenuSection
          data-testid="menu-section-sort-by"
          label={intl.formatMessage({ id: 'ui-inventory.actions.menuSection.sortBy' })}
        >
          <Select
            data-testid="sort-by-selection"
            dataOptions={getSortOptions(intl)}
            value={getSortByValue()}
            onChange={setSortedColumn}
          />
        </MenuSection>
        <MenuSection label={intl.formatMessage({ id: 'ui-inventory.showColumns' })} id="columns-menu-section">
          {TOGGLEABLE_COLUMNS.map(key => (
            <Checkbox
              key={key}
              name={key}
              data-testid={key}
              label={columnMapping[key]}
              id={`inventory-search-column-checkbox-${key}`}
              checked={visibleColumns.includes(key)}
              value={key}
              onChange={this.handleToggleColumn}
            />
          ))}
        </MenuSection>
      </>
    );
  };

  getRowURL = (id) => {
    const {
      match: { path },
      location: { search },
    } = this.props;

    return `${path}/view/${id}${search}`;
  };

  getIsAllRowsSelected = () => {
    const { parentResources } = this.props;
    const { selectedRows } = this.state;

    return parentResources.records.records.every(({ id }) => Object.keys(selectedRows).includes(id));
  };

  toggleAllRows = () => {
    const { parentResources } = this.props;
    const { selectedRows } = this.state;

    const toggledRows = parentResources.records.records.reduce((acc, row) => (
      {
        ...acc,
        [row.id]: row,
      }
    ), {});

    const filterSelectedRows = rows => {
      Object.keys(toggledRows).forEach(id => {
        if (rows[id]) delete rows[id];
      });
      return rows;
    };

    this.setState(({ selectedRows: this.getIsAllRowsSelected() ? filterSelectedRows(selectedRows) : { ...selectedRows, ...toggledRows } }));
  };

  getColumnMapping = () => {
    const { intl } = this.props;

    const columnMapping = {
      ...SEARCH_COLUMN_MAPPINGS,
      select: !this.state.isSelectedRecordsModalOpened && (
        <Checkbox
          checked={this.getIsAllRowsSelected()}
          aria-label={intl.formatMessage({ id: 'ui-inventory.instances.rows.select' })}
          onChange={() => this.toggleAllRows()}
        />
      ),
      title: intl.formatMessage({ id: 'ui-inventory.instances.columns.title' }),
      contributors: intl.formatMessage({ id: 'ui-inventory.instances.columns.contributors' }),
      publishers: intl.formatMessage({ id: 'ui-inventory.instances.columns.publishers' }),
      relation: intl.formatMessage({ id: 'ui-inventory.instances.columns.relation' }),
      hrid: intl.formatMessage({ id: 'ui-inventory.instances.columns.instanceHRID' }),
    };

    return columnMapping;
  }

  onErrorModalClose = () => {
    this.setState({ showErrorModal: false });
  };

  toggleRowSelection = row => {
    this.setState(({ selectedRows }) => ({ selectedRows: getNextSelectedRowsState(selectedRows, row) }));
  };

  handleResetAll = () => {
    const {
      publishOnReset,
    } = this.props;

    this.setState({
      selectedRows: {},
    });

    this.inputRef.current.focus();
    publishOnReset();
  }

  handleSelectedRecordsModalSave = selectedRecords => {
    this.setState({
      isSelectedRecordsModalOpened: false,
      selectedRows: selectedRecords,
    });
  }

  handleSelectedRecordsModalCancel = () => {
    this.setState({ isSelectedRecordsModalOpened: false });
  }

  handleImportRecordModalSubmit = (args) => {
    this.setState({ isImportRecordModalOpened: false });
    this.props.mutator.query.update({
      _path: '/inventory/import',
      xidtype: args.externalIdentifierType,
      xid: args.externalIdentifier,
      jobprofileid: args.selectedJobProfileId,
    });
  }

  handleImportRecordModalCancel = () => {
    this.setState({ isImportRecordModalOpened: false });
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

  translateSearchOptionLabel = ({ label, value }) => {
    const { intl } = this.props;

    return {
      label: intl.formatMessage({ id: label }),
      value,
    };
  }

  getCurrentTenantPermissions = () => {
    const {
      stripes,
      stripes: { user: { user: { tenants } } },
    } = this.props;

    getUserTenantsPermissions(stripes, tenants).then(userTenantPermissions => this.setState({ userTenantPermissions }));
  }

  findAndOpenItem = async (instance) => {
    const {
      parentResources,
      parentMutator: { itemsByQuery },
      getParams,
      stripes,
      history,
    } = this.props;
    const { query, qindex } = parentResources?.query ?? {};
    const { searchInProgress } = this.state;

    if (!searchInProgress) {
      return instance;
    }

    const itemQuery = buildSingleItemQuery(qindex, query);

    if (!itemQuery) {
      this.setState({ searchInProgress: false });
    }

    const tenantItemBelongsTo = instance?.items?.[0]?.tenantId || stripes.okapi.tenant;

    // if a user is not affiliated with the item's member tenant then item details cannot be open
    if (isUserInConsortiumMode(stripes)) {
      const tenants = stripes.user.user.tenants || [];
      const isUserAffiliatedWithMemberTenant = tenants.find(tenant => tenant?.id === tenantItemBelongsTo);
      const canMemberTenantViewItems = hasMemberTenantPermission('ui-inventory.instance.view', tenantItemBelongsTo, this.state.userTenantPermissions);

      if (isEmpty(isUserAffiliatedWithMemberTenant) || !canMemberTenantViewItems) {
        return instance;
      }
    }

    itemsByQuery.reset();
    const items = await itemsByQuery.GET({
      params: { query: itemQuery },
      headers: {
        [OKAPI_TENANT_HEADER]: tenantItemBelongsTo,
        [CONTENT_TYPE_HEADER]: 'application/json',
        ...(stripes.okapi.token && { [OKAPI_TOKEN_HEADER]: stripes.okapi.token }),
      },
    });

    this.setState({ searchInProgress: false });

    // if no results have been found or more than one item has been found
    // do not open item view
    if (items?.length > 1 || !items?.[0]?.holdingsRecordId) {
      return instance;
    }

    const { id, holdingsRecordId } = items[0];
    const search = stringify(getParams());

    const navigateToItemView = () => {
      history.push({
        pathname: `/inventory/view/${instance.id}/${holdingsRecordId}/${id}`,
        search,
        state: {
          tenantTo: tenantItemBelongsTo,
          tenantFrom: stripes.okapi.tenant,
        },
      });
    };

    await switchAffiliation(stripes, tenantItemBelongsTo, navigateToItemView);

    return null;
  }

  onSelectRow = (_, instance) => {
    const { parentResources } = this.props;
    const { query } = parentResources?.query ?? {};

    if (!query) {
      this.setState({ searchInProgress: false });
      return instance;
    }

    return this.findAndOpenItem(instance);
  }

  handleCloseNewRecord = (e) => {
    const {
      location,
      match: {
        path,
      },
      history,
    } = this.props;

    e?.preventDefault();

    const url = buildUrl(location, { layer: null }, path);

    history.push(url);
    this.focusSearchField();
  }

  handleDismissDetail = (resetSelectedItem) => {
    const { location } = this.props;
    const id = this.getInstanceIdFromLocation(location);

    resetSelectedItem();
    // focus on the title of the closed record in the results list
    document.getElementById(`record-title-${id}`)?.focus();
  }

  render() {
    const {
      canUseSingleRecordImport,
      disableRecordCreation,
      intl,
      isRequestUrlExceededLimit,
      data,
      parentResources,
      parentMutator,
      renderFilters,
      searchableIndexes,
      match: {
        path,
      },
      namespace,
      stripes,
      segment,
    } = this.props;
    const {
      isSelectedRecordsModalOpened,
      isImportRecordModalOpened,
      selectedRows,
      searchAndSortKey,
    } = this.state;

    const itemToView = getItem(`${namespace}.position`);

    const resultsFormatter = {
      ...getSearchResultsFormatter(data),
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
      'title': ({
        title,
        discoverySuppress,
        isBoundWith,
        shared,
        staffSuppress,
        id,
      }) => {
        return (
          <div className={css.titleContainer}>
            <AppIcon
              size="small"
              app="inventory"
              iconKey="instance"
              iconAlignment="baseline"
            >
              <TextLink
                id={`record-title-${id}`}
                to={this.getRowURL(id)}
              >
                {title}
              </TextLink>
              {(isBoundWith) &&
                <AppIcon
                  size="small"
                  app="@folio/inventory"
                  iconKey="bound-with"
                  iconClassName={css.boundWithIcon}
                />
              }
              {(discoverySuppress || staffSuppress) &&
                <span className={css.warnIcon}>
                  <Icon
                    size="medium"
                    icon="exclamation-circle"
                    status="warn"
                  />
                </span>
              }
            </AppIcon>
            {shared &&
              <Icon
                size="medium"
                icon="graph"
                iconRootClass={css.sharedIconRoot}
                iconClassName={classnames(
                  css.sharedIcon,
                  { [css.sharedIconLight]: getItem(`${namespace}.${segment}.lastOpenRecord`) === id }
                )}
              />
            }
          </div>
        );
      },
      'relation': r => formatters.relationsFormatter(r, data.instanceRelationshipTypes),
      'publishers': r => (r?.publication ?? []).map(p => (p ? `${p.publisher} ${p.dateOfPublication ? `(${p.dateOfPublication})` : ''}` : '')).join(', '),
      'publication date': r => r.publication.map(p => p.dateOfPublication).join(', '),
      'contributors': r => formatters.contributorsFormatter(r, data.contributorTypes),
    };

    const visibleColumns = this.getVisibleColumns();
    const columnMapping = this.getColumnMapping();

    const searchOptions = searchableIndexes.map(this.translateSearchOptionLabel);

    const advancedSearchOptions = advancedSearchIndexes[segment].map(this.translateSearchOptionLabel);

    const shortcuts = [
      {
        name: 'new',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.instance.create')) {
            this.openCreateInstance();
          }
        }),
      },
    ];

    const checkScope = () => {
      const ignoreElements = ['TEXTAREA', 'INPUT'];

      return !ignoreElements.includes(document.activeElement.tagName);
    };

    return (
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <TitleManager page={this.getPageTitle()} />
        <div data-test-inventory-instances className={css.inventoryInstances}>
          <SearchAndSort
            key={searchAndSortKey}
            actionMenu={this.getActionMenu}
            packageInfo={packageInfo}
            objectName="inventory"
            maxSortKeys={1}
            renderNavigation={this.renderNavigation}
            searchableIndexes={searchOptions}
            advancedSearchIndex={queryIndexes.ADVANCED_SEARCH}
            advancedSearchOptions={advancedSearchOptions}
            advancedSearchQueryBuilder={advancedSearchQueryBuilder}
            // query.qindex is empty by default when switching between segments so we need to pass some default value here
            selectedIndex={get(data.query, 'qindex') || getDefaultQindex(segment)}
            searchableIndexesPlaceholder={null}
            initialResultCount={INITIAL_RESULT_COUNT}
            initiallySelectedRecord={getItem(`${namespace}.${segment}.lastOpenRecord`)}
            inputType="textarea"
            inputRef={this.inputRef}
            indexRef={this.indexRef}
            isCursorAtEnd
            isRequestUrlExceededLimit={isRequestUrlExceededLimit}
            resultCountIncrement={RESULT_COUNT_INCREMENT}
            viewRecordComponent={ViewInstanceRoute}
            editRecordComponent={InstanceForm}
            onSelectRow={this.onSelectRow}
            paneTitleRef={this.paneTitleRef}
            newRecordInitialValues={(this.state && this.state.copiedInstance) ? this.state.copiedInstance : {
              discoverySuppress: false,
              staffSuppress: false,
              previouslyHeld: false,
              source: 'FOLIO',
            }}
            visibleColumns={visibleColumns}
            nonInteractiveHeaders={NON_INTERACTIVE_HEADERS}
            columnMapping={columnMapping}
            columnWidths={{
              contributors: {
                max: '400px',
              },
              select: '30px',
              title: '40%',
            }}
            getCellClass={this.formatCellStyles}
            customPaneSub={this.renderPaneSub()}
            resultsRowClickHandlers={false}
            resultsFormatter={resultsFormatter}
            resultRowFormatter={DefaultMCLRowFormatter}
            onCreate={this.onCreate}
            viewRecordPerms="ui-inventory.instance.view"
            newRecordPerms="ui-inventory.instance.create"
            disableRecordCreation={disableRecordCreation || false}
            parentResources={parentResources}
            parentMutator={parentMutator}
            detailProps={{
              referenceTables: data,
              onCopy: this.copyInstance,
              focusTitleOnInstanceLoad: true,
            }}
            basePath={path}
            path={`${path}/(view|viewsource)/:id/:holdingsrecordid?/:itemid?`}
            showSingleResult
            renderFilters={renderFilters}
            onFilterChange={this.onFilterChangeHandler}
            onSubmitSearch={this.onSubmitSearch}
            pageAmount={100}
            pagingType={MCLPagingTypes.PREV_NEXT}
            extraParamsToReset={this.extraParamsToReset}
            hasNewButton={false}
            onResetAll={this.handleResetAll}
            showSortIndicator
            sortableColumns={SORTABLE_COLUMNS}
            syncQueryWithUrl
            resultsVirtualize={false}
            resultsOnMarkPosition={this.onMarkPosition}
            resultsOnResetMarkedPosition={this.resetMarkedPosition}
            resultsCachedPosition={itemToView}
            onCloseNewRecord={this.handleCloseNewRecord}
            onDismissDetail={this.handleDismissDetail}
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
          records={selectedRows}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          onSave={this.handleSelectedRecordsModalSave}
          onCancel={this.handleSelectedRecordsModalCancel}
        />
        {canUseSingleRecordImport && (
          <ImportRecordModal
            isOpen={isImportRecordModalOpened}
            currentExternalIdentifier={undefined}
            handleSubmit={this.handleImportRecordModalSubmit}
            handleCancel={this.handleImportRecordModalCancel}
          />
        )}
      </HasCommand>
    );
  }
}

export default withNamespace(flowRight(
  injectIntl,
  withLocation,
  withSingleRecordImport,
  withReset,
  withUseResourcesIds,
)(stripesConnect(InstancesList)));
