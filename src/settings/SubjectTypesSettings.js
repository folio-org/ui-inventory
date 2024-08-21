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

class SubjectTypesSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.subject-types');
    const suppress = getSourceSuppressor([RECORD_SOURCE.FOLIO]);

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.subjectTypes' })}
          >
            <this.connectedControlledVocab
              {...this.props}
              baseUrl="subject-types"
              records="subjectTypes"
              label={<FormattedMessage id="ui-inventory.subjectTypes" />}
              labelSingular={intl.formatMessage({ id: 'ui-inventory.subjectType' })}
              objectLabel={<FormattedMessage id="ui-inventory.subjectTypes" />}
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
              id="subject-types"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default SubjectTypesSettings;
