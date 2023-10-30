import React from 'react';
import PropTypes from 'prop-types';
import { flowRight } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withLocation from '../withLocation';
import { ItemView } from '../views';
import { DataContext } from '../contexts';
import { switchAffiliation } from '../utils';

class ItemRoute extends React.Component {
  goBack = () => {
    const {
      match: { params: { id } },
      location: { search },
      history,
    } = this.props;

    history.push({
      pathname: `/inventory/view/${id}`,
      search,
    });
  }

  onClose = () => {
    const {
      stripes,
      location,
    } = this.props;
    const tenantFrom = location?.state?.tenantFrom || stripes.okapi.tenant;

    switchAffiliation(stripes, tenantFrom, this.goBack);
  }

  render() {
    const {
      stripes: { okapi },
      location: { state },
    } = this.props;

    return (
      <DataContext.Consumer>
        {data => (
          <ItemView
            {...this.props}
            tenantTo={state?.tenantTo || okapi.tenant}
            onCloseViewItem={this.onClose}
            referenceTables={data}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

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
