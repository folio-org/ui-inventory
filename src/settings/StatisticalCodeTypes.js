import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class StatisticalCodeTypes extends React.Component {
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
        baseUrl="statistical-code-types"
        records="statisticalCodeTypes"
        label={<FormattedMessage id="ui-inventory.statisticalCodeTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.statisticalCodeTypes" />}
        objectLabel={<FormattedMessage id="ui-inventory.statisticalCodeTypes" />}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="StatisticalCodeTypes"
        sortby="name"
      />
    );
  }
}

export default StatisticalCodeTypes;
