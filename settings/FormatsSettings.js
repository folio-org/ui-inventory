import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class FormatTypesSettings extends React.Component {
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
        baseUrl="instance-formats"
        records="instanceFormats"
        label={formatMessage({ id: 'ui-inventory.formats' })}
        labelSingular={formatMessage({ id: 'ui-inventory.format' })}
        objectLabel={formatMessage({ id: 'ui-inventory.instances' })}
        visibleFields={['name', 'code', 'source']}
        readOnlyFields={['source']}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="formats"
      />
    );
  }
}

export default FormatTypesSettings;
