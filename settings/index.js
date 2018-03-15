import _ from 'lodash';
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import MaterialTypesSettings from './MaterialTypesSettings';
import LoanTypesSettings from './LoanTypesSettings';

const pages = [
  {
    route: 'materialtypes',
    label: 'Material Types',
    component: MaterialTypesSettings,
    perm: 'ui-inventory.settings.materialtypes',
  },
  {
    route: 'loantypes',
    label: 'Loan Types',
    component: LoanTypesSettings,
    perm: 'ui-inventory.settings.loantypes',
  },
];

export default props => <Settings {...props} pages={_.sortBy(pages, ['label'])} paneTitle="Inventory" />;
