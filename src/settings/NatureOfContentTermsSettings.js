import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class NatureOfContentTermsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = term => term.source === 'folio' || !this.props.stripes.hasPerm('ui-inventory.settings.list.edit');
  suppressDelete = term => term.source === 'folio' || !this.props.stripes.hasPerm('ui-inventory.settings.list.delete');

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="nature-of-content-terms"
            records="natureOfContentTerms"
            label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.natureOfContentTerm' })}
            objectLabel={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
            visibleFields={['name', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
            nameKey="name"
            id="natureOfContentTerms"
            sortby="name"
          />
        )}
      </IntlConsumer>
    );
  }
}

export default NatureOfContentTermsSettings;
