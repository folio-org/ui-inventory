import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';

import Instances from './Instances';
import Settings from './settings';

class InstancesRouting extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.connectedApp = props.stripes.connect(Instances);
  }

  NoMatch() {
    const { pathname } = this.props.location;

    return (
      <div>
        <h2>
          <FormattedMessage id="ui-inventory.error.noMatch.oops" />
        </h2>
        <p>
          <FormattedMessage
            id="ui-inventory.error.noMatch.how"
            values={{ location: <tt>{pathname}</tt> }}
          />
        </p>
      </div>
    );
  }

  render() {
    const {
      showSettings,
      match: { path },
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={path}
          render={() => <this.connectedApp {...this.props} />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default hot(module)(InstancesRouting);
