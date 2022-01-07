import {
  get,
  cloneDeep,
  map,
  isEmpty,
  values,
} from 'lodash';
import { parameterize } from 'inflected';

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
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
} from '@folio/stripes/core';

import ModalContent from '../components/ModalContent';
import { ItemAcquisition } from '../Item/ViewItem/ItemAcquisition';
import {
  craftLayerUrl,
  callNumberLabel,
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
} from '../utils';
import withLocation from '../withLocation';
import {
  itemStatusesMap,
  itemStatusMutators,
  noValue,
  requestStatuses,
  wrappingCell,
  actionMenuDisplayPerms,
} from '../constants';
import ItemStatus from './ItemStatus';
import { WarningMessage, AdministrativeNoteList } from '../components';
import css from '../View.css';

export const requestStatusFiltersString = map(requestStatuses, requestStatus => `requestStatus.${requestStatus}`).join(',');

class ItemView extends React.Component {
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

    const { id, holdingsrecordid, itemid } = this.props.match.params;

    this.props.history.push({
      pathname: `/inventory/edit/${id}/${holdingsrecordid}/${itemid}`,
      search: this.props.location.search,
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

    return this.props.mutator.items.PUT(item).then(() => {
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

  onCopy() {
    const { itemid, id, holdingsrecordid } = this.props.match.params;

    this.props.history.push({
      pathname: `/inventory/copy/${id}/${holdingsrecordid}/${itemid}`,
      search: this.props.location.search,
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

      newRequestRecord.status = requestStatuses.OPEN_NOT_YET_FILLED;
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
    const canDisplayActionMenu = actionMenuDisplayPerms.some(perm => stripes.hasPerm(perm));

    if (!canDisplayActionMenu) {
      return null;
    }

    return (
      <>
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
        <IfPermission perm="ui-inventory.items.mark-items-withdrawn">
          { canMarkItemAsWithdrawn(firstItem) && (
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
              <FormattedMessage id="ui-inventory.markAsWithdrawn" />
            </Icon>
          </Button>
          )}
        </IfPermission>
        { canMarkItemWithStatus(firstItem) && (
          Object.keys(itemStatusMutators)
            .filter(status => itemStatusesMap[status] !== firstItem?.status?.name)
            .map(status => {
              const itemStatus = itemStatusesMap[status].toLowerCase();
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
                    <FormattedMessage
                      id="ui-inventory.markAs"
                      values={{ itemStatus }}
                    />
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
            })
        )}
        { canCreateNewRequest(firstItem, stripes) && (
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
      </>
    );
  };

  getEntity = () => this.props.resources.items.records[0];
  getEntityTags = () => this.props.resources.items.records[0]?.tags?.tagList || [];

  render() {
    const {
      resources: {
        items,
        holdingsRecords,
        instances1,
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
    const servicePointName = get(servicePoints, 'records[0].name', '-');
    const instance = instances1.records[0];
    const item = items.records[0] || {};
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
      copyNumber: get(item, 'copyNumber', '-'),
      numberOfPieces: get(item, 'numberOfPieces', '-'),
      descriptionOfPieces: get(item, 'descriptionOfPieces', '-'),
      effectiveShelvingOrder: get(item, 'effectiveShelvingOrder', '-'),
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
      itemStatusDate: getDateWithTime(item?.status?.date),
      requestLink: requestCount ? <Link to={requestsUrl}>{requestCount}</Link> : 0,
      borrower: borrowerLink,
      loanDate: openLoan ? getDateWithTime(openLoan.loanDate) : '-',
      dueDate: openLoan ? getDateWithTime(openLoan.dueDate) : '-',
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

    const circulationHistory = {
      checkInDate: getDateWithTime(get(item, ['lastCheckIn', 'dateTime'])),
      servicePointName,
      source,
    };

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

    const boundWithTitleFormatter = {
      'Instance HRID': x => x.briefInstance?.hrid,
      'Instance title': x => x.briefInstance?.title,
      'Holdings HRID': x => x.briefHoldingsRecord?.hrid,
    };

    const effectiveLocationDisplay = (
      <Col xs={2}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
          value={checkIfElementIsEmpty(itemLocation.effectiveLocation)}
        />
      </Col>
    );

    const boundWithCount = item?.boundWithTitles?.length;
    const linkedInstanceTitle = (
      <Link to={`/inventory/view/${instance.id}`}>
        {` ${instance.title}. `}
      </Link>
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
                onClose={this.props.onCloseViewItem}
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

                <Row center="xs">
                  <Col sm={6}>
                    <FormattedMessage
                      id="ui-inventory.instanceTitle"
                      values={{ title: linkedInstanceTitle }}
                    />
                    {(instance.publication && instance.publication.length > 0) && (
                    <span>
                      <em>
                        {` ${instance.publication[0].publisher}`}
                        {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                      </em>
                    </span>
                    )}
                    { boundWithCount > 0 &&
                      <>
                        {' '}
                        <span className={css.multiTitle}>
                          <FormattedMessage
                            id="ui-inventory.boundWith"
                            values={{
                              boundWithCount,
                            }}
                          />
                        </span>
                      </>
                    }
                    <div>
                      <FormattedMessage id="ui-inventory.holdingsLabelShort" />
                      <Link to={`/inventory/view/${instance.id}/${holdingsRecord.id}`}>
                        { ` ${holdingLocation.permanentLocation} > ${callNumberLabel(holdingsRecord)}` }
                      </Link>
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
                    <FormattedMessage
                      id={
                        item?.isBoundWith ?
                          'ui-inventory.itemRecordWithDescriptionBW' :
                          'ui-inventory.itemRecordWithDescription'
                      }
                      values={{
                        materialType: item?.materialType?.name,
                        status: item?.status?.name,
                      }}
                    />
                  </Col>
                </Row>
                <br />
                <AccordionStatus ref={this.accordionStatusRef}>
                  <Row>
                    {effectiveLocationDisplay}
                    <Col xs={2}>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                        value={effectiveCallNumber(item)}
                      />
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
                          <KeyValue
                            label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                            value={checkIfElementIsEmpty(itemData.effectiveShelvingOrder)}
                          />
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
                        getEntity={this.getEntity}
                        getEntityTags={this.getEntityTags}
                        entityTagsPath="tags"
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
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    loanTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    requests: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      other: PropTypes.object,
    }),
    loans: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    items: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    holdingsRecords: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
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
    items: PropTypes.shape({
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
  onCloseViewItem: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withLocation(ItemView);
