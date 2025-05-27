import { isNil, omitBy, pickBy, includes, flowRight } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
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

    // The optional `options` object can include the following keys:
    //  `replace`: if true, use history.replace instead of history.push
    //
    updateLocation = (newParams, options = {}) => {
      let { location: { pathname } } = this.props;
      const { history } = this.props;

      if (newParams._path) {
        pathname = newParams._path;
        delete newParams._path;
      }
      const prevParams = this.getParams();
      const params = Object.assign(prevParams, newParams);
      const cleanParams = omitBy(params, isNil);
      const url = `${pathname}?${stringify(cleanParams)}`;

      history[options.replace ? 'replace' : 'push'](url);
    }

    goTo = (path, params) => {
      const { history } = this.props;
      const url = (params) ? `${path}?${stringify(params)}` : path;

      history.push(url);
    }

    getParams = () => {
      const { location: { search } } = this.props;

      return parse(search);
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
          getParams={this.getParams}
          {...this.props}
        />
      );
    }
  }

  return Location;
}

export default flowRight(
  withRouter,
  withLocation,
);
