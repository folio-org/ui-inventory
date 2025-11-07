import { FormattedMessage } from 'react-intl';
import { parameterize } from 'inflected';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { ActionItem } from '../../../../components';

import useItemPermissions from '../../../hooks/useItemPermissions';
import useItemStatusChecks from '../../../hooks/useItemStatusChecks';
import useItemActions from '../../../hooks/useItemActions';

import {
  itemStatusesMap,
  itemStatusMutators,
} from '../../../../constants';

const ItemActionMenu = ({
  item,
  onToggle,
  onUpdateOwnership,
  request,
  isSharedInstance,
  tenants,
  initialTenantId,
  tenantTo,
  tenantFrom
}) => {
  const {
    handleEdit,
    handleCopy,
    handleDelete,
    handleMarcAsMissing,
    handleMarkAsWithdrawn,
    handleMarkWithStatus,
  } = useItemActions({ initialTenantId, tenantTo, tenantFrom });

  const {
    canEdit: hasPermissionToEdit,
    canCreate: hasPermissionToCreate,
    canUpdateOwnership: hasPermissionToUpdateOwnership,
    canMarkAsMissing: hasPermissionToMarkAsMissing,
    canMarkAsWithdrawn: hasPermissionToMarkAsWithdrawn,
    canDelete: hasPermissionToDelete,
  } = useItemPermissions(isSharedInstance, tenants);

  const {
    canMarkItemAsMissing,
    canMarkItemAsWithdrawn,
    canMarkItemWithStatus,
    canCreateNewRequest,
  } = useItemStatusChecks(item);

  const newRequestLink = `/requests?itemId=${item.id}&query=${item.id}&layer=create`;

  const renderItemStatusActionItems = () => {
    return Object.keys(itemStatusMutators)
      .filter(status => itemStatusesMap[status] !== item.status?.name)
      .map(status => {
        const itemStatus = itemStatusesMap[status];
        const parameterizedStatus = parameterize(itemStatus);

        return (
          <IfPermission
            key={parameterizedStatus}
            perm={`ui-inventory.items.mark-${parameterizedStatus}.execute`}
          >
            <Button
              id={`clickable-${parameterizedStatus}`}
              buttonStyle="dropdownItem"
              onClick={() => {
                onToggle();
                handleMarkWithStatus(status);
              }}
            >
              <Icon icon="flag">
                {itemStatus}
              </Icon>
            </Button>
          </IfPermission>
        );
      });
  };

  const isMarkAsMenuSectionVisible = (canMarkItemAsMissing && hasPermissionToMarkAsMissing)
    || (hasPermissionToMarkAsWithdrawn && canMarkItemAsWithdrawn)
    || canMarkItemWithStatus;

  return (
    <>
      <MenuSection id="items-list-actions">
        {hasPermissionToEdit && (
          <ActionItem
            id="clickable-edit-item"
            onClickHandler={() => {
              onToggle();
              handleEdit();
            }}
            icon="edit"
            messageId="ui-inventory.editItem"
          />
        )}

        {hasPermissionToCreate && (
          <ActionItem
            id="clickable-copy-item"
            onClickHandler={() => {
              onToggle();
              handleCopy();
            }}
            icon="duplicate"
            messageId="ui-inventory.copyItem"
          />
        )}

        {hasPermissionToUpdateOwnership && (
          <ActionItem
            id="clickable-update-ownership-item"
            onClickHandler={onUpdateOwnership}
            icon="profile"
            messageId="ui-inventory.updateOwnership"
          />
        )}

        {hasPermissionToDelete && (
          <ActionItem
            id="clickable-delete-item"
            onClickHandler={() => {
              onToggle();
              handleDelete(item, request);
            }}
            icon="trash"
            messageId="ui-inventory.deleteItem"
          />
        )}

        {canCreateNewRequest && (
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
      </MenuSection>

      {isMarkAsMenuSectionVisible && (
        <MenuSection
          id="items-list-mark-as"
          label={<FormattedMessage id="ui-inventory.markAsHeader" />}
          labelTag="h3"
        >
          {canMarkItemAsMissing && hasPermissionToMarkAsMissing && (
            <Button
              id="clickable-missing-item"
              onClick={() => {
                onToggle();
                handleMarcAsMissing();
              }}
              buttonStyle="dropdownItem"
              data-test-mark-as-missing-item
            >
              <Icon icon="flag">
                <FormattedMessage id="ui-inventory.item.status.missing" />
              </Icon>
            </Button>
          )}

          {canMarkItemAsWithdrawn && hasPermissionToMarkAsWithdrawn && (
            <Button
              id="clickable-withdrawn-item"
              onClick={() => {
                onToggle();
                handleMarkAsWithdrawn();
              }}
              buttonStyle="dropdownItem"
              data-test-mark-as-withdrawn-item
            >
              <Icon icon="flag">
                <FormattedMessage id="ui-inventory.item.status.withdrawn" />
              </Icon>
            </Button>
          )}

          {canMarkItemWithStatus && renderItemStatusActionItems()}
        </MenuSection>
      )}
    </>
  );
};

ItemActionMenu.propTypes = {
  item: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onUpdateOwnership: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSharedInstance: PropTypes.bool,
  initialTenantId: PropTypes.string,
};

export default ItemActionMenu;
