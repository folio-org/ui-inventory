import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { getSourceSuppressor } from '@folio/stripes/util';
import { useStripes, TitleManager } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import { RECORD_SOURCE } from '../../constants';

const CallNumberTypes = props => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const hasPerm = stripes.hasPerm('ui-inventory.settings.call-number-types');
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const actionSuppressor = {
    edit: getSourceSuppressor([RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
    delete: getSourceSuppressor([RECORD_SOURCE.SYSTEM, RECORD_SOURCE.CONSORTIUM]),
  };

  return (
    <TitleManager
      page={formatMessage({ id: 'ui-inventory.settings.inventory.title' })}
      record={formatMessage({ id: 'ui-inventory.callNumberTypes' })}
    >
      <ConnectedControlledVocab
        {...props}
        actionSuppressor={actionSuppressor}
        baseUrl="call-number-types"
        records="callNumberTypes"
        label={<FormattedMessage id="ui-inventory.callNumberTypes" />}
        labelSingular={formatMessage({ id: 'ui-inventory.callNumberType' })}
        objectLabel={<FormattedMessage id="ui-inventory.callNumberTypes" />}
        visibleFields={['name', 'source']}
        columnMapping={{
          name: formatMessage({ id: 'ui-inventory.name' }),
          source: formatMessage({ id: 'ui-inventory.source' }),
        }}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="callNumberTypes"
        sortby="name"
        editable={hasPerm}
      />
    </TitleManager>
  );
};

CallNumberTypes.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default CallNumberTypes;
