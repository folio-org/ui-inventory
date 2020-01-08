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
import HRIDHandlingSettings from './HRIDHandling/HRIDHandlingSettings';
import StatisticalCodeTypes from './StatisticalCodeTypes';
import AlternativeTitleTypesSettings from './AlternativeTitleTypesSettings';
import IdentifierTypesSettings from './IdentifierTypesSettings';
import ClassificationTypesSettings from './ClassificationTypesSettings';
import ModesOfIssuanceSettings from './ModesOfIssuanceSettings';
import InstanceNoteTypesSettings from './InstanceNoteTypesSettings';
import NatureOfContentTermsSettings from './NatureOfContentTermsSettings';

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
          },
          {
            route: 'classificationTypes',
            label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
            component: ClassificationTypesSettings,
          },
          {
            route: 'contributortypes',
            label: <FormattedMessage id="ui-inventory.contributorTypes" />,
            component: ContributorTypesSettings,
          },
          {
            route: 'formats',
            label: <FormattedMessage id="ui-inventory.formats" />,
            component: FormatsSettings,
          },
          {
            route: 'instanceNoteTypes',
            label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
            component: InstanceNoteTypesSettings,
          },
          {
            route: 'instanceStatusTypes',
            label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
            component: InstanceStatusTypesSettings,
          },
          {
            route: 'modesOfIssuance',
            label: <FormattedMessage id="ui-inventory.modesOfIssuance" />,
            component: ModesOfIssuanceSettings,
          },
          {
            route: 'natureOfContentTerms',
            label: <FormattedMessage id="ui-inventory.natureOfContentTerms" />,
            component: NatureOfContentTermsSettings,
          },
          {
            route: 'identifierTypes',
            label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
            component: IdentifierTypesSettings,
          },
          {
            route: 'resourcetypes',
            label: <FormattedMessage id="ui-inventory.resourceTypes" />,
            component: ResourceTypesSettings,
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.holdings" />,
        pages: [
          {
            route: 'holdingsNoteTypes',
            label: <FormattedMessage id="ui-inventory.holdingsNoteTypes" />,
            component: HoldingsNoteTypesSettings,
          },
          {
            route: 'holdingsTypes',
            label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
            component: HoldingsTypeSettings,
          },
          {
            route: 'ILLPolicy',
            label: <FormattedMessage id="ui-inventory.ILLPolicy" />,
            component: ILLPolicy,
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.items" />,
        pages: [
          {
            route: 'itemNoteTypes',
            label: <FormattedMessage id="ui-inventory.itemNoteTypes" />,
            component: ItemNoteTypesSettings,
          },
          {
            route: 'loantypes',
            label: <FormattedMessage id="ui-inventory.loanTypes" />,
            component: LoanTypesSettings,
          },
          {
            route: 'materialtypes',
            label: <FormattedMessage id="ui-inventory.materialTypes" />,
            component: MaterialTypesSettings,
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.instanceHoldingsItem" />,
        pages: [
          {
            route: 'hridHandling',
            label: <FormattedMessage id="ui-inventory.hridHandling" />,
            component: HRIDHandlingSettings,
          },
          {
            route: 'statisticalCodeTypes',
            label: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
            component: StatisticalCodeTypes,
          },
          {
            route: 'StatisticalCodeSettings',
            label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
            component: StatisticalCodeSettings,
          },
          {
            route: 'URLrelationship',
            label: <FormattedMessage id="ui-inventory.URLrelationship" />,
            component: URLRelationshipSettings,
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
          },
        ]
      }
    ];
  }

  addPerm() {
    this.sections.map(section => {
      const { pages } = section;
      return pages.map(page => {
        if (page.route !== 'hridHandling') {
          page.perm = 'ui-inventory.settings.list.view';
        }

        return page;
      });
    });
    return this.sections;
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.addPerm()}
        paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
        data-test-inventory-settings
      />
    );
  }
}

export default InventorySettings;
