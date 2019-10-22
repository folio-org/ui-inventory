import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class InstanceNoteTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = () => !this.props.stripes.hasPerm('ui-inventory.settings.list.edit');
  suppressDelete = () => !this.props.stripes.hasPerm('ui-inventory.settings.list.delete');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="instance-note-types"
            records="instanceNoteTypes"
            label={<FormattedMessage id="ui-inventory.instanceNoteTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.instanceNoteType' })}
            objectLabel={<FormattedMessage id="ui-inventory.instanceNoteTypes" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
            id="instanceNoteTypes"
            sortby="name"
          />
        )}
      </IntlConsumer>
    );
  }
}

export default InstanceNoteTypesSettings;
