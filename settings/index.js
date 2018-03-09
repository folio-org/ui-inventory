import _ from 'lodash';
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import MaterialTypesSettings from './MaterialTypesSettings';

const pages = [
  {
    route: 'materialtypes',
    label: 'Material Types',
    component: MaterialTypesSettings,
    perm: 'ui-inventory.settings.materialtypes',
  },
];

export default props => <Settings {...props} pages={_.sortBy(pages, ['label'])} paneTitle="Inventor" />;
