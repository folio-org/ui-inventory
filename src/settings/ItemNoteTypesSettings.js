import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class ItemNoteTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  hasPermissions = () => this.props.stripes.hasPerm('ui-inventory.settings.item-note-types');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="item-note-types"
            records="itemNoteTypes"
            label={<FormattedMessage id="ui-inventory.itemNoteTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.itemNoteType' })}
            objectLabel={<FormattedMessage id="ui-inventory.itemNoteTypes" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            id="itemNoteTypes"
            sortby="name"
            editable={this.hasPermissions()}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default ItemNoteTypesSettings;
