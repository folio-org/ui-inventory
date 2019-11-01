import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { hot } from 'react-hot-loader';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  InstancesRoute,
  HoldingsRoute,
  ItemsRoute,
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
        path={`${path}/holdings`}
        component={HoldingsRoute}
      />
      <Route
        path={`${path}/items`}
        component={ItemsRoute}
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
