import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';
import queryString from 'query-string';

import {
  stripesConnect,
  AuthenticatedError,
} from '@folio/stripes/core';
import { isValidUUID } from '@folio/stripes/util';

import { withLocation } from '../hocs';
import { ViewItem } from '../Item';
import { DataContext } from '../contexts';
import { useSearchInstanceByIdQuery } from '../common';
import { ItemModalsStateProvider } from '../providers';

const ItemRoute = props => {
  const {
    stripes: { okapi },
    location,
    location: { state },
  } = props;

  const {
    id: instanceId,
    holdingsrecordid: holdingsRecordId,
    itemid: itemId,
  } = useParams();
  const hasValidParams = [instanceId, holdingsRecordId, itemId].every(isValidUUID);
  const { instance } = useSearchInstanceByIdQuery(instanceId, { enabled: hasValidParams });

  const queryParams = queryString.parse(props.location.search);

  if (!hasValidParams) {
    return <AuthenticatedError location={location} />;
  }

  return (
    <DataContext.Consumer>
      {data => (
        <ItemModalsStateProvider>
          <ViewItem
            {...props}
            isInstanceShared={instance?.shared}
            isInNewTab={!!queryParams?.tenantTo}
            tenantTo={state?.tenantTo || queryParams?.tenantTo || okapi.tenant}
            tenantFrom={state?.tenantFrom || okapi.tenant}
            initialTenantId={state?.initialTenantId || okapi.tenant}
            referenceTables={data}
          />
        </ItemModalsStateProvider>
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
