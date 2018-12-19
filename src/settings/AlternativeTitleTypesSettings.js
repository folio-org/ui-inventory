import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

class AlternativeTitleTypesSettings extends React.Component {
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
        baseUrl="alternative-title-types"
        records="alternativeTitleTypes"
        label={<FormattedMessage id="ui-inventory.alternativeTitleTypes" />}
        labelSingular={<FormattedMessage id="ui-inventory.alternativeTitleType" />}
        objectLabel={<FormattedMessage id="ui-inventory.alternativeTitleTypes" />}
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
