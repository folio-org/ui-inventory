import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class HoldingsNoteTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressActions = () => !this.props.stripes.hasPerm('ui-inventory.settings.holdings-note-types');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="holdings-note-types"
            records="holdingsNoteTypes"
            label={<FormattedMessage id="ui-inventory.holdingsNoteTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.holdingsNoteType' })}
            objectLabel={<FormattedMessage id="ui-inventory.holdingsNoteTypes" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            actionSuppressor={{ edit: this.suppressActions, delete: this.suppressActions }}
            id="holdingsNoteTypes"
            sortby="name"
          />
        )}
      </IntlConsumer>
    );
  }
}

export default HoldingsNoteTypesSettings;
