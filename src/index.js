import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { hot } from 'react-hot-loader';
import ReactRouterPropTypes from 'react-router-prop-types';

import InstancesRoute from './routes/InstancesRoute';

const InventoryRouting = (props) => {
  const { match: { path } } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${path}/:filter`}
        component={InstancesRoute}
      />
      <Route
        path={path}
        render={() => <InstancesRoute {...props} />}
      />
    </Switch>
  );
};

InventoryRouting.propTypes = {
  match: ReactRouterPropTypes.match,
};

export default hot(module)(InventoryRouting);
