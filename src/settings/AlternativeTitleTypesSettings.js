import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';

class AlternativeTitleTypesSettings extends React.Component {
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
        baseUrl="alternative-title-types"
        records="alternativeTitleTypes"
        label={formatMessage({ id: 'ui-inventory.alternativeTitleTypes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.alternativeTitleType' })}
        objectLabel={formatMessage({ id: 'ui-inventory.alternativeTitleTypes' })}
        visibleFields={['name', 'source']}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="alternative-title-types"
        sortby="name"
      />
    );
  }
}

export default AlternativeTitleTypesSettings;
