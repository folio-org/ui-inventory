import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class MaterialTypesSettings extends React.Component {
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
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="material-types"
            records="mtypes"
            label={<FormattedMessage id="ui-inventory.materialTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.materialType' })}
            objectLabel={<FormattedMessage id="ui-inventory.items" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            id="materialtypes"
            sortby="name"
            editable={this.props.stripes.hasPerm('ui-inventory.settings.materialtypes')}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default MaterialTypesSettings;
