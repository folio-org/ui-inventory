import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { withLocation } from '../hocs';
import { ItemView } from '../views';
import { DataContext } from '../contexts';
import { useSearchInstanceByIdQuery } from '../common';

const ItemRoute = props => {
  const {
    stripes: { okapi },
    location: { state },
  } = props;

  const { id: instanceId } = useParams();
  const { instance } = useSearchInstanceByIdQuery(instanceId);

  return (
    <DataContext.Consumer>
      {data => (
        <ItemView
          {...props}
          isInstanceShared={instance?.shared}
          tenantTo={state?.tenantTo || okapi.tenant}
          initialTenantId={state?.initialTenantId || okapi.tenant}
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
  history: PropTypes.object,
};

export default flowRight(
  stripesConnect,
  withLocation,
)(ItemRoute);
