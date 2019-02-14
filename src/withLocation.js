import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import { compose } from 'redux';
import { withRouter } from 'react-router';

function withLocation(WrappedComponent) {
  class Location extends React.Component {
    static manifest = WrappedComponent.manifest;
    static propTypes = {
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string,
      }).isRequired,
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    };

    updateLocation = (newParams) => {
      const { location, history } = this.props;
      const { search, pathname } = location;
      const prevParams = parse(search);
      const params = Object.assign(prevParams, newParams);
      const cleanParams = omitBy(params, isNil);
      const url = `${pathname}?${stringify(cleanParams)}`;

      history.push(url);
    }

    goTo = (path, params) => {
      const { history } = this.props;
      const url = (params) ? `${path}?${stringify(params)}` : path;

      history.push(url);
    }

    render() {
      return (
        <WrappedComponent
          updateLocation={this.updateLocation}
          goTo={this.goTo}
          {...this.props}
        />
      );
    }
  }

  return Location;
}

export default compose(
  withRouter,
  withLocation,
);
