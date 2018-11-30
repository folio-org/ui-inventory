import React from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Field } from 'redux-form';
import { Select } from '@folio/stripes/components';

class StatisticalCodeSettings extends React.Component {
  static manifest = Object.freeze({
    statisticalCodeTypes: {
      type: 'okapi',
      path: 'statistical-code-types',
      records: 'statisticalCodeTypes',
      accumulate: 'true',
      throwErrors: false,
      GET: {
        path: 'statistical-code-types?query=cql.allRecords=1 &limit=500'
      }
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { formatMessage } = this.props.stripes.intl;
    const statisticalCodeTypes = _.get(this.props.resources, ['statisticalCodeTypes', 'records'], []);
    const statisticalCodeTypesOptions = (statisticalCodeTypes).map(statisticalCodeType => (
      <option key={statisticalCodeType.id} value={statisticalCodeType.id}>{statisticalCodeType.name }</option>
    ));

    const fieldComponents = {
      'statisticalCodeTypeId': ({ fieldProps }) => (
        <Field
          {...fieldProps}
          component={Select}
          marginBottom0
          fullWidth
        >
          <FormattedMessage id="ui-inventory.selectStatisticalCode">
            {(message) => <option value="">{message}</option>}
          </FormattedMessage>
          {statisticalCodeTypesOptions}
        </Field>
      )
    };

    const formatter = {
      'statisticalCodeTypeId': (item) => {
        const record = _.isArray(statisticalCodeTypes) ?
          statisticalCodeTypes.find(element => element.id === item.statisticalCodeTypeId) : null;
        return record ? <p>{record.name}</p> : null;
      }
    };

    return (
      <this.connectedControlledVocab
        stripes={this.props.stripes}
        baseUrl="statistical-codes"
        records="statisticalCodes"
        formatter={formatter}
        fieldComponents={fieldComponents}
        label={formatMessage({ id: 'ui-inventory.statisticalCodes' })}
        labelSingular={formatMessage({ id: 'ui-inventory.statisticalCode' })}
        objectLabel={formatMessage({ id: 'ui-inventory.statisticalCodes' })}
        visibleFields={['code', 'name', 'statisticalCodeTypeId', 'source']}
        columnMapping={{
          'code': formatMessage({ id: 'ui-inventory.statisticalCodes' }),
          'name': formatMessage({ id: 'ui-inventory.statisticalCodeNames' }),
          'statisticalCodeTypeId': formatMessage({ id: 'ui-inventory.statisticalCodeTypes' })
        }}
        readOnlyFields={['source']}
        itemTemplate={{ source: 'local' }}
        hiddenFields={['description', 'numberOfObjects']}
        nameKey="name"
        id="statistical-codes"
        sortby="code"
      />
    );
  }
}

export default StatisticalCodeSettings;
