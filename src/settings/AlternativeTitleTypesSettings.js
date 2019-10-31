import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

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

  hasPermissions = () => this.props.stripes.hasPerm('ui-inventory.settings.alternative-title-types');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="alternative-title-types"
            records="alternativeTitleTypes"
            label={<FormattedMessage id="ui-inventory.alternativeTitleTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.alternativeTitleType' })}
            objectLabel={<FormattedMessage id="ui-inventory.alternativeTitleTypes" />}
            visibleFields={['name', 'source'].filter((item)=> item !== 'actions')}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            id="alternative-title-types"
            sortby="name"
            editable={this.hasPermissions()}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default AlternativeTitleTypesSettings;
