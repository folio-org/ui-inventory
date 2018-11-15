import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class ILLPolicy extends React.Component {
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
        baseUrl="ill-policies"
        records="illPolicies"
        label={formatMessage({ id: 'ui-inventory.ILLPolicy' })}
        labelSingular={formatMessage({ id: 'ui-inventory.ILLPolicy' })}
        objectLabel={formatMessage({ id: 'ui-inventory.ILLPolicy' })}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="ILLPolicy"
        sortby="name"
      />
    );
  }
}

export default ILLPolicy;
