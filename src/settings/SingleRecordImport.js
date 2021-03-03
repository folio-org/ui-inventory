import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes/components';
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
            baseUrl="copycat/profiles"
            records="profiles"
            label={<FormattedMessage id="ui-inventory.targetProfiles" />}
            labelSingular={intl.formatMessage({ id: 'ui-inventory.targetProfile' })}
            objectLabel={<FormattedMessage id="ui-inventory.targetProfiles" />}
            visibleFields={['name', 'url', 'authentication', 'externalIdQueryMap', 'internalIdEmbedPath', 'createJobProfileId', 'updateJobProfileId', 'externalIdentifierType', 'enabled']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              url: intl.formatMessage({ id: 'ui-inventory.url' }),
              authentication: intl.formatMessage({ id: 'ui-inventory.authentication' }),
              externalIdQueryMap: intl.formatMessage({ id: 'ui-inventory.externalIdQueryMap' }),
              internalIdEmbedPath: intl.formatMessage({ id: 'ui-inventory.internalIdEmbedPath' }),
              createJobProfileId: intl.formatMessage({ id: 'ui-inventory.createJobProfileId' }),
              updateJobProfileId: intl.formatMessage({ id: 'ui-inventory.updateJobProfileId' }),
              targetOptions: intl.formatMessage({ id: 'ui-inventory.targetOptions' }),
              externalIdentifierType: intl.formatMessage({ id: 'ui-inventory.externalIdentifierType' }),
              enabled: intl.formatMessage({ id: 'ui-inventory.enabled' }),
            }}
            fieldComponents={{
              enabled: ({ fieldProps }) => (
                <Field {...fieldProps} component={Checkbox} type="checkbox" />
              )
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
