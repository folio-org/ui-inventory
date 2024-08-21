import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { getSourceSuppressor } from '@folio/stripes/util';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';

import { RECORD_SOURCE } from '../constants';

class SubjectSourcesSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.subject-sources');
    const suppress = getSourceSuppressor([RECORD_SOURCE.FOLIO]);

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.subjectSources' })}
          >
            <this.connectedControlledVocab
              {...this.props}
              baseUrl="subject-sources"
              records="subjectSources"
              label={<FormattedMessage id="ui-inventory.subjectSources" />}
              labelSingular={intl.formatMessage({ id: 'ui-inventory.subjectSource' })}
              objectLabel={<FormattedMessage id="ui-inventory.subjectSources" />}
              visibleFields={['name', 'source']}
              columnMapping={{
                name: intl.formatMessage({ id: 'ui-inventory.name' }),
                source: intl.formatMessage({ id: 'ui-inventory.source' }),
              }}
              readOnlyFields={['source']}
              itemTemplate={{ source: 'local' }}
              hiddenFields={['numberOfObjects']}
              nameKey="name"
              actionSuppressor={{ edit: suppress, delete: suppress }}
              id="subject-sources"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default SubjectSourcesSettings;
