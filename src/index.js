import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { hot } from 'react-hot-loader';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  InstancesRoute,
  InstanceMovementRoute,
  InstanceMarcRoute,
  InstanceEditRoute,
  ItemRoute,
  QuickMarcRoute,
  CreateItemRoute,
  CreateHoldingRoute,
  ViewRequestsRoute,
  ImportRoute
} from './routes';
import Settings from './settings';
import { DataProvider, HoldingsProvider } from './providers';

const InventoryRouting = (props) => {
  const { showSettings, match: { path } } = props;

  if (showSettings) {
    return <Settings {...props} />;
  }

  return (
    <DataProvider>
      <HoldingsProvider>
        <Switch>
          <Route
            path={`${path}/create/:id/holding`}
            component={CreateHoldingRoute}
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
            path={`${path}/quick-marc`}
            component={QuickMarcRoute}
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
            path={path}
            component={InstancesRoute}
          />
        </Switch>
      </HoldingsProvider>
    </DataProvider>
  );
};

InventoryRouting.propTypes = {
  match: ReactRouterPropTypes.match,
  showSettings: PropTypes.bool,
};

export default hot(module)(InventoryRouting);
