import _ from 'lodash';
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import PlaceholderSettings from './PlaceholderSettings';


const pages = [
  {
    route: 'placeholder',
    label: 'Placeholder',
    component: PlaceholderSettings,
    perm: 'ui-inventory.settings.placeholder',
  },
];

export default props => <Settings {...props} pages={_.sortBy(pages, ['label'])} paneTitle="Inventor" />;
