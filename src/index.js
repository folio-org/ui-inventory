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
  ItemRoute,
  QuickMarcRoute,
  CreateItemRoute,
  CreateHoldingRoute,
} from './routes';
import Settings from './settings';

const InventoryRouting = (props) => {
  const { showSettings, match: { path } } = props;

  if (showSettings) {
    return <Settings {...props} />;
  }

  return (
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
        path={path}
        component={InstancesRoute}
      />
    </Switch>
  );
};

InventoryRouting.propTypes = {
  match: ReactRouterPropTypes.match,
  showSettings: PropTypes.bool,
};

export default hot(module)(InventoryRouting);
