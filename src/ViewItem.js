import {
  get,
  upperFirst,
  cloneDeep,
  set,
  omit,
  includes,
  map,
  isEmpty,
  values,
} from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Link from 'react-router-dom/Link';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Layer,
  PaneHeaderIconButton,
  MultiColumnList,
  Button,
  Icon,
  ConfirmationModal,
  Modal,
} from '@folio/stripes/components';

import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer,
  stripesConnect,
  IfPermission,
} from '@folio/stripes/core';

import {
  craftLayerUrl,
  callNumberLabel,
  canMarkItemAsMissing,
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  convertArrayToBlocks,
  getDate,
  checkIfArrayIsEmpty,
} from './utils';
import ItemForm from './edit/items/ItemForm';
import withLocation from './withLocation';
import {
  itemStatusesMap,
  noValue,
  requestStatuses,
  wrappingCell,
} from './constants';

const requestsStatusString = map(requestStatuses, requestStatus => `"${requestStatus}"`).join(' or ');
const requestStatusFiltersString = map(requestStatuses, requestStatus => `requestStatus.${requestStatus}`).join(',');
const getRequestsPath = `circulation/requests?query=(itemId==:{itemid}) and status==(${requestsStatusString}) sortby requestDate desc`;

class ViewItem extends React.Component {
  static manifest = Object.freeze({
    query: {},
    items: {
      type: 'okapi',
      path: 'inventory/items/:{itemid}',
      POST: { path: 'inventory/items' },
    },
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
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
    callNumberTypes: {
      type: 'okapi',
      path: 'call-number-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'callNumberTypes',
    },
    requests: {
      type: 'okapi',
      path: getRequestsPath,
      records: 'requests',
      PUT: { path: 'circulation/requests/%{requestOnItem.id}' },
    },
    // there is no canonical method to retrieve an item's "current" loan.
    // the top item, sorted by loan-date descending, is a best-effort.
    loans: {
      type: 'okapi',
      path: 'circulation/loans',
      params: {
        query: 'itemId==!{itemId} sortby loanDate/sort.descending',
        limit: '1',
      },
      records: 'loans',
      accumulate: 'true',
      fetch: false,
    },
    borrowers: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      accumulate: 'true',
      fetch: false,
    },
    requestOnItem: {},
  });

  constructor(props) {
    super(props);
    this.state = {
      areAllAccordionsOpen: true,
      accordions: {
        acc01: true,
        acc02: true,
        acc03: true,
        acc04: true,
        acc05: true,
        acc06: true,
        acc07: true,
        acc08: true,
      },
      loan: null,
      borrower: null,
      itemMissingModal: false,
      confirmDeleteItemModal: false,
      cannotDeleteItemModal: false,
    };

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  async componentDidMount() {
    const {
      AVAILABLE,
      AWAITING_PICKUP,
      IN_TRANSIT,
    } = itemStatusesMap;
    const loans = await this.fetchLoans();
    const loan = loans[0];

    if (!loan) return;

    const itemStatus = get(loan, 'item.status.name');

    if (!includes([AVAILABLE, AWAITING_PICKUP, IN_TRANSIT], itemStatus)) {
      const borrowers = await this.fetchBorrowers(loans[0].userId);
      const state = {
        loan,
        borrower: borrowers[0],
      };

      this.setState(state);
    }
  }

  fetchLoans() {
    const { mutator: { loans } } = this.props;

    loans.reset();

    return loans.GET();
  }

  fetchBorrowers(borrowerId) {
    const { mutator: { borrowers } } = this.props;
    const query = `id==${borrowerId}`;

    borrowers.reset();

    return borrowers.GET({ params: { query } });
  }

  onClickEditItem = e => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'editItem' });
  };

  onClickCloseEditItem = e => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  };

  saveItem = item => {
    if (!item.barcode) {
      delete item.barcode;
    }

    this.props.mutator.items.PUT(item).then(() => this.onClickCloseEditItem());
  };

  copyItem = item => {
    const { resources: { holdingsRecords, instances1 } } = this.props;
    const holdingsRecord = holdingsRecords.records[0];
    const instance = instances1.records[0];

    this.props.mutator.items.POST(item).then((data) => {
      this.props.goTo(`/inventory/view/${instance.id}/${holdingsRecord.id}/${data.id}`);
    });
  };

  deleteItem = item => {
    this.props.onCloseViewItem();
    this.props.mutator.items.DELETE(item);
  };

  isAccordionOpen = (id, hasAllFieldsEmpty) => {
    const {
      accordions,
      areAllAccordionsOpen,
    } = this.state;

    return accordions[id] === !hasAllFieldsEmpty && areAllAccordionsOpen;
  };

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);

      newState.accordions[id] = !newState.accordions[id];

      return newState;
    });
  };

  handleExpandAll = obj => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);

      newState.accordions = obj;
      newState.areAllAccordionsOpen = !newState.areAllAccordionsOpen;

      return newState;
    });
  };

  onCopy(item) {
    this.setState((state) => {
      const newState = cloneDeep(state);

      newState.copiedItem = omit(item, ['id', 'hrid', 'barcode']);
      newState.copiedItem.status = { name: 'Available' };

      return newState;
    });

    this.props.updateLocation({ layer: 'copyItem' });
  }

  handleConfirm = (item, requestRecords) => {
    const newItem = cloneDeep(item);

    set(newItem, ['status', 'name'], 'Missing');

    if (requestRecords.length) {
      const newRequestRecord = cloneDeep(requestRecords[0]);
      const itemStatus = get(newRequestRecord, ['item', 'status']);
      const holdShelfExpirationDate = get(newRequestRecord, ['holdShelfExpirationDate']);

      if (itemStatus === 'Awaiting pickup' && new Date(holdShelfExpirationDate) > new Date()) {
        this.props.mutator.requestOnItem.replace({ id: newRequestRecord.id });
        set(newRequestRecord, ['status'], 'Open - Not yet filled');
        this.props.mutator.requests.PUT(newRequestRecord);
      }
    }

    this.props.mutator.items.PUT(newItem)
      .then(() => this.setState({ itemMissingModal: false }));
  };

  hideMissingModal = () => {
    this.setState({ itemMissingModal: false });
  };

  hideConfirmDeleteItemModal = () => {
    this.setState({ confirmDeleteItemModal: false });
  };

  hideCannotDeleteItemModal = () => {
    this.setState({ cannotDeleteItemModal: false });
  };

  canDeleteItem = (item, request) => {
    const itemStatus = get(item, 'status.name');
    const {
      CHECKED_OUT,
      ON_ORDER,
    } = itemStatusesMap;
    let messageId;

    if (itemStatus === CHECKED_OUT) {
      messageId = 'ui-inventory.noItemDeleteModal.checkoutMessage';
    } else if (itemStatus === ON_ORDER) {
      messageId = 'ui-inventory.noItemDeleteModal.orderMessage';
    } else if (request) {
      messageId = 'ui-inventory.noItemDeleteModal.requestMessage';
    }

    const state = (messageId) ?
      {
        cannotDeleteItemModal: true,
        cannotDeleteItemModalMessageId: messageId,
      } :
      { confirmDeleteItemModal: true };

    this.setState(state);
  };

  getActionMenu = ({ onToggle }) => {
    const {
      resources,
      stripes,
    } = this.props;
    const firstItem = get(resources, 'items.records[0]');
    const request = get(resources, 'requests.records[0]');

    const newRequestLink = `/requests?itemId=${firstItem.id}&query=${firstItem.id}&layer=create`;

    const canCreate = stripes.hasPerm('ui-inventory.item.create');
    const canEdit = stripes.hasPerm('ui-inventory.item.edit');
    const canMarkAsMissing = stripes.hasPerm('ui-inventory.item.markasmissing');
    const canDelete = stripes.hasPerm('ui-inventory.item.delete');
    const canCreateNewRequest = stripes.hasPerm('ui-requests.create');

    if (!canCreate && !canEdit && !canDelete && !canCreateNewRequest) {
      return null;
    }

    return (
      <Fragment>
        { canEdit && (
        <Button
          href={this.craftLayerUrl('editItem')}
          onClick={() => {
            onToggle();
            this.onClickEditItem();
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-edit-item-action
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-inventory.editItem" />
          </Icon>
        </Button>
        )}
        { canCreate && (
        <Button
          id="clickable-copy-item"
          onClick={() => {
            onToggle();
            this.onCopy(firstItem);
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-duplicate-item-action
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-inventory.copyItem" />
          </Icon>
        </Button>
        )}
        { canDelete && (
        <Button
          id="clickable-delete-item"
          onClick={() => {
            onToggle();
            this.canDeleteItem(firstItem, request);
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-delete-item-action
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-inventory.deleteItem" />
          </Icon>
        </Button>
        )}
        { canMarkItemAsMissing(firstItem) && canMarkAsMissing && (
        <Button
          id="clickable-missing-item"
          onClick={() => {
            onToggle();
            this.setState({ itemMissingModal: true });
          }}
          buttonStyle="dropdownItem"
          data-test-mark-as-missing-item
        >
          <Icon icon="flag">
            <FormattedMessage id="ui-inventory.markAsMissing" />
          </Icon>
        </Button>
        )}
        { canCreateNewRequest && (
        <Button
          to={newRequestLink}
          buttonStyle="dropdownItem"
          data-test-inventory-create-request-action
        >
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-inventory.newRequest" />
          </Icon>
        </Button>
        )}
      </Fragment>
    );
  };

  isAwaitingResource = () => {
    const {
      items,
      holdingsRecords,
      instances1,
      loanTypes,
      callNumberTypes,
    } = this.props.resources;

    if (!items || !items.hasLoaded || !instances1 ||
      !instances1.hasLoaded || !holdingsRecords ||
      !holdingsRecords.hasLoaded) {
      return true;
    }

    if (!loanTypes || !loanTypes.hasLoaded ||
      !callNumberTypes || !callNumberTypes.hasLoaded) {
      return true;
    }

    return false;
  };

  render() {
    const {
      location,
      resources: {
        items,
        holdingsRecords,
        instances1,
        loanTypes,
        requests,
        callNumberTypes,
      },
      referenceTables,
      okapi,
      paneWidth,
    } = this.props;

    const {
      accordions,
      cannotDeleteItemModalMessageId,
      cannotDeleteItemModal,
      loan,
    } = this.state;

    referenceTables.loanTypes = (loanTypes || {}).records || [];
    referenceTables.callNumberTypes = (callNumberTypes || {}).records || [];

    if (this.isAwaitingResource()) {
      return <FormattedMessage id="ui-inventory.waitingForResources" />;
    }

    const instance = instances1.records[0];
    const item = items.records[0];
    const holdingsRecord = holdingsRecords.records[0];
    const { locationsById } = referenceTables;
    const permanentHoldingsLocation = locationsById[holdingsRecord.permanentLocationId];
    const temporaryHoldingsLocation = locationsById[holdingsRecord.temporaryLocationId];

    const requestRecords = (requests || {}).records || [];
    const query = location.search ? queryString.parse(location.search) : {};

    const detailMenu = (
      <IfPermission perm="ui-inventory.item.edit">
        <PaneMenu>
          <FormattedMessage id="ui-inventory.editItem">
            {ariaLabel => (
              <PaneHeaderIconButton
                icon="edit"
                id="clickable-edit-item"
                style={{ visibility: !item ? 'hidden' : 'visible' }}
                href={this.craftLayerUrl('editItem', location)}
                onClick={this.onClickEditItem}
                ariaLabel={ariaLabel}
                data-test-clickable-edit-item
              />
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );

    const requestsUrl = `/requests?filters=${requestStatusFiltersString}&query=${item.id}&sort=Request Date`;

    let loanLink = item.status.name;
    let borrowerLink = '-';

    if (this.state.loan && this.state.borrower) {
      loanLink = <Link to={`/users/view/${this.state.loan.userId}?filters=&layer=loan&loan=${this.state.loan.id}&query=&sort=`}>{item.status.name}</Link>;
      borrowerLink = <Link to={`/users/view/${this.state.loan.userId}`}>{this.state.borrower.barcode}</Link>;
    }

    if (loanLink === 'Awaiting pickup') {
      loanLink = (
        <Link to={requestsUrl}>
          {loanLink}
        </Link>
      );
    }

    const itemStatusDate = get(item, ['status', 'date']);

    const refLookup = (referenceTable, id) => {
      const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};

      return ref || {};
    };

    const emptyNotes = (
      <Row>
        <Col xs={1}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.staffOnly" />}
            value={noValue}
          />
        </Col>
        <Col xs={11}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.note" />}
            value={noValue}
          />
        </Col>
      </Row>
    );

    const layoutNotes = (noteTypes, notes) => {
      return noteTypes
        .filter(noteType => notes.find(note => note.itemNoteTypeId === noteType.id))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={1}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={get(item, ['notes'], []).map((note, j) => {
                    if (note.itemNoteTypeId === noteType.id) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }

                    return null;
                  })}
                />
              </Col>
              <Col xs={11}>
                <KeyValue
                  label={noteType.name}
                  value={get(item, ['notes'], []).map((note, j) => {
                    if (note.itemNoteTypeId === noteType.id) {
                      return <div key={j}>{note.note || noValue}</div>;
                    }

                    return null;
                  })}
                />
              </Col>
            </Row>
          );
        });
    };

    const layoutCirculationNotes = (noteTypes, notes) => {
      return noteTypes
        .filter(noteType => notes.find(note => note.noteType === noteType))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={1}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={get(item, ['circulationNotes'], []).map((note, j) => {
                    if (note.noteType === noteType) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }

                    return null;
                  })}
                />
              </Col>
              <Col xs={11}>
                <KeyValue
                  label={`${noteType} note`}
                  value={get(item, ['circulationNotes'], []).map((note, j) => {
                    if (note.noteType === noteType) {
                      return <div key={j}>{note.note || noValue}</div>;
                    }

                    return null;
                  })}
                />
              </Col>
            </Row>
          );
        });
    };

    const missingModalMessage = (
      <SafeHTMLMessage
        id="ui-inventory.missingModal.message"
        values={{
          title: item.title,
          barcode: item.barcode,
          materialType: upperFirst(get(item, ['materialType', 'name'], '')),
        }}
      />
    );

    const confirmDeleteItemModalMessage = (
      <SafeHTMLMessage
        id="ui-inventory.confirmItemDeleteModal.message"
        values={{
          hrid: item.hrid,
          barcode: item.barcode,
        }}
      />
    );

    const cannotDeleteItemFooter = (
      <Button
        data-test-cannot-delete-item-back-action
        onClick={this.hideCannotDeleteItemModal}
      >
        <FormattedMessage id="stripes-core.button.back" />
      </Button>
    );

    const administrativeData = {
      discoverySuppress: get(instance, 'discoverySuppress', '-'),
      hrid: get(item, 'hrid', '-'),
      barcode: get(item, 'barcode', '-'),
      accessionNumber: get(item, 'accessionNumber', '-'),
      identifier: get(item, 'itemIdentifier', '-'),
      formerIds: get(item, 'formerIds', []),
      statisticalCodeIds: get(item, 'statisticalCodeIds', []),
    };

    const itemData = {
      materialType: get(item, ['materialType', 'name'], '-'),
      callNumberType: refLookup(referenceTables.callNumberTypes, get(item, 'itemLevelCallNumberTypeId')).name || '-',
      callNumberPrefix: get(item, 'itemLevelCallNumberPrefix', '-'),
      callNumber: get(item, 'itemLevelCallNumber', '-'),
      callNumberSuffix: get(item, 'itemLevelCallNumberSuffix', '-'),
      copyNumbers: get(item, 'copyNumbers[0]', '-'),
      numberOfPieces: get(item, 'numberOfPieces', '-'),
      descriptionOfPieces: get(item, 'descriptionOfPieces', '-'),
    };

    const enumerationData = {
      enumeration: get(item, 'enumeration', '-'),
      chronology: get(item, 'chronology', '-'),
      volume: get(item, 'volume', '-'),
      yearCaption: get(item, 'yearCaption', []),
    };

    const condition = {
      numberOfMissingPieces: get(item, 'numberOfMissingPieces', '-'),
      missingPieces: get(item, 'missingPieces', '-'),
      missingPiecesDate: getDate(get(item, 'missingPiecesDate')),
      itemDamagedStatus: refLookup(referenceTables.itemDamagedStatuses, get(item, 'itemDamagedStatusId')).name || '-',
      itemDamagedStatusDate: getDate(get(item, 'itemDamagedStatusDate')),
    };

    const itemNotes = { notes: layoutNotes(referenceTables.itemNoteTypes, get(item, 'notes', [])) };

    const loanAndAvailability = {
      permanentLoanType: get(item, ['permanentLoanType', 'name'], '-'),
      temporaryLoanType: get(item, ['temporaryLoanType', 'name'], '-'),
      itemStatus: loanLink,
      itemStatusDate: getDate(itemStatusDate),
      requestLink: !isEmpty(requestRecords) ? <Link to={requestsUrl}>{requestRecords.length}</Link> : 0,
      borrower: borrowerLink,
      loanDate: loan ? getDate(loan.loanDate) : '-',
      dueDate: loan ? getDate(loan.dueDate) : '-',
      circulationNotes: layoutCirculationNotes(['Check out', 'Check in'], get(item, 'circulationNotes', [])),
    };

    const holdingLocation = {
      permanentLocation: get(permanentHoldingsLocation, 'name', '-'),
      temporaryLocation: get(temporaryHoldingsLocation, 'name', '-'),
    };

    const itemLocation = {
      permanentLocation: get(item, ['permanentLocation', 'name'], '-'),
      temporaryLocation: get(item, ['temporaryLocation', 'name'], '-'),
      effectiveLocation: get(item, ['effectiveLocation', 'name'], '-'),
    };

    const electronicAccess = { electronicAccess: get(item, 'electronicAccess', []) };

    const accordionsState = {
      acc01: areAllFieldsEmpty(values(administrativeData)),
      acc02: areAllFieldsEmpty(values(itemData)),
      acc03: areAllFieldsEmpty(values(enumerationData)),
      acc04: areAllFieldsEmpty(values(condition)),
      acc05: areAllFieldsEmpty(values(itemNotes)),
      acc06: areAllFieldsEmpty(values(loanAndAvailability)),
      acc07: areAllFieldsEmpty([...values(holdingLocation), ...values(itemLocation)]),
      acc08: areAllFieldsEmpty(values(electronicAccess)),
    };

    const statisticalCodeContent = !isEmpty(administrativeData.statisticalCodeIds)
      ? administrativeData.statisticalCodeIds.map(id => ({ codeId: id }))
      : [{ codeId: '-' }];

    const statisticalCodeFormatter = {
      'Statistical code type': x => refLookup(referenceTables.statisticalCodeTypes,
        refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name || noValue,
      'Statistical code': x => refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name || noValue,
    };

    const electronicAccessFormatter = {
      'URL relationship': x => refLookup(referenceTables.electronicAccessRelationships,
        get(x, ['relationshipId'])).name || noValue,
      'URI': x => (get(x, ['uri'])
        ? (
          <a
            href={get(x, ['uri'])}
            style={wrappingCell}
          >
            {get(x, ['uri'])}
          </a>)
        : noValue),
      'Link text': x => get(x, ['linkText']) || noValue,
      'Materials specified': x => get(x, ['materialsSpecification']) || noValue,
      'URL public note': x => get(x, ['publicNote']) || noValue,
    };

    const effectiveLocationDisplay = (
      <Col xs={4} smOffset={0}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
          value={checkIfElementIsEmpty(itemLocation.effectiveLocation)}
        />
      </Col>
    );

    return (
      <IntlConsumer>
        {intl => (
          <div>
            <ConfirmationModal
              data-test-missingConfirmation-modal
              open={this.state.itemMissingModal}
              heading={<FormattedMessage id="ui-inventory.missingModal.heading" />}
              message={missingModalMessage}
              onConfirm={() => this.handleConfirm(item, requestRecords)}
              onCancel={this.hideMissingModal}
              confirmLabel={<FormattedMessage id="ui-inventory.missingModal.confirm" />}
            />
            <ConfirmationModal
              id="confirmDeleteItemModal"
              data-test-confirm-delete-item-modal
              open={this.state.confirmDeleteItemModal}
              heading={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
              message={confirmDeleteItemModalMessage}
              onConfirm={() => { this.deleteItem(item); }}
              onCancel={this.hideConfirmDeleteItemModal}
              confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
            />
            {cannotDeleteItemModal && (
            <Modal
              id="cannotDeleteItemModal"
              data-test-cannot-delete-item-modal
              label={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
              open={cannotDeleteItemModal}
              footer={cannotDeleteItemFooter}
            >
              <SafeHTMLMessage
                id={cannotDeleteItemModalMessageId}
                values={{
                  hrid: item.hrid,
                  barcode: item.barcode,
                  status: item.status.name,
                }}
              />
            </Modal>
            )}
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.viewItem' })}
            >
              <Pane
                data-test-item-view-page
                defaultWidth={paneWidth}
                appIcon={(
                  <AppIcon
                    app="inventory"
                    iconKey="item"
                  />
)}
                paneTitle={(
                  <span data-test-header-item-title>
                    <FormattedMessage
                      id="ui-inventory.itemDotStatus"
                      values={{
                        barcode: get(item, 'barcode', ''),
                        status: get(item, 'status.name', ''),
                      }}
                    />
                  </span>
)}
                lastMenu={detailMenu}
                dismissible
                onClose={this.props.onCloseViewItem}
                actionMenu={this.getActionMenu}
              >
                <Row center="xs">
                  <Col sm={6}>
                    <FormattedMessage
                      id="ui-inventory.instanceTitle"
                      values={{ title: instance.title }}
                    />
                    {(instance.publication && instance.publication.length > 0) && (
                    <span>
                      <em>
                        {` ${instance.publication[0].publisher}`}
                        {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                      </em>
                    </span>
                    )}
                    <div>
                      <FormattedMessage
                        id="ui-inventory.holdingsTitle"
                        values={{
                          location: holdingLocation.permanentLocation,
                          callNumber: callNumberLabel(holdingsRecord),
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm={12}>
                    <AppIcon
                      app="inventory"
                      iconKey="item"
                      size="small"
                    />
                    {' '}
                    <FormattedMessage id="ui-inventory.itemRecord" />
                    {' '}
                    <AppIcon
                      app="inventory"
                      iconKey="material-type"
                      size="small"
                    />
                    {' '}
                    {get(item, ['materialType', 'name'], '')}
                    {' '}
                    <AppIcon
                      app="inventory"
                      iconKey="item-status"
                      size="small"
                    />
                    {' '}
                    {get(item, ['status', 'name'], '')}
                  </Col>
                </Row>
                <br />
                <Row>
                  {effectiveLocationDisplay}
                  <Col xs="8" />
                  <Col end="xs">
                    <ExpandAllButton
                      id="collapse-all"
                      accordionStatus={accordions}
                      onToggle={this.handleExpandAll}
                    />
                  </Col>
                </Row>
                <br />
                <Accordion
                  open={this.isAccordionOpen('acc01', accordionsState.acc01)}
                  id="acc01"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.administrativeData" />}
                >
                  <this.cViewMetaData metadata={item.metadata} />
                  <Row>
                    <Col xs={12}>
                      {item.discoverySuppress && <FormattedMessage id="ui-inventory.discoverySuppress" />}
                    </Col>
                  </Row>
                  {item.discoverySuppress && <br />}
                  <Row>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemHrid" />}
                        value={checkIfElementIsEmpty(administrativeData.hrid)}
                      />
                    </Col>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemBarcode" />}
                        value={checkIfElementIsEmpty(administrativeData.barcode)}
                      />
                    </Col>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.accessionNumber" />}
                        value={checkIfElementIsEmpty(administrativeData.accessionNumber)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemIdentifier" />}
                        value={checkIfElementIsEmpty(administrativeData.identifier)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={2}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.formerId" />}
                        value={convertArrayToBlocks(administrativeData.formerIds)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <MultiColumnList
                      id="item-list-statistical-codes"
                      contentData={statisticalCodeContent}
                      visibleColumns={['Statistical code type', 'Statistical code']}
                      columnMapping={{
                        'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                        'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                      }}
                      formatter={statisticalCodeFormatter}
                      ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
                      containerRef={ref => { this.resultsList = ref; }}
                    />
                  </Row>
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc02', accordionsState.acc02)}
                  id="acc02"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.itemData" />}
                >
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <strong>
                        <FormattedMessage id="ui-inventory.materialType" />
                      </strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3}>
                      <KeyValue value={checkIfElementIsEmpty(itemData.materialType)} />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <strong>
                        <FormattedMessage id="ui-inventory.itemCallNumber" />
                      </strong>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberType" />}
                        value={checkIfElementIsEmpty(itemData.callNumberType)}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                        value={checkIfElementIsEmpty(itemData.callNumberPrefix)}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumber" />}
                        value={checkIfElementIsEmpty(itemData.callNumber)}
                      />
                    </Col>
                    <Col sm={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                        value={checkIfElementIsEmpty(itemData.callNumberSuffix)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={2}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.copyNumber" />}
                        value={checkIfElementIsEmpty(itemData.copyNumbers)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={2}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
                        value={checkIfElementIsEmpty(itemData.numberOfPieces)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.descriptionOfPieces" />}
                        value={checkIfElementIsEmpty(itemData.descriptionOfPieces)}
                      />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc03', accordionsState.acc03)}
                  id="acc03"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.enumerationData" />}
                >
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.enumeration" />}
                        value={checkIfElementIsEmpty(enumerationData.enumeration)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.chronology" />}
                        value={checkIfElementIsEmpty(enumerationData.chronology)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.volume" />}
                        value={checkIfElementIsEmpty(enumerationData.volume)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={8}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.yearCaption" />}
                        value={convertArrayToBlocks(enumerationData.yearCaption)}
                      />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc04', accordionsState.acc04)}
                  id="acc04"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.condition" />}
                >
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.numberOfMissingPieces" />}
                        value={checkIfElementIsEmpty(condition.numberOfMissingPieces)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.missingPieces" />}
                        value={checkIfElementIsEmpty(condition.missingPieces)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.date" />}
                        value={checkIfElementIsEmpty(condition.missingPiecesDate)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
                        value={checkIfElementIsEmpty(condition.itemDamagedStatus)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.date" />}
                        value={checkIfElementIsEmpty(condition.itemDamagedStatusDate)}
                      />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc05', accordionsState.acc05)}
                  id="acc05"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.itemNotes" />}
                >
                  {!isEmpty(itemNotes.notes) ? itemNotes.notes : emptyNotes}
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc06', accordionsState.acc06)}
                  id="acc06"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
                >
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanentLoantype" />}
                        value={checkIfElementIsEmpty(loanAndAvailability.permanentLoanType)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporaryLoantype" />}
                        value={checkIfElementIsEmpty(loanAndAvailability.temporaryLoanType)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.itemStatus" />}
                        value={checkIfElementIsEmpty(loanAndAvailability.itemStatus)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.itemStatusDate" />}>
                        {checkIfElementIsEmpty(loanAndAvailability.itemStatusDate)}
                      </KeyValue>
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.requests" />}
                        value={checkIfElementIsEmpty(loanAndAvailability.requestLink)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.item.availability.borrower" />}
                        value={checkIfElementIsEmpty(loanAndAvailability.borrower)}
                      />
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.loanDate" />}>
                        {checkIfElementIsEmpty(loanAndAvailability.loanDate)}
                      </KeyValue>
                    </Col>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.dueDate" />}>
                        {checkIfElementIsEmpty(loanAndAvailability.dueDate)}
                      </KeyValue>
                    </Col>
                  </Row>
                  {!isEmpty(loanAndAvailability.circulationNotes) ? loanAndAvailability.circulationNotes : emptyNotes}
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc07', accordionsState.acc07)}
                  id="acc07"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.location" />}
                >
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <strong>
                        <FormattedMessage id="ui-inventory.holdingsLocation" />
                      </strong>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                        value={checkIfElementIsEmpty(holdingLocation.permanentLocation)}
                      />
                    </Col>
                    <Col sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                        value={checkIfElementIsEmpty(holdingLocation.temporaryLocation)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <strong>
                        <FormattedMessage id="ui-inventory.itemLocation" />
                      </strong>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                        value={checkIfElementIsEmpty(itemLocation.permanentLocation)}
                      />
                    </Col>
                    <Col sm={4}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                        value={checkIfElementIsEmpty(itemLocation.temporaryLocation)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    {effectiveLocationDisplay}
                  </Row>
                </Accordion>
                <Accordion
                  open={this.isAccordionOpen('acc08', accordionsState.acc08)}
                  id="acc08"
                  onToggle={this.handleAccordionToggle}
                  label={<FormattedMessage id="ui-inventory.electronicAccess" />}
                >
                  <MultiColumnList
                    id="item-list-electronic-access"
                    contentData={checkIfArrayIsEmpty(electronicAccess.electronicAccess)}
                    visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                    columnMapping={{
                      'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
                      'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
                      'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
                      'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
                      'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
                    }}
                    columnWidths={{
                      'URL relationship': '16%',
                      'URI': '16%',
                      'Link text': '16%',
                      'Materials specified': '16%',
                      'URL public note': '32%',
                    }}
                    formatter={electronicAccessFormatter}
                    ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
                    containerRef={ref => { this.resultsList = ref; }}
                  />
                </Accordion>
              </Pane>
            </Layer>
            <Layer
              isOpen={query.layer ? query.layer === 'editItem' : false}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editItemDialog' })}
            >
              <ItemForm
                form={`itemform_${item.id}`}
                onSubmit={(record) => { this.saveItem(record); }}
                initialValues={item}
                onCancel={this.onClickCloseEditItem}
                okapi={okapi}
                instance={instance}
                holdingsRecord={holdingsRecord}
                referenceTables={referenceTables}
                stripes={this.props.stripes}
              />
            </Layer>
            <Layer
              isOpen={query.layer === 'copyItem'}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.copyItemDialog' })}
            >
              <ItemForm
                form={`itemform_${holdingsRecord.id}`}
                onSubmit={(record) => { this.copyItem(record); }}
                initialValues={this.state.copiedItem}
                onCancel={this.onClickCloseEditItem}
                okapi={okapi}
                instance={instance}
                copy
                holdingsRecord={holdingsRecord}
                referenceTables={referenceTables}
                stripes={this.props.stripes}
              />
            </Layer>
          </div>
        )
        }
      </IntlConsumer>
    );
  }
}

ViewItem.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    loanTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    requests: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    loans: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    items: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    holdingsRecords: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    callNumberTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    borrower: PropTypes.object,
  }).isRequired,
  okapi: PropTypes.object,
  location: PropTypes.object,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    items: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }),
    requests: PropTypes.shape({ PUT: PropTypes.func.isRequired }),
    requestOnItem: PropTypes.shape({ replace: PropTypes.func.isRequired }),
    query: PropTypes.object.isRequired,
  }),
  onCloseViewItem: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default withLocation(stripesConnect(ViewItem));
