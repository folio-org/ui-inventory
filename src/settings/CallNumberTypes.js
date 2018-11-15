import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class CallNumberTypes extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="call-number-types"
        records="callNumberTypes"
        label={formatMessage({ id: 'ui-inventory.callNumberTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.callNumberType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.callNumberTypes' })}
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
