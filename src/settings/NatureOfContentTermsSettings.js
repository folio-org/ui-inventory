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

class NatureOfContentTermsSettings extends React.Component {
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
    const hasPerm = this.props.stripes.hasPerm('ui-inventory.settings.nature-of-content-terms');
    const suppress = getSourceSuppressor([
      RECORD_SOURCE.FOLIO,
      RECORD_SOURCE.CONSORTIUM,
    ]);

    return (
      <IntlConsumer>
        {intl => (
          <TitleManager
            page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
            record={intl.formatMessage({ id: 'ui-inventory.natureOfContentTerms' })}
          >
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
              actionSuppressor={{ edit: suppress, delete: suppress }}
              nameKey="name"
              id="natureOfContentTerms"
              sortby="name"
              editable={hasPerm}
            />
          </TitleManager>
        )}
      </IntlConsumer>
    );
  }
}

export default NatureOfContentTermsSettings;
