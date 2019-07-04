import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import MaterialTypesSettings from './MaterialTypesSettings';
import LoanTypesSettings from './LoanTypesSettings';
import ItemNoteTypesSettings from './ItemNoteTypesSettings';
import FormatsSettings from './FormatsSettings';
import ResourceTypesSettings from './ResourceTypesSettings';
import ContributorTypesSettings from './ContributorTypesSettings';
import URLRelationshipSettings from './URLRelationshipSettings';
import StatisticalCodeSettings from './StatisticalCodeSettings';
import InstanceStatusTypesSettings from './InstanceStatusTypesSettings';
import HoldingsTypeSettings from './HoldingsTypeSettings';
import ILLPolicy from './ILLPolicy';
import HoldingsNoteTypesSettings from './HoldingsNoteTypesSettings';
import CallNumberTypes from './CallNumberTypes';
import StatisticalCodeTypes from './StatisticalCodeTypes';
import AlternativeTitleTypesSettings from './AlternativeTitleTypesSettings';
import IdentifierTypesSettings from './IdentifierTypesSettings';


class InventorySettings extends React.Component {
  constructor(props) {
    super(props);

    this.sections = [
      {
        label: <FormattedMessage id="ui-inventory.instances" />,
        pages: [
          {
            route: 'alternativeTitleTypes',
            label: <FormattedMessage id="ui-inventory.alternativeTitleTypes" />,
            component: AlternativeTitleTypesSettings,
            perm: 'ui-inventory.settings.alternative-title-types',
          },
          {
            route: 'contributortypes',
            label: <FormattedMessage id="ui-inventory.contributorTypes" />,
            component: ContributorTypesSettings,
            perm: 'ui-inventory.settings.contributor-types',
          },
          {
            route: 'formats',
            label: <FormattedMessage id="ui-inventory.formats" />,
            component: FormatsSettings,
            perm: 'ui-inventory.settings.instance-formats',
          },
          {
            route: 'identifierTypes',
            label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
            component: IdentifierTypesSettings,
            perm: 'ui-inventory.settings.identifier-types',
          },
          {
            route: 'instanceStatusTypes',
            label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
            component: InstanceStatusTypesSettings,
            perm: 'ui-inventory.settings.instance-statuses',
          },
          {
            route: 'resourcetypes',
            label: <FormattedMessage id="ui-inventory.resourceTypes" />,
            component: ResourceTypesSettings,
            perm: 'ui-inventory.settings.instance-types',
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.holdings" />,
        pages: [
          {
            route: 'holdingsTypes',
            label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
            component: HoldingsTypeSettings,
            perm: 'ui-inventory.settings.holdings-types',
          },
          {
            route: 'ILLPolicy',
            label: <FormattedMessage id="ui-inventory.ILLPolicy" />,
            component: ILLPolicy,
            perm: 'ui-inventory.settings.ill-policies',
          },
          {
            route: 'holdingsNoteTypes',
            label: <FormattedMessage id="ui-inventory.holdingsNoteTypes" />,
            component: HoldingsNoteTypesSettings,
            perm: 'ui-inventory.settings.holdings-note-types',
          },

        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.items" />,
        pages: [
          {
            route: 'loantypes',
            label: <FormattedMessage id="ui-inventory.loanTypes" />,
            component: LoanTypesSettings,
            perm: 'ui-inventory.settings.loantypes',
          },
          {
            route: 'materialtypes',
            label: <FormattedMessage id="ui-inventory.materialTypes" />,
            component: MaterialTypesSettings,
            perm: 'ui-inventory.settings.materialtypes',
          },
          {
            route: 'itemNoteTypes',
            label: <FormattedMessage id="ui-inventory.itemNoteTypes" />,
            component: ItemNoteTypesSettings,
            perm: 'ui-inventory.settings.item-note-types',
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.instanceHoldingsItem" />,
        pages: [
          {
            route: 'StatisticalCodeSettings',
            label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
            component: StatisticalCodeSettings,
            perm: 'ui-inventory.settings.statistical-codes',
          },
          {
            route: 'statisticalCodeTypes',
            label: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
            component: StatisticalCodeTypes,
            perm: 'ui-inventory.settings.statistical-code-types',
          },
          {
            route: 'URLrelationship',
            label: <FormattedMessage id="ui-inventory.URLrelationship" />,
            component: URLRelationshipSettings,
            perm: 'ui-inventory.settings.electronic-access-relationships',
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.holdingsItems" />,
        pages: [
          {
            route: 'callNumberTypes',
            label: <FormattedMessage id="ui-inventory.callNumberTypes" />,
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
        paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
      />
    );
  }
}

export default InventorySettings;
