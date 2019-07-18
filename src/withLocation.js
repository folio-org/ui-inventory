import { isNil, omitBy, pickBy, includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import { compose } from 'redux';
import { withRouter } from 'react-router';

const searchParams = [
  'filters',
  'query',
  'sort',
  'qindex',
];

function withLocation(WrappedComponent) {
  class Location extends React.Component {
    static manifest = WrappedComponent.manifest;
    static propTypes = {
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
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

    getSearchParams = () => {
      const { location } = this.props;
      const { search } = location;
      const params = pickBy(parse(search), (_, key) => includes(searchParams, key));

      return stringify(params);
    }

    render() {
      return (
        <WrappedComponent
          updateLocation={this.updateLocation}
          goTo={this.goTo}
          getSearchParams={this.getSearchParams}
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
