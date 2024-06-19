import {
  get,
  cloneDeep,
  map,
  isEmpty,
  values,
  sortBy,
  flowRight,
} from 'lodash';
import { parameterize } from 'inflected';

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { effectiveCallNumber } from '@folio/stripes/util';

import {
  Pane,
  Paneset,
  Row,
  Col,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  KeyValue,
  MultiColumnList,
  Button,
  Icon,
  ConfirmationModal,
  Modal,
  MessageBanner,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
  InfoPopover,
  Layout,
  MenuSection,
} from '@folio/stripes/components';

import {
  ViewMetaData,
  ClipCopy,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  IfPermission,
  IntlConsumer,
  CalloutContext,
  checkIfUserInCentralTenant,
  stripesConnect,
} from '@folio/stripes/core';

import { requestsStatusString } from '../Instance/ViewRequests/utils';

import ModalContent from '../components/ModalContent';
import { ItemAcquisition } from '../Item/ViewItem/ItemAcquisition';
import {
  craftLayerUrl,
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canMarkRequestAsOpen,
  canCreateNewRequest,
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  convertArrayToBlocks,
  getDate,
  getDateWithTime,
  checkIfArrayIsEmpty,
  handleKeyCommand,
  switchAffiliation,
} from '../utils';
import withLocation from '../withLocation';
import {
  itemStatusesMap,
  itemStatusMutators,
  noValue,
  REQUEST_OPEN_STATUSES,
  NOT_REMOVABLE_ITEM_STATUSES,
  wrappingCell,
  actionMenuDisplayPerms,
  ITEM_ACCORDIONS,
  ITEM_ACCORDION_LABELS,
} from '../constants';
import ItemStatus from './ItemStatus';
import {
  WarningMessage,
  AdministrativeNoteList,
  ItemViewSubheader,
  PaneLoading,
  BoundPiecesList,
} from '../components';

export const requestStatusFiltersString = map(REQUEST_OPEN_STATUSES, requestStatus => `requestStatus.${requestStatus}`).join(',');

