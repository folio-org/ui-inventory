import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

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
import HoldingsSourcesSettings from './HoldingsSourcesSettings';
import CallNumberTypes from './CallNumberTypes';
import SingleRecordImport from './SingleRecordImport';
import TargetProfiles from './TargetProfiles';
import HRIDHandlingSettings from './HRIDHandling/HRIDHandlingSettings';
import StatisticalCodeTypes from './StatisticalCodeTypes';
import AlternativeTitleTypesSettings from './AlternativeTitleTypesSettings';
import IdentifierTypesSettings from './IdentifierTypesSettings';
import ClassificationTypesSettings from './ClassificationTypesSettings';
import ModesOfIssuanceSettings from './ModesOfIssuanceSettings';
import InstanceNoteTypesSettings from './InstanceNoteTypesSettings';
import NatureOfContentTermsSettings from './NatureOfContentTermsSettings';
import FastAddSettings from './FastAdd/FastAddSettings';

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
            perm: this.addPerm('ui-inventory.settings.alternative-title-types'),
          },
          {
            route: 'classificationTypes',
            label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
            component: ClassificationTypesSettings,
            perm: this.addPerm('ui-inventory.settings.classification-types'),
          },
          {
            route: 'contributortypes',
            label: <FormattedMessage id="ui-inventory.contributorTypes" />,
            component: ContributorTypesSettings,
            perm: this.addPerm('ui-inventory.settings.contributor-types'),
          },
          {
            route: 'formats',
            label: <FormattedMessage id="ui-inventory.formats" />,
            component: FormatsSettings,
            perm: this.addPerm('ui-inventory.settings.instance-formats'),
          },
          {
            route: 'instanceNoteTypes',
            label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
            component: InstanceNoteTypesSettings,
            perm: this.addPerm('ui-inventory.settings.instance-note-types'),
          },
          {
            route: 'instanceStatusTypes',
            label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
            component: InstanceStatusTypesSettings,
            perm: this.addPerm('ui-inventory.settings.instance-statuses'),
          },
          {
            route: 'modesOfIssuance',
            label: <FormattedMessage id="ui-inventory.modesOfIssuance" />,
            component: ModesOfIssuanceSettings,
            perm: this.addPerm('ui-inventory.settings.modes-of-issuance'),
          },
          {
            route: 'natureOfContentTerms',
            label: <FormattedMessage id="ui-inventory.natureOfContentTerms" />,
            component: NatureOfContentTermsSettings,
            perm: this.addPerm('ui-inventory.settings.nature-of-content-terms'),
          },
          {
            route: 'identifierTypes',
            label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
            component: IdentifierTypesSettings,
            perm: this.addPerm('ui-inventory.settings.identifier-types'),
          },
          {
            route: 'resourcetypes',
            label: <FormattedMessage id="ui-inventory.resourceTypes" />,
            component: ResourceTypesSettings,
            perm: this.addPerm('ui-inventory.settings.instance-types'),
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
            perm: this.addPerm('ui-inventory.settings.holdings-note-types'),
          },
          {
            route: 'holdingsSources',
            label: <FormattedMessage id="ui-inventory.holdingsSources" />,
            component: HoldingsSourcesSettings,
            perm: this.addPerm('ui-inventory.settings.holdings-sources'),
          },
          {
            route: 'holdingsTypes',
            label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
            component: HoldingsTypeSettings,
            perm: this.addPerm('ui-inventory.settings.holdings-types'),
          },
          {
            route: 'ILLPolicy',
            label: <FormattedMessage id="ui-inventory.ILLPolicy" />,
            component: ILLPolicy,
            perm: this.addPerm('ui-inventory.settings.ill-policies'),
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
            perm: this.addPerm('ui-inventory.settings.item-note-types'),
          },
          {
            route: 'loantypes',
            label: <FormattedMessage id="ui-inventory.loanTypes" />,
            component: LoanTypesSettings,
            perm: this.addPerm('ui-inventory.settings.loantypes'),
          },
          {
            route: 'materialtypes',
            label: <FormattedMessage id="ui-inventory.materialTypes" />,
            component: MaterialTypesSettings,
            perm: this.addPerm('ui-inventory.settings.materialtypes'),
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.instanceHoldingsItem" />,
        pages: [
          {
            route: 'fastAdd',
            label: <FormattedMessage id="ui-inventory.fastAdd" />,
            component: FastAddSettings,
            perm: this.addPerm('ui-inventory.settings.fast-add'),
          },
          {
            route: 'hridHandling',
            label: <FormattedMessage id="ui-inventory.hridHandling" />,
            component: HRIDHandlingSettings,
            perm: 'ui-inventory.settings.hrid-handling',
          },
          {
            route: 'statisticalCodeTypes',
            label: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
            component: StatisticalCodeTypes,
            perm: this.addPerm('ui-inventory.settings.statistical-code-types'),
          },
          {
            route: 'StatisticalCodeSettings',
            label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
            component: StatisticalCodeSettings,
            perm: this.addPerm('ui-inventory.settings.statistical-codes'),
          },
          {
            route: 'URLrelationship',
            label: <FormattedMessage id="ui-inventory.URLrelationship" />,
            component: URLRelationshipSettings,
            perm: this.addPerm('ui-inventory.settings.electronic-access-relationships'),
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
            perm: this.addPerm('ui-inventory.settings.call-number-types'),
          },
        ]
      },
    ];

    if (this.props.stripes.hasInterface('copycat-imports')) {
      this.sections.push({
        label: <FormattedMessage id="ui-inventory.integrations" />,
        pages: [
          {
            // XXX we will retain this one until we have the <EntryList>-based version working
            route: 'singleRecordImport',
            label: <FormattedMessage id="ui-inventory.singleRecordImport" />,
            component: SingleRecordImport,
            perm: 'ui-inventory.settings.single-record-import',
          },
          {
            route: 'targetProfiles',
            label: <FormattedMessage id="ui-inventory.targetProfiles" />,
            component: TargetProfiles,
            perm: 'ui-inventory.settings.single-record-import',
          },
        ]
      });
    }
  }

  addPerm = permission => {
    const { stripes } = this.props;

    return stripes.hasPerm(permission) ? permission : 'ui-inventory.settings.list.view';
  };

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
        data-test-inventory-settings
      />
    );
  }
}

InventorySettings.propTypes = {
  stripes: PropTypes.object,
};

export default InventorySettings;
