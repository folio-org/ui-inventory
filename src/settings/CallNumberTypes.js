import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class CallNumberTypes extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="call-number-types"
        records="callNumberTypes"
        label={<FormattedMessage id="ui-inventory.callNumberTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.callNumberType" />}
        objectLabel={<FormattedMessage id="ui-inventory.callNumberTypes" />}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="callNumberTypes"
        sortby="name"
      />
    );
  }
}

export default CallNumberTypes;
