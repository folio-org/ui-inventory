import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl'; // eslint-disable-line no-unused-vars

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

class SingleRecordImport extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.call-number-types');

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            baseUrl="copycat/target-profiles"
            records="targetprofiles"
            label={<FormattedMessage id="ui-inventory.targetProfiles" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.targetProfile' })}
            objectLabel={<FormattedMessage id="ui-inventory.targetProfiles" />}
            visibleFields={['name', 'url']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              url: intl.formatMessage({ id: 'ui-inventory.url' }),
            }}
            nameKey="name"
            hiddenFields={['lastUpdated', 'numberOfObjects']}
            id="singleRecordImport"
            sortby="name"
            editable={hasPerm}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default SingleRecordImport;
