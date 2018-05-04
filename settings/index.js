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

    this.pages = [
      {
        route: 'materialtypes',
        label: formatMessage({ id: 'ui-inventory.materialTypes' }),
        component: MaterialTypesSettings,
        perm: 'ui-inventory.settings.materialtypes',
      },
      {
        route: 'loantypes',
        label: formatMessage({ id: 'ui-inventory.loanTypes' }),
        component: LoanTypesSettings,
        perm: 'ui-inventory.settings.loantypes',
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
      {
        route: 'contributortypes',
        label: formatMessage({ id: 'ui-inventory.contributorTypes' }),
        component: ContributorTypesSettings,
        perm: 'ui-inventory.settings.contributor-types',
      },
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        pages={_.sortBy(this.pages, ['label'])}
        paneTitle="Inventory"
      />
    );
  }
}

export default InventorySettings;
