import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
            visibleFields={['name', 'url', 'authentication', 'externalIdQueryMap', 'internalIdEmbedPath', 'jobProfileId']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-inventory.name' }),
              url: intl.formatMessage({ id: 'ui-inventory.url' }),
              authentication: intl.formatMessage({ id: 'ui-inventory.authentication' }),
              externalIdQueryMap: intl.formatMessage({ id: 'ui-inventory.externalIdQueryMap' }),
              internalIdEmbedPath: intl.formatMessage({ id: 'ui-inventory.internalIdEmbedPath' }),
              importProfileId: intl.formatMessage({ id: 'ui-inventory.jobProfileId' }),
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
