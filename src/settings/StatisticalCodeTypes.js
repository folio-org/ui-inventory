import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class StatisticalCodeTypes extends React.Component {
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
        baseUrl="statistical-code-types"
        records="statisticalCodeTypes"
        label={formatMessage({ id: 'ui-inventory.statisticalCodeTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.statisticalCodeTypes' })}
        objectLabel={formatMessage({ id: 'ui-inventory.statisticalCodeTypes' })}
        visibleFields={['name']}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="StatisticalCodeTypes"
        sortby="name"
      />
    );
  }
}

export default StatisticalCodeTypes;
