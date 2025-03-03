import {
  useRef,
  useEffect,
} from 'react';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import {
  TitleManager,
  useStripes,
  useUserTenantPermissions,
  checkIfUserInMemberTenant,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';

import MaterialTypesSettings from '../MaterialTypesSettings';
import LoanTypesSettings from '../LoanTypesSettings';
import ItemNoteTypesSettings from '../ItemNoteTypesSettings';
import FormatsSettings from '../FormatsSettings';
import ResourceTypesSettings from '../ResourceTypesSettings';
import ContributorTypesSettings from '../ContributorTypesSettings';
import URLRelationshipSettings from '../URLRelationshipSettings';
import StatisticalCodeSettings from '../StatisticalCodeSettings';
import InstanceStatusTypesSettings from '../InstanceStatusTypesSettings';
import HoldingsTypeSettings from '../HoldingsTypeSettings';
import ILLPolicy from '../ILLPolicy';
import HoldingsNoteTypesSettings from '../HoldingsNoteTypesSettings';
import HoldingsSourcesSettings from '../HoldingsSourcesSettings';
import CallNumberTypes from '../CallNumberTypes';
import TargetProfiles from '../TargetProfiles';
import HRIDHandlingSettings from '../HRIDHandling/HRIDHandlingSettings';
import StatisticalCodeTypes from '../StatisticalCodeTypes';
import AlternativeTitleTypesSettings from '../AlternativeTitleTypesSettings';
import IdentifierTypesSettings from '../IdentifierTypesSettings';
import ClassificationTypesSettings from '../ClassificationTypesSettings';
import ModesOfIssuanceSettings from '../ModesOfIssuanceSettings';
import InstanceNoteTypesSettings from '../InstanceNoteTypesSettings';
import NatureOfContentTermsSettings from '../NatureOfContentTermsSettings';
import FastAddSettings from '../FastAdd/FastAddSettings';
import ClassificationBrowseSettings from '../ClassificationBrowseSettings';
import SubjectSourcesSettings from '../SubjectSourcesSettings';
import SubjectTypesSettings from '../SubjectTypesSettings';
import DisplaySettings from '../DisplaySettings';
import CallNumberBrowseSettings from '../CallNumberBrowseSettings';
import {
  flattenCentralTenantPermissions,
  isUserInConsortiumMode,
} from '../../utils';

const InventorySettings = (props) => {
  const stripes = useStripes();
  const intl = useIntl();
  const paneTitleRef = useRef();

  useEffect(() => {
    if (paneTitleRef.current) {
      paneTitleRef.current.focus();
    }
  }, []);

  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const isUserInMemberTenant = checkIfUserInMemberTenant(stripes);

  const {
    userPermissions: centralTenantPermissions,
    isFetched: isCentralTenantPermissionsFetched,
  } = useUserTenantPermissions({
    tenantId: centralTenantId,
  }, {
    enabled: Boolean(isUserInMemberTenant) && Boolean(centralTenantId),
  });

  const addPerm = permission => {
    return stripes.hasPerm(permission) ? permission : 'ui-inventory.settings.list.view';
  };

  const getSections = (_centralTenantPermissions) => {
    const hasPermission = (perm) => {
      return isUserInConsortiumMode(stripes)
        ? checkIfUserInCentralTenant(stripes) || flattenCentralTenantPermissions(_centralTenantPermissions).has(perm)
        : true;
    };

    const _sections = [
      {
        label: <FormattedMessage id="ui-inventory.settings.heading.general" />,
        pages: [
          {
            route: 'displaySettings',
            label: <FormattedMessage id="ui-inventory.settings.section.displaySettings" />,
            component: DisplaySettings,
            perm: 'ui-inventory.settings.displaySettings',
          },
        ],
      },
      {
        label: <FormattedMessage id="ui-inventory.instances" />,
        pages: [
          {
            route: 'alternativeTitleTypes',
            label: <FormattedMessage id="ui-inventory.alternativeTitleTypes" />,
            component: AlternativeTitleTypesSettings,
            perm: addPerm('ui-inventory.settings.alternative-title-types'),
          },
          ...(hasPermission('ui-inventory.settings.classification-browse') ? [{
            route: 'classificationBrowse',
            label: <FormattedMessage id="ui-inventory.classificationBrowse" />,
            component: ClassificationBrowseSettings,
            perm: 'ui-inventory.settings.classification-browse',
          }] : []),
          {
            route: 'classificationTypes',
            label: <FormattedMessage id="ui-inventory.classificationIdentifierTypes" />,
            component: ClassificationTypesSettings,
            perm: addPerm('ui-inventory.settings.classification-types'),
          },
          {
            route: 'contributortypes',
            label: <FormattedMessage id="ui-inventory.contributorTypes" />,
            component: ContributorTypesSettings,
            perm: addPerm('ui-inventory.settings.contributor-types'),
          },
          {
            route: 'formats',
            label: <FormattedMessage id="ui-inventory.formats" />,
            component: FormatsSettings,
            perm: addPerm('ui-inventory.settings.instance-formats'),
          },
          {
            route: 'instanceNoteTypes',
            label: <FormattedMessage id="ui-inventory.instanceNoteTypes" />,
            component: InstanceNoteTypesSettings,
            perm: addPerm('ui-inventory.settings.instance-note-types'),
          },
          {
            route: 'instanceStatusTypes',
            label: <FormattedMessage id="ui-inventory.instanceStatusTypes" />,
            component: InstanceStatusTypesSettings,
            perm: addPerm('ui-inventory.settings.instance-statuses'),
          },
          {
            route: 'modesOfIssuance',
            label: <FormattedMessage id="ui-inventory.modesOfIssuance" />,
            component: ModesOfIssuanceSettings,
            perm: addPerm('ui-inventory.settings.modes-of-issuance'),
          },
          {
            route: 'natureOfContentTerms',
            label: <FormattedMessage id="ui-inventory.natureOfContentTerms" />,
            component: NatureOfContentTermsSettings,
            perm: addPerm('ui-inventory.settings.nature-of-content-terms'),
          },
          {
            route: 'identifierTypes',
            label: <FormattedMessage id="ui-inventory.resourceIdentifierTypes" />,
            component: IdentifierTypesSettings,
            perm: addPerm('ui-inventory.settings.identifier-types'),
          },
          {
            route: 'resourcetypes',
            label: <FormattedMessage id="ui-inventory.resourceTypes" />,
            component: ResourceTypesSettings,
            perm: addPerm('ui-inventory.settings.instance-types'),
          },
          {
            route: 'subjectsources',
            label: <FormattedMessage id="ui-inventory.subjectSources" />,
            component: SubjectSourcesSettings,
            perm: addPerm('ui-inventory.settings.subject-sources'),
          },
          {
            route: 'subjecttypes',
            label: <FormattedMessage id="ui-inventory.subjectTypes" />,
            component: SubjectTypesSettings,
            perm: addPerm('ui-inventory.settings.subject-types'),
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
            perm: addPerm('ui-inventory.settings.holdings-note-types'),
          },
          {
            route: 'holdingsSources',
            label: <FormattedMessage id="ui-inventory.holdingsSources" />,
            component: HoldingsSourcesSettings,
            perm: addPerm('ui-inventory.settings.holdings-sources'),
          },
          {
            route: 'holdingsTypes',
            label: <FormattedMessage id="ui-inventory.holdingsTypes" />,
            component: HoldingsTypeSettings,
            perm: addPerm('ui-inventory.settings.holdings-types'),
          },
          {
            route: 'ILLPolicy',
            label: <FormattedMessage id="ui-inventory.ILLPolicy" />,
            component: ILLPolicy,
            perm: addPerm('ui-inventory.settings.ill-policies'),
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
            perm: addPerm('ui-inventory.settings.item-note-types'),
          },
          {
            route: 'loantypes',
            label: <FormattedMessage id="ui-inventory.loanTypes" />,
            component: LoanTypesSettings,
            perm: addPerm('ui-inventory.settings.loan-types'),
          },
          {
            route: 'materialtypes',
            label: <FormattedMessage id="ui-inventory.materialTypes" />,
            component: MaterialTypesSettings,
            perm: addPerm('ui-inventory.settings.material-types'),
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
            perm: addPerm('ui-inventory.settings.fast-add'),
          },
          {
            route: 'hridHandling',
            label: <FormattedMessage id="ui-inventory.hridHandling" />,
            component: HRIDHandlingSettings,
            perm: addPerm('ui-inventory.settings.hrid-handling'),
          },
          {
            route: 'statisticalCodeTypes',
            label: <FormattedMessage id="ui-inventory.statisticalCodeTypes" />,
            component: StatisticalCodeTypes,
            perm: addPerm('ui-inventory.settings.statistical-code-types'),
          },
          {
            route: 'StatisticalCodeSettings',
            label: <FormattedMessage id="ui-inventory.statisticalCodes" />,
            component: StatisticalCodeSettings,
            perm: addPerm('ui-inventory.settings.statistical-codes'),
          },
          {
            route: 'URLrelationship',
            label: <FormattedMessage id="ui-inventory.URLrelationship" />,
            component: URLRelationshipSettings,
            perm: addPerm('ui-inventory.settings.electronic-access-relationships'),
          },
        ]
      },
      {
        label: <FormattedMessage id="ui-inventory.holdingsItems" />,
        pages: [
          ...(hasPermission('ui-inventory.settings.call-number-browse') ? [{
            route: 'callNumberBrowse',
            label: <FormattedMessage id="ui-inventory.callNumberBrowse" />,
            component: CallNumberBrowseSettings,
            perm: 'ui-inventory.settings.call-number-browse',
          }] : []),
          {
            route: 'callNumberTypes',
            label: <FormattedMessage id="ui-inventory.callNumberTypes" />,
            component: CallNumberTypes,
            perm: addPerm('ui-inventory.settings.call-number-types'),
          },
        ]
      },
    ];

    if (stripes.hasInterface('copycat-imports') && stripes.hasInterface('data-import-converter-storage', '1.3')) {
      _sections.push({
        label: <FormattedMessage id="ui-inventory.integrations" />,
        pages: [
          {
            route: 'targetProfiles',
            label: <FormattedMessage id="ui-inventory.targetProfiles" />,
            component: TargetProfiles,
            perm: 'ui-inventory.settings.single-record-import',
          },
        ]
      });
    }

    return _sections;
  };

  if (isUserInConsortiumMode(stripes) && (!centralTenantId || (isUserInMemberTenant && !isCentralTenantPermissionsFetched))) {
    return <LoadingPane defaultWidth="15%" />;
  }

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-inventory.settings.inventory.title' })}>
      <Settings
        {...props}
        sections={getSections(centralTenantPermissions)}
        paneTitle={<FormattedMessage id="ui-inventory.inventory.label" />}
        paneTitleRef={paneTitleRef}
        data-test-inventory-settings
      />
    </TitleManager>
  );
};

export default InventorySettings;
