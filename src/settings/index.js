import React from 'react';
import PropTypes from 'prop-types';
import { Settings } from '@folio/stripes/smart-components';
import MaterialTypesSettings from './MaterialTypesSettings';
import LoanTypesSettings from './LoanTypesSettings';
import FormatsSettings from './FormatsSettings';
import ResourceTypesSettings from './ResourceTypesSettings';
import ContributorTypesSettings from './ContributorTypesSettings';
import URLRelationshipSettings from './URLRelationshipSettings';
import InstanceStatusTypesSettings from './InstanceStatusTypesSettings';
import CallNumberTypes from './CallNumberTypes';
import StatisticalCodeTypes from './StatisticalCodeTypes';
import AlternativeTitleTypesSettings from './AlternativeTitleTypesSettings';

class InventorySettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const { formatMessage } = this.props.stripes.intl;

    this.sections = [
      {
        label: formatMessage({ id: 'ui-inventory.instances' }),
        pages: [
          {
            route: 'alternativeTitleTypes',
            label: formatMessage({ id: 'ui-inventory.alternativeTitleTypes' }),
            component: AlternativeTitleTypesSettings,
            perm: 'ui-inventory.settings.alternative-title-types',
          },
          {
            route: 'contributortypes',
            label: formatMessage({ id: 'ui-inventory.contributorTypes' }),
            component: ContributorTypesSettings,
            perm: 'ui-inventory.settings.contributor-types',
          },
          {
            route: 'formats',
            label: formatMessage({ id: 'ui-inventory.formats' }),
            component: FormatsSettings,
            perm: 'ui-inventory.settings.instance-formats',
          },
          {
            route: 'instanceStatusTypes',
            label: formatMessage({ id: 'ui-inventory.instanceStatusTypes' }),
            component: InstanceStatusTypesSettings,
            perm: 'ui-inventory.settings.instance-statuses',
          },
          {
            route: 'resourcetypes',
            label: formatMessage({ id: 'ui-inventory.resourceTypes' }),
            component: ResourceTypesSettings,
            perm: 'ui-inventory.settings.instance-types',
          },
        ]
      },
      {
        label: formatMessage({ id: 'ui-inventory.items' }),
        pages: [
          {
            route: 'loantypes',
            label: formatMessage({ id: 'ui-inventory.loanTypes' }),
            component: LoanTypesSettings,
            perm: 'ui-inventory.settings.loantypes',
          },
          {
            route: 'materialtypes',
            label: formatMessage({ id: 'ui-inventory.materialTypes' }),
            component: MaterialTypesSettings,
            perm: 'ui-inventory.settings.materialtypes',
          },
        ]
      },
      {
        label: formatMessage({ id: 'ui-inventory.instanceHoldingsItem' }),
        pages: [
          {
            route: 'statisticalCodeTypes',
            label: formatMessage({ id: 'ui-inventory.statisticalCodeTypes' }),
            component: StatisticalCodeTypes,
            perm: 'ui-inventory.settings.statistical-code-types',
          },
          {
            route: 'URLrelationship',
            label: formatMessage({ id: 'ui-inventory.URLrelationship' }),
            component: URLRelationshipSettings,
            perm: 'ui-inventory.settings.electronic-access-relationships',
          },
        ]
      },
      {
        label: formatMessage({ id: 'ui-inventory.holdingsItems' }),
        pages: [
          {
            route: 'callNumberTypes',
            label: formatMessage({ id: 'ui-inventory.callNumberTypes' }),
            component: CallNumberTypes,
            perm: 'ui-inventory.settings.call-number-types',
          },
        ]
      }
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-inventory.inventory.label' })}
      />
    );
  }
}

export default InventorySettings;
