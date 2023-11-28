import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withLocation from '../withLocation';
import { ItemView } from '../views';
import { DataContext } from '../contexts';

const ItemRoute = props => {
  const {
    stripes: { okapi },
    location: { state },
  } = props;

  return (
    <DataContext.Consumer>
      {data => (
        <ItemView
          {...props}
          tenantTo={state?.tenantTo || okapi.tenant}
          referenceTables={data}
        />
      )}
    </DataContext.Consumer>
  );
};

ItemRoute.propTypes = {
  goTo: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.object,
  tenantFrom: PropTypes.string,
  history: PropTypes.object,
};

export default flowRight(
  stripesConnect,
  withLocation,
)(ItemRoute);
