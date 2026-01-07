import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AppContextMenu,
  coreEvents,
  useStripes,
} from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';

import {
  DuplicateHoldingRoute,
  EditHoldingRoute,
  InstancesRoute,
  InstanceMovementRoute,
  InstanceMarcRoute,
  InstanceEditRoute,
  ItemRoute,
  QuickMarcRoute,
  CreateItemRoute,
  CreateHoldingRoute,
  ViewRequestsRoute,
  ImportRoute,
  HoldingsMarcRoute,
  EditItemRoute,
  DuplicateItemRoute,
  ViewHoldingRoute,
  BrowseRoute,
} from './routes';
import Settings from './settings';
import {
  DataProvider,
  HoldingsProvider,
  LastSearchTermsProvider,
} from './providers';
import { EVENTS } from './constants';
import { clearStorage } from './utils';

const InventoryRouting = (props) => {
  const stripes = useStripes();
  const history = useHistory();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const { showSettings, match: { path } } = props;

  const keyboardShortcuts = [...defaultKeyboardShortcuts];

  keyboardShortcuts.splice(10, 0, {
    label: (<FormattedMessage id="ui-inventory.shortcut.editMARC" />),
    name: 'editMARC',
    shortcut: 'ctrl+shift+e',
  }, {
    label: <FormattedMessage id="ui-inventory.shortcut.nextSubfield" />,
    name: 'NEXT_SUBFIELD',
    shortcut: 'Ctrl + ]',
  },
  {
    label: <FormattedMessage id="ui-inventory.shortcut.prevSubfield" />,
    name: 'PREV_SUBFIELD',
    shortcut: 'Ctrl + [',
  });

  const focusSearchField = () => {
    const el = document.getElementById('input-inventory-search');

    if (el) {
      el.focus();
    }
  };

  const toggleModal = () => setIsShortcutsModalOpen(prev => !prev);

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
    {
      name: 'openShortcutModal',
      handler: toggleModal,
    },
  ];

  if (showSettings) {
    return <Settings {...props} />;
  }

  return (
    <DataProvider>
      <HoldingsProvider>
        <LastSearchTermsProvider>
          <CommandList commands={keyboardShortcuts}>
            <HasCommand
              commands={shortcuts}
              isWithinScope={checkScope}
              scope={document.body}
            >
              <AppContextMenu>
                {(handleToggle) => (
                  <NavList>
                    <NavListSection>
                      <NavListItem
                        id="keyboard-shortcuts-item-0"
                        onClick={() => {
                          handleToggle();
                          history.replace({
                            pathname: '/inventory',
                            search: 'reset=true'
                          });
                        }}
                      >
                        <FormattedMessage id="ui-inventory.appMenu.inventorySearch" />
                      </NavListItem>
                      <NavListItem
                        id="keyboard-shortcuts-item"
                        onClick={() => {
                          handleToggle();
                          toggleModal();
                        }}
                      >
                        <FormattedMessage id="ui-inventory.appMenu.keyboardShortcuts" />
                      </NavListItem>
                    </NavListSection>
                  </NavList>
                )}
              </AppContextMenu>
              <Switch>
                <Route
                  path={`${path}/create/:id/holding`}
                  component={CreateHoldingRoute}
                />
                <Route
                  path={`${path}/edit/:id/:holdingId/:itemId`}
                  component={EditItemRoute}
                />
                <Route
                  path={`${path}/create/:id/:holdingId/item`}
                  component={CreateItemRoute}
                />
                <Route
                  path={`${path}/move/:idFrom/:idTo/instance`}
                  component={InstanceMovementRoute}
                />
                <Route
                  path={`${path}/view/:id/:holdingsrecordid/:itemid`}
                  component={ItemRoute}
                />
                <Route
                  path={`${path}/copy/:id/:holdingsrecordid/:itemid`}
                  component={DuplicateItemRoute}
                />
                <Route
                  path={`${path}/quick-marc`}
                  component={QuickMarcRoute}
                />
                <Route
                  path={`${path}/viewsource/:id/:holdingsrecordid`}
                  component={HoldingsMarcRoute}
                />
                <Route
                  path={`${path}/viewsource/:id`}
                  component={InstanceMarcRoute}
                />
                <Route
                  path={`${path}/edit/:id/instance`}
                  component={InstanceEditRoute}
                />
                <Route
                  path={`${path}/view/:id/:holdingsrecordid`}
                  component={ViewHoldingRoute}
                />
                <Route
                  path={`${path}/edit/:id/:holdingsrecordid`}
                  component={EditHoldingRoute}
                />
                <Route
                  path={`${path}/copy/:id/:holdingsrecordid`}
                  component={DuplicateHoldingRoute}
                />
                <Route
                  path={`${path}/view-requests/:id`}
                  component={ViewRequestsRoute}
                />
                <Route
                  path={`${path}/import/:id`}
                  component={ImportRoute}
                />
                <Route
                  path={`${path}/import`}
                  component={ImportRoute}
                />
                <Route
                  path={`${path}/browse`}
                  component={BrowseRoute}
                />
                <Route
                  path={path}
                  render={renderProps => <InstancesRoute tenantId={stripes.okapi.tenant} {...renderProps} />}
                />
              </Switch>
            </HasCommand>
          </CommandList>
          {isShortcutsModalOpen && (
            <KeyboardShortcutsModal
              allCommands={keyboardShortcuts}
              onClose={toggleModal}
            />
          )}
        </LastSearchTermsProvider>
      </HoldingsProvider>
    </DataProvider>
  );
};

InventoryRouting.eventHandler = (event) => {
  if ([coreEvents.LOGIN, EVENTS.SWITCH_ACTIVE_AFFILIATION].includes(event)) {
    clearStorage();
  }
};

InventoryRouting.propTypes = {
  match: ReactRouterPropTypes.match,
  showSettings: PropTypes.bool,
};

export default InventoryRouting;
