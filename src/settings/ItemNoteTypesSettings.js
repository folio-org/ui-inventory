import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';
import { getSourceSuppressor } from '@folio/stripes/util';

import { RECORD_SOURCE } from '../constants';

const suppress = getSourceSuppressor(RECORD_SOURCE.CONSORTIUM);
const actionSuppressor = { edit: suppress, delete: suppress };

class ItemNoteTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.item-note-types');

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.itemNoteTypes' })}
          >
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
              actionSuppressor={actionSuppressor}
              readOnlyFields={['source']}
              itemTemplate={{ source: 'local' }}
              hiddenFields={['description', 'numberOfObjects']}
              nameKey="name"
              id="itemNoteTypes"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default ItemNoteTypesSettings;
