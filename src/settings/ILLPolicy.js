import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class ILLPolicy extends React.Component {
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
        baseUrl="ill-policies"
        records="illPolicies"
        label={<FormattedMessage id="ui-inventory.ILLPolicy" />}
        labelSingular={<FormattedMessage id="ui-inventory.ILLPolicy" />}
        objectLabel={<FormattedMessage id="ui-inventory.ILLPolicy" />}
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