class ItemView extends React.Component {
  static manifest = Object.freeze({
    query: {},
    itemsResource: {
      type: 'okapi',
      path: 'inventory/items/:{itemid}',
      POST: { path: 'inventory/items' },
      resourceShouldRefresh: true,
      tenant: '!{tenantTo}',
    },
    markItemAsWithdrawn: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-withdrawn',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markItemAsMissing: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-missing',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsInProcess: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-in-process',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsInProcessNonRequestable: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-in-process-non-requestable',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsIntellectualItem: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-intellectual-item',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsLongMissing: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-long-missing',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsRestricted: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-restricted',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsUnavailable: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-unavailable',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    markAsUnknown: {
      type: 'okapi',
      POST: {
        path: 'inventory/items/:{itemid}/mark-unknown',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      tenant: '!{tenantTo}',
    },
    instanceRecords: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      resourceShouldRefresh: true,
    },
    servicePoints: {
      type: 'okapi',
      path: 'service-points',
      records: 'servicepoints',
      params: (_q, _p, _r, _l, props) => {
        // Only one service point is of interest here: the SP used for the item's last check-in
        // (if the item has a check-in). Iff that service point ID is found, add a query param
        // to filter down to that one service point in the records returned.
        const servicePointId = get(props.resources, 'itemsResource.records[0].lastCheckIn.servicePointId', '');
        const query = servicePointId && `id==${servicePointId}`;
        return query ? { query } : {};
      },
      resourceShouldRefresh: true,
    },
    staffMembers: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      params: (_q, _p, _r, _l, props) => {
        const staffMemberId = get(props.resources, 'itemsResource.records[0].lastCheckIn.staffMemberId', '');
        const query = staffMemberId && `id==${staffMemberId}`;

        return query ? { query } : null;
      },
      resourceShouldRefresh: true,
    },
    // return a count of the requests matching the given item and status
    requests: {
      type: 'okapi',
      path: `circulation/requests?query=(itemId==:{itemid}) and status==(${requestsStatusString}) sortby requestDate desc&limit=1`,
      records: 'requests',
      PUT: { path: 'circulation/requests/%{requestOnItem.id}' },
    },
    openLoans: {
      type: 'okapi',
      path: 'circulation/loans',
      params: {
        query: 'status.name=="Open" and itemId==:{itemid}',
      },
      records: 'loans',
    },
    requestOnItem: {},
    tagSettings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==TAGS and configName==tags_enabled)',
    },
  });

  static contextType = CalloutContext;

  constructor(props) {
    super(props);
    this.state = {
      itemMissingModal: false,
      itemWithdrawnModal: false,
      confirmDeleteItemModal: false,
      cannotDeleteItemModal: false,
      selectedItemStatus: '',
    };

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.accordionStatusRef = createRef();
  }

  onClickEditItem = e => {
    if (e) e.preventDefault();

    const {
      stripes,
      location,
    } = this.props;
    const tenantFrom = location?.state?.tenantFrom || stripes.okapi.tenant;
    const { id, holdingsrecordid, itemid } = this.props.match.params;

    this.props.history.push({
      pathname: `/inventory/edit/${id}/${holdingsrecordid}/${itemid}`,
      search: this.props.location.search,
      state: { tenantFrom }
    });
  };

  onClickCloseEditItem = e => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  };

  saveItem = item => {
    if (!item.barcode) {
      delete item.barcode;
    }

    return this.props.mutator.itemsResource.PUT(item).then(() => {
      this.context.sendCallout({
        type: 'success',
        message: <FormattedMessage
          id="ui-inventory.item.successfullySaved"
          values={{ hrid: item.hrid }}
        />,
      });
      this.onClickCloseEditItem();
    });
  };

  copyItem = item => {
    const { resources: { holdingsRecords, instanceRecords } } = this.props;
    const holdingsRecord = holdingsRecords.records[0];
    const instance = instanceRecords.records[0];

    this.props.mutator.itemsResource.POST(item).then((data) => {
      this.props.goTo(`/inventory/view/${instance.id}/${holdingsRecord.id}/${data.id}`);
    });
  };

  goBack = (tenantTo) => {
    const {
      match: { params: { id } },
      location: { search },
      history,
    } = this.props;

    history.push({
      pathname: `/inventory/view/${id}`,
      search,
      state: { tenantTo },
    });
  }

  onCloseViewItem = async () => {
    const {
      stripes,
      location,
    } = this.props;
    const tenantFrom = location?.state?.tenantFrom || stripes.okapi.tenant;

    await switchAffiliation(stripes, tenantFrom, () => this.goBack(tenantFrom));
  }

  deleteItem = item => {
    this.onCloseViewItem();
    this.props.mutator.itemsResource.DELETE(item);
  };

  onCopy() {
    const { stripes, location } = this.props;
    const { itemid, id, holdingsrecordid } = this.props.match.params;
    const tenantFrom = location?.state?.tenantFrom || stripes.okapi.tenant;

    this.props.history.push({
      pathname: `/inventory/copy/${id}/${holdingsrecordid}/${itemid}`,
      search: this.props.location.search,
      state: { tenantFrom },
    });
  }

  markItemAsMissing = () => {
    this.markRequestAsOpen();
    this.props.mutator.markItemAsMissing.POST({}).then(
      () => this.setState({ itemMissingModal: false })
    );
  }

  markItemAsWithdrawn = () => {
    this.props.mutator.markItemAsWithdrawn.POST({}).then(
      () => this.setState({ itemWithdrawnModal: false })
    );
  }

  markItemWithStatus = status => {
    const {
      mutator: {
        [itemStatusMutators[status]]: {
          POST,
        },
      },
    } = this.props;

    POST({}).then(this.clearSelectedItemStatus);
  }

  markRequestAsOpen() {
    const request = this.props.resources?.requests?.records?.[0];

    if (canMarkRequestAsOpen(request)) {
      const newRequestRecord = cloneDeep(request);

      newRequestRecord.status = REQUEST_OPEN_STATUSES.OPEN_NOT_YET_FILLED;
      this.props.mutator.requestOnItem.replace({ id: newRequestRecord.id });
      this.props.mutator.requests.PUT(newRequestRecord);
    }
  }

  hideMissingModal = () => {
    this.setState({ itemMissingModal: false });
  };

  hideWithdrawnModal = () => {
    this.setState({ itemWithdrawnModal: false });
  };

  clearSelectedItemStatus = () => {
    this.setState({ selectedItemStatus: '' });
  };

  hideConfirmDeleteItemModal = () => {
    this.setState({ confirmDeleteItemModal: false });
  };

  hideCannotDeleteItemModal = () => {
    this.setState({ cannotDeleteItemModal: false });
  };

  canDeleteItem = (item, request) => {
    const itemStatus = get(item, 'status.name');
    const { ON_ORDER } = itemStatusesMap;
    let messageId;

    if (NOT_REMOVABLE_ITEM_STATUSES.includes(itemStatus)) {
      messageId = 'ui-inventory.noItemDeleteModal.statusMessage';
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
    const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

    if (isUserInCentralTenant) return null;

    const firstItem = get(resources, 'itemsResource.records[0]');
    const request = get(resources, 'requests.records[0]');
    const newRequestLink = `/requests?itemId=${firstItem.id}&query=${firstItem.id}&layer=create`;
    const userHasPermToCreate = stripes.hasPerm('ui-inventory.item.create');
    const userHasPermToEdit = stripes.hasPerm('ui-inventory.item.edit');
    const userHasPermToMarkAsMissing = stripes.hasPerm('ui-inventory.item.markasmissing');
    const userHasPermToMarkAsWithdrawn = stripes.hasPerm('ui-inventory.items.mark-items-withdrawn');
    const userHasPermToDelete = stripes.hasPerm('ui-inventory.item.delete');
    const userHasPermToObserveActionMenu = actionMenuDisplayPerms.some(perm => stripes.hasPerm(perm));

    const userCanMarkItemAsMissing = canMarkItemAsMissing(firstItem);
    const userCanMarkItemAsWithdrawn = canMarkItemAsWithdrawn(firstItem);
    const userCanMarkItemWithStatus = canMarkItemWithStatus(firstItem);
    const userCanCreateNewRequest = canCreateNewRequest(firstItem, stripes);

    if (!userHasPermToObserveActionMenu) {
      return null;
    }

    const editActionItem = (
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
    );
    const duplicateActionItem = (
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
    );
    const deleteActionItem = (
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
    );
    const newRequestActionItem = (
      <Button
        to={newRequestLink}
        buttonStyle="dropdownItem"
        data-test-inventory-create-request-action
      >
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.newRequest" />
        </Icon>
      </Button>
    );
    const markAsMissingActionItem = (
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
          <FormattedMessage id="ui-inventory.item.status.missing" />
        </Icon>
      </Button>
    );
    const markAsWithdrawnActionItem = (
      <Button
        id="clickable-withdrawn-item"
        onClick={() => {
          onToggle();
          this.setState({ itemWithdrawnModal: true });
        }}
        buttonStyle="dropdownItem"
        data-test-mark-as-withdrawn-item
      >
        <Icon icon="flag">
          <FormattedMessage id="ui-inventory.item.status.withdrawn" />
        </Icon>
      </Button>
    );
    const renderItemStatusActionItems = () => Object.keys(itemStatusMutators)
      .filter(status => itemStatusesMap[status] !== firstItem?.status?.name)
      .map(status => {
        const itemStatus = itemStatusesMap[status];
        const parameterizedStatus = parameterize(itemStatus);

        const actionMenuItem = (
          <Button
            key={status}
            id={`clickable-${parameterizedStatus}`}
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              this.setState({ selectedItemStatus: status });
            }}
          >
            <Icon icon="flag">
              { itemStatus }
            </Icon>
          </Button>
        );
        return (
          <IfPermission
            perm={`ui-inventory.items.mark-${parameterizedStatus}`}
            key={parameterizedStatus}
          >
            {actionMenuItem}
          </IfPermission>
        );
      });

    const isMarkAsMenuSectionVisible = (userCanMarkItemAsMissing && userHasPermToMarkAsMissing)
      || (userHasPermToMarkAsWithdrawn && userCanMarkItemAsWithdrawn)
      || userCanMarkItemWithStatus;

    return (
      <>
        <MenuSection id="items-list-actions">
          {userHasPermToEdit && editActionItem}
          {userHasPermToCreate && duplicateActionItem}
          {userHasPermToDelete && deleteActionItem}
          {userCanCreateNewRequest && newRequestActionItem}
        </MenuSection>
        {isMarkAsMenuSectionVisible && (
          <MenuSection
            id="items-list-mark-as"
            label={<FormattedMessage id="ui-inventory.markAsHeader" />}
            labelTag="h3"
          >
            {userCanMarkItemAsMissing && userHasPermToMarkAsMissing && markAsMissingActionItem}
            {userCanMarkItemAsWithdrawn && userHasPermToMarkAsWithdrawn && markAsWithdrawnActionItem}
            {userCanMarkItemWithStatus && renderItemStatusActionItems()}
          </MenuSection>
        )}
      </>
    );
  };

  isLoading = () => {
    const {
      resources: {
        instanceRecords,
        itemsResource,
        holdingsRecords,
      },
    } = this.props;

    return !itemsResource?.hasLoaded || !instanceRecords?.hasLoaded || !holdingsRecords?.hasLoaded;
  }

  render() {
    if (this.isLoading()) {
      return <PaneLoading defaultWidth="100%" />;
    }

    const {
      resources: {
        itemsResource,
        holdingsRecords,
        instanceRecords,
        requests,
        staffMembers,
        servicePoints,
        openLoans,
        tagSettings,
      },
      referenceTables,
      goTo,
      stripes,
    } = this.props;

    const {
      cannotDeleteItemModalMessageId,
      cannotDeleteItemModal,
      itemMissingModal,
      itemWithdrawnModal,
      selectedItemStatus,
      confirmDeleteItemModal,
    } = this.state;

    const {
      MISSING,
      WITHDRAWN,
    } = itemStatusesMap;

    const staffMember = get(staffMembers, 'records[0]');
    const openLoan = get(openLoans, 'records[0]');
    const source = staffMember ?
      <Link to={`/users/view/${staffMember.id}`}>
        {`${staffMember.personal.lastName}, ${staffMember.personal.firstName} ${staffMember.personal.middleName || ''}`}
      </Link> :
      '-';

    const instance = instanceRecords.records[0];
    const item = itemsResource.records[0] || {};
    const holdingsRecord = holdingsRecords.records[0];
    const { locationsById } = referenceTables;
    const permanentHoldingsLocation = locationsById[holdingsRecord.permanentLocationId];
    const temporaryHoldingsLocation = locationsById[holdingsRecord.temporaryLocationId];
    const tagsEnabled = !tagSettings?.records?.length || tagSettings?.records?.[0]?.value === 'true';

    const requestCount = requests.other?.totalRecords ?? 0;

    const requestsUrl = `/requests?filters=${requestStatusFiltersString}&query=${item.id}&sort=Request Date`;

    let borrowerLink = '-';

    if (openLoan) {
      borrowerLink = <Link to={`/users/view/${openLoan.userId}`}>{openLoan.borrower.barcode}</Link>;
    }

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

    const confirmDeleteItemModalMessage = (
      <FormattedMessage
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
      copyNumber: get(item, 'copyNumber', '-'),
      numberOfPieces: get(item, 'numberOfPieces', '-'),
      descriptionOfPieces: get(item, 'descriptionOfPieces', '-'),
      effectiveShelvingOrder: get(item, 'effectiveShelvingOrder', '-'),
    };

    const enumerationData = {
      displaySummary: get(item, 'displaySummary', '-'),
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
      itemStatusDate: getDateWithTime(item?.status?.date),
      requestLink: requestCount ? <Link to={requestsUrl}>{requestCount}</Link> : 0,
      borrower: borrowerLink,
      loanDate: openLoan ? getDateWithTime(openLoan.loanDate) : '-',
      dueDate: openLoan ? getDateWithTime(openLoan.dueDate) : '-',
      circulationNotes: layoutCirculationNotes(['Check out', 'Check in'], get(item, 'circulationNotes', [])),
    };

    const holdingLocation = {
      permanentLocation: {
        name: get(permanentHoldingsLocation, 'name', '-'),
        isActive: permanentHoldingsLocation?.isActive,
      },
      temporaryLocation: {
        name: get(temporaryHoldingsLocation, 'name', '-'),
        isActive: temporaryHoldingsLocation?.isActive,
      },
    };

    const itemLocation = {
      permanentLocation: {
        name: get(item, ['permanentLocation', 'name'], '-'),
        isActive: locationsById[item.permanentLocation?.id]?.isActive,
      },
      temporaryLocation: {
        name: get(item, ['temporaryLocation', 'name'], '-'),
        isActive: locationsById[item.temporaryLocation?.id]?.isActive,
      },
      effectiveLocation: {
        name: get(item, ['effectiveLocation', 'name'], '-'),
        isActive: locationsById[item.effectiveLocation.id]?.isActive,
      },
    };

    const electronicAccess = { electronicAccess: get(item, 'electronicAccess', []) };

    const checkInDate = getDateWithTime(get(item, ['lastCheckIn', 'dateTime']));

    const servicePointName = checkInDate === '-' ? '-' : get(servicePoints, 'records[0].name', '-');

    const circulationHistory = {
      checkInDate,
      servicePointName,
      source,
    };

    item.boundWithTitles = sortBy(
      item?.boundWithTitles,
      [(boundWithTitle) => {
        return boundWithTitle?.briefHoldingsRecord?.id === item?.holdingsRecordId ? 0 : 1;
      }]
    );
    const boundWithTitles = item?.boundWithTitles;

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(values(administrativeData)),
      acc02: !areAllFieldsEmpty(values(itemData)),
      acc03: !areAllFieldsEmpty(values(enumerationData)),
      acc04: !areAllFieldsEmpty(values(condition)),
      acc05: !areAllFieldsEmpty(values(itemNotes)),
      acc06: !areAllFieldsEmpty(values(loanAndAvailability)),
      acc07: !areAllFieldsEmpty([...values(holdingLocation), ...values(itemLocation)]),
      acc08: !areAllFieldsEmpty(values(electronicAccess)),
      acc09: !areAllFieldsEmpty(values(circulationHistory)),
      acc10: !areAllFieldsEmpty(values(boundWithTitles)),
      itemAcquisitionAccordion: true,
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
      'URI': x => {
        const uri = x?.uri;

        return uri
          ? (
            <a
              href={uri}
              rel="noreferrer noopener"
              target="_blank"
              style={wrappingCell}
            >
              {uri}
            </a>
          )
          : noValue;
      },
      'Link text': x => get(x, ['linkText']) || noValue,
      'Materials specified': x => get(x, ['materialsSpecification']) || noValue,
      'URL public note': x => get(x, ['publicNote']) || noValue,
    };

    const boundWithTitleFormatter = {
      'Instance HRID': x => {
        return (
          <Link
            to={`/inventory/view/${x.briefInstance?.id}`}
            className="instanceHrid"
          >
            <span>{x.briefInstance?.hrid}</span>
          </Link>
        );
      },
      'Instance title': x => x.briefInstance?.title,
      'Holdings HRID': x => {
        return (
          <Link
            to={`/inventory/view/${x.briefInstance?.id}/${x.briefHoldingsRecord?.id}`}
            className="holdingsRecordHrid"
          >
            <span>{x.briefHoldingsRecord?.hrid}</span>
          </Link>
        );
      },
    };

    const effectiveLocationDisplay = (
      <Col xs={2}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
          value={checkIfElementIsEmpty(itemLocation.effectiveLocation.name)}
          subValue={!itemLocation.effectiveLocation?.isActive &&
            <FormattedMessage id="ui-inventory.inactive" />
          }
          data-testid="item-effective-location"
        />
      </Col>
    );

    const shortcuts = [
      {
        name: 'edit',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.item.edit')) this.onClickEditItem();
        }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'search',
        handler: handleKeyCommand(() => goTo('/inventory')),
      },
      {
        name: 'duplicateRecord',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.item.create')) this.onCopy();
        }),
      },
    ];

    const itemRecord = this.props.resources.itemsResource.records[0];
    // getEntity needs to return an object from a closure so that Tags can compare old and new entity versions
    const getEntity = () => itemRecord;
    const getEntityTags = () => itemRecord?.tags?.tagList || [];

    return (
      <IntlConsumer>
        {intl => (
          <HasCommand
            commands={shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            <Paneset isRoot>
              <Pane
                data-test-item-view-page
                defaultWidth="100%"
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
                paneSub={(
                  <FormattedMessage
                    id="ui-inventory.instanceRecordSubtitle"
                    values={{
                      hrid: item?.hrid,
                      updatedDate: getDate(item?.metadata?.updatedDate),
                    }}
                  />
                )}
                dismissible
                onClose={this.onCloseViewItem}
                actionMenu={this.getActionMenu}
              >

                <Modal
                  data-test-missingConfirmation-modal
                  open={itemMissingModal}
                  label={<FormattedMessage id="ui-inventory.missingModal.heading" />}
                  dismissible
                  size="small"
                  onClose={this.hideMissingModal}
                >
                  <ModalContent
                    item={item}
                    itemRequestCount={requestCount}
                    status={MISSING}
                    requestsUrl={requestsUrl}
                    onConfirm={this.markItemAsMissing}
                    onCancel={this.hideMissingModal}
                  />
                </Modal>
                <Modal
                  data-test-withdrawn-confirmation-modal
                  open={itemWithdrawnModal}
                  label={<FormattedMessage id="ui-inventory.withdrawnModal.heading" />}
                  dismissible
                  size="small"
                  onClose={this.hideWithdrawnModal}
                >
                  <ModalContent
                    item={item}
                    itemRequestCount={requestCount}
                    status={WITHDRAWN}
                    requestsUrl={requestsUrl}
                    onConfirm={this.markItemAsWithdrawn}
                    onCancel={this.hideWithdrawnModal}
                  />
                </Modal>
                <Modal
                  data-test-item-status-modal
                  open={!!selectedItemStatus}
                  label={<FormattedMessage
                    id="ui-inventory.itemStatusModal.heading"
                    values={{ itemStatus: itemStatusesMap[selectedItemStatus] }}
                  />}
                  dismissible
                  size="small"
                  onClose={this.clearSelectedItemStatus}
                >
                  <ModalContent
                    item={item}
                    itemRequestCount={requestCount}
                    status={itemStatusesMap[selectedItemStatus]}
                    requestsUrl={requestsUrl}
                    onConfirm={() => this.markItemWithStatus(selectedItemStatus)}
                    onCancel={this.clearSelectedItemStatus}
                  />
                </Modal>
                <ConfirmationModal
                  id="confirmDeleteItemModal"
                  data-test-confirm-delete-item-modal
                  open={confirmDeleteItemModal}
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
                  <FormattedMessage
                    id={cannotDeleteItemModalMessageId}
                    values={{
                      hrid: item.hrid,
                      barcode: item.barcode,
                      status: item.status.name,
                    }}
                  />
                </Modal>
                )}
                <ItemViewSubheader
                  item={item}
                  instance={instance}
                  holdingsRecord={holdingsRecord}
                  holdingLocation={holdingLocation}
                />
                <br />
                <AccordionStatus ref={this.accordionStatusRef}>
                  <Row>
                    {effectiveLocationDisplay}
                    <Col xs={2}>
                      <Layout className="display-flex flex-align-items-start">
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                          value={effectiveCallNumber(item)}
                        />
                        <InfoPopover
                          iconSize="medium"
                          content={<FormattedMessage id="ui-inventory.info.effectiveCallNumber" />}
                          buttonProps={{ 'data-testid': 'info-icon-effective-call-number' }}
                        />
                      </Layout>
                    </Col>
                    <Col xs={7}>
                      <Row middle="xs">
                        <MessageBanner show={Boolean(item.discoverySuppress)} type="warning">
                          <FormattedMessage id="ui-inventory.warning.item.suppressedFromDiscovery" />
                        </MessageBanner>
                      </Row>
                    </Col>
                    <Col xs={1}>
                      <Row end="xs">
                        <Col>
                          <ExpandAllButton />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <AccordionSet initialStatus={initialAccordionsState}>
                    <Accordion
                      id="acc01"
                      label={<FormattedMessage id="ui-inventory.administrativeData" />}
                    >
                      <ViewMetaData metadata={item.metadata} />
                      <Row>
                        <Col xs={12}>
                          {item.discoverySuppress && <WarningMessage id="ui-inventory.discoverySuppressed" />}
                        </Col>
                      </Row>
                      {item.discoverySuppress && <br />}
                      <Row>
                        <Col xs={2}>
                          <KeyValue label={<FormattedMessage id="ui-inventory.itemHrid" />}>
                            {checkIfElementIsEmpty(administrativeData.hrid)}
                            {Boolean(administrativeData.hrid) && <ClipCopy text={administrativeData.hrid} />}
                          </KeyValue>
                        </Col>
                        <Col xs={2}>
                          <KeyValue label={<FormattedMessage id="ui-inventory.itemBarcode" />}>
                            {checkIfElementIsEmpty(administrativeData.barcode)}
                            {Boolean(administrativeData.barcode) && <ClipCopy text={administrativeData.barcode} />}
                          </KeyValue>
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
                      <Row>
                        <Col xs={12}>
                          <AdministrativeNoteList administrativeNotes={item.administrativeNotes} />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion
                      id="acc02"
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
                        <Col sm={3}>
                          <Layout className="display-flex flex-align-items-start">
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                              value={checkIfElementIsEmpty(itemData.effectiveShelvingOrder)}
                            />
                            <InfoPopover
                              iconSize="medium"
                              content={<FormattedMessage id="ui-inventory.info.shelvingOrder" />}
                              buttonProps={{ 'data-testid': 'info-icon-shelving-order' }}
                            />
                          </Layout>
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
                            value={checkIfElementIsEmpty(itemData.copyNumber)}
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
                      id="acc03"
                      label={<FormattedMessage id="ui-inventory.enumerationData" />}
                    >
                      <Row>
                        <Col
                          smOffset={0}
                          sm={4}
                        >
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.displaySummary" />}
                            value={checkIfElementIsEmpty(enumerationData.displaySummary)}
                          />
                        </Col>
                      </Row>
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
                      id="acc04"
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

                    {tagsEnabled && (
                      <TagsAccordion
                        link={`inventory/items/${item.id}`}
                        getEntity={getEntity}
                        getEntityTags={getEntityTags}
                        entityTagsPath="tags"
                        hasOptimisticLocking
                      />
                    )}

                    <Accordion
                      id="acc05"
                      label={<FormattedMessage id="ui-inventory.itemNotes" />}
                    >
                      {!isEmpty(itemNotes.notes) ? itemNotes.notes : emptyNotes}
                    </Accordion>
                    <Accordion
                      id="acc06"
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
                          <ItemStatus
                            itemId={item.id}
                            status={item.status}
                            openLoan={openLoan}
                          />
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
                      id="acc07"
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
                            value={checkIfElementIsEmpty(holdingLocation.permanentLocation.name)}
                            subValue={!holdingLocation.permanentLocation?.isActive &&
                              <FormattedMessage id="ui-inventory.inactive" />
                            }
                            data-testid="holding-permanent-location"
                          />
                        </Col>
                        <Col sm={4}>
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                            value={checkIfElementIsEmpty(holdingLocation.temporaryLocation.name)}
                            subValue={holdingLocation.temporaryLocation?.isActive === false &&
                              <FormattedMessage id="ui-inventory.inactive" />
                            }
                            data-testid="holding-temporary-location"
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
                            value={checkIfElementIsEmpty(itemLocation.permanentLocation.name)}
                            subValue={itemLocation.permanentLocation?.isActive === false &&
                              <FormattedMessage id="ui-inventory.inactive" />
                            }
                            data-testid="item-permanent-location"
                          />
                        </Col>
                        <Col sm={4}>
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                            value={checkIfElementIsEmpty(itemLocation.temporaryLocation.name)}
                            subValue={itemLocation.temporaryLocation?.isActive === false &&
                              <FormattedMessage id="ui-inventory.inactive" />
                            }
                            data-testid="item-temporary-location"
                          />
                        </Col>
                      </Row>
                      <Row>
                        {effectiveLocationDisplay}
                      </Row>
                    </Accordion>

                    {
                      item.purchaseOrderLineIdentifier && (
                        <ItemAcquisition
                          itemId={item.id}
                          accordionId="itemAcquisitionAccordion"
                        />
                      )
                    }

                    <Accordion
                      id="acc08"
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
                    <Accordion
                      id="acc09"
                      label={<FormattedMessage id="ui-inventory.circulationHistory" />}
                    >
                      <Row>
                        <Col
                          smOffset={0}
                          sm={4}
                        >
                          <FormattedMessage
                            tagName="strong"
                            id="ui-inventory.mostRecentCheckIn"
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm={4}>
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.checkInDate" />}
                            value={checkIfElementIsEmpty(circulationHistory.checkInDate)}
                          />
                        </Col>
                        <Col sm={4}>
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.servicePoint" />}
                            value={checkIfElementIsEmpty(circulationHistory.servicePointName)}
                          />
                        </Col>
                        <Col sm={4}>
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.source" />}
                            value={checkIfElementIsEmpty(circulationHistory.source)}
                          />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion
                      id="acc10"
                      label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
                    >
                      <MultiColumnList
                        id="item-list-bound-with-titles"
                        contentData={checkIfArrayIsEmpty(boundWithTitles)}
                        visibleColumns={['Instance HRID', 'Instance title', 'Holdings HRID']}
                        columnMapping={{
                          'Instance HRID': intl.formatMessage({ id: 'ui-inventory.instanceHrid' }),
                          'Instance title': intl.formatMessage({ id: 'ui-inventory.instanceTitleLabel' }),
                          'Holdings HRID': intl.formatMessage({ id: 'ui-inventory.holdingsHrid' }),
                        }}
                        formatter={boundWithTitleFormatter}
                        ariaLabel={intl.formatMessage({ id: 'ui-inventory.boundWithTitles' })}
                      />
                    </Accordion>
                    <Accordion
                      id={ITEM_ACCORDIONS.boundItems}
                      label={ITEM_ACCORDION_LABELS.boundItems}
                    >
                      <BoundPiecesList
                        id="bound-pieces-list"
                        itemId={item.id}
                      />
                    </Accordion>
                  </AccordionSet>
                </AccordionStatus>
              </Pane>
            </Paneset>
          </HasCommand>
        )}
      </IntlConsumer>
    );
  }
}

ItemView.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
    })
  }).isRequired,
  resources: PropTypes.shape({
    instanceRecords: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loanTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    requests: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      other: PropTypes.object,
    }),
    loans: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    itemsResource: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    callNumberTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    borrower: PropTypes.object,
    staffMembers: PropTypes.object,
    servicePoints: PropTypes.object,
    openLoans: PropTypes.object,
    tagSettings: PropTypes.object,
  }).isRequired,
  location: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    itemsResource: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }),
    markItemAsWithdrawn: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markItemAsMissing: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsInProcess: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsInProcessNonRequestable: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsIntellectualItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsLongMissing: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsRestricted: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsUnavailable: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsUnknown: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    requests: PropTypes.shape({ PUT: PropTypes.func.isRequired }),
    requestOnItem: PropTypes.shape({ replace: PropTypes.func.isRequired }),
  }),
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default flowRight(
  stripesConnect,
  withLocation,
)(ItemView);
