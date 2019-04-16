import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class ContributorTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  suppressEdit = term => term.source === 'marcrelator';
  suppressDelete = term => term.source === 'marcrelator';
  validate = (item) => {
    const errors = {};
    if (!item.code) {
      errors.code = <FormattedMessage id="ui-inventory.fillIn" />;
    }
    if (!item.name) {
      errors.name = <FormattedMessage id="ui-inventory.fillIn" />;
    }
    return errors;
  }

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="contributor-types"
            records="contributorTypes"
            label={<FormattedMessage id="ui-inventory.contributorTypes" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.contributorType' })}
            objectLabel={<FormattedMessage id="ui-inventory.contributors" />}
            visibleFields={['name', 'code', 'source']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              code: intl.formatMessage({ id: 'ui-inventory.code' }),
              source: intl.formatMessage({ id: 'ui-inventory.source' }),
            }}
            readOnlyFields={['source']}
            itemTemplate={{ source: 'local' }}
            hiddenFields={['description', 'numberOfObjects']}
            nameKey="name"
            // columnWidths={{ 'name': 300, 'code': 50 }}
            actionSuppressor={{ edit: this.suppressEdit, delete: this.suppressDelete }}
            id="contributor-types"
            sortby="name"
            validate={this.validate}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default ContributorTypesSettings;
