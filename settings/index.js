import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Settings from '@folio/stripes-components/lib/Settings';
import MaterialTypesSettings from './MaterialTypesSettings';
import LoanTypesSettings from './LoanTypesSettings';
import FormatsSettings from './FormatsSettings';
import ResourceTypesSettings from './ResourceTypesSettings';
import ContributorTypesSettings from './ContributorTypesSettings';

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
        label: formatMessage({ id: 'ui-inventory.instances' }),
        pages: [
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
            route: 'resourcetypes',
            label: formatMessage({ id: 'ui-inventory.resourceTypes' }),
            component: ResourceTypesSettings,
            perm: 'ui-inventory.settings.instance-types',
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
