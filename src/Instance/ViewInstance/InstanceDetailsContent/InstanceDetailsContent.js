import {
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Layout,
  Row,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import InstanceWarningBanners from '../components/InstanceWarningBanners';
import {
  InstanceAdministrativeView,
  InstanceClassificationView,
  InstanceContributorsView,
  InstanceDescriptiveView,
  InstanceElecAccessView,
  InstanceIdentifiersView,
  InstanceNewHolding,
  InstanceNotesView,
  InstanceRelationshipView,
  InstanceSubjectView,
  InstanceTitle,
  InstanceTitleData,
  InstanceAcquisition,
} from '../components/InstanceDetails';
import { ConsortialHoldings } from '../../HoldingsList/consortium';

import useReferenceData from '../../../hooks/useReferenceData';

import { isInstanceShadowCopy } from '../../../utils';
import { getAccordionState } from '../utils';

import css from './InstanceDetailsContent.css';

const accordions = {
  administrative: 'acc01',
  title: 'acc02',
  identifiers: 'acc03',
  contributors: 'acc04',
  descriptiveData: 'acc05',
  notes: 'instance-details-notes',
  electronicAccess: 'acc07',
  subjects: 'acc08',
  classifications: 'acc09',
  relationship: 'acc10',
  acquisition: 'acc11',
};

const InstanceDetailsContent = ({
  instance,
  tenantId,
  userTenantPermissions,
  holdingsSection,
}) => {
  const stripes = useStripes();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const accordionStatusRef = useRef();
  const prevInstanceId = useRef(instance?.id);
  const referenceData = useReferenceData();

  const [isAllExpanded, setIsAllExpanded] = useState();

  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);

  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
  const isConsortialHoldingsVisible = instance?.shared || isInstanceShadowCopy(instance?.source);
  const canCreateHoldings = stripes.hasPerm('ui-inventory.holdings.create');

  const onToggle = newState => {
    const isExpanded = Object.values(newState)[0];

    setIsAllExpanded(isExpanded);
  };

  const updatePrevInstanceId = id => {
    prevInstanceId.current = id;
  };

  const warningBannersClassNames = classNames(
    'display-flex full flex-align-items-center justify-end',
    css.hasMarginBottom,
  );

  return (
    <AccordionStatus ref={accordionStatusRef}>
      <Row>
        <Layout className={warningBannersClassNames}>
          <Col xs={10}>
            <InstanceWarningBanners instance={instance} />
          </Col>
          <Col xs={2}>
            <ExpandAllButton onToggle={onToggle} />
          </Col>
        </Layout>
      </Row>

      <InstanceTitle
        instance={instance}
        instanceTypes={referenceData.instanceTypes}
      />

      <AccordionSet initialStatus={accordionState}>
        {holdingsSection}

        <InstanceNewHolding
          instance={instance}
          tenantId={tenantId}
          isVisible={!isUserInCentralTenant && canCreateHoldings}
        />

        {isConsortialHoldingsVisible && (
          <ConsortialHoldings
            instance={instance}
            prevInstanceId={prevInstanceId.current}
            updatePrevInstanceId={updatePrevInstanceId}
            userTenantPermissions={userTenantPermissions}
            isAllExpanded={isAllExpanded}
          />
        )}

        <InstanceAdministrativeView
          id={accordions.administrative}
          instance={instance}
          instanceStatuses={referenceData.instanceStatuses}
          issuanceModes={referenceData.modesOfIssuance}
          statisticalCodes={referenceData.statisticalCodes}
          statisticalCodeTypes={referenceData.statisticalCodeTypes}
        />

        <InstanceTitleData
          id={accordions.title}
          instance={instance}
          titleTypes={referenceData.alternativeTitleTypes}
          identifierTypesById={referenceData.identifierTypesById}
          source={instance.source}
          segment={searchParams.get('segment')}
        />

        <InstanceIdentifiersView
          id={accordions.identifiers}
          identifiers={instance.identifiers}
          identifierTypes={referenceData.identifierTypes}
        />

        <InstanceContributorsView
          id={accordions.contributors}
          contributors={instance.contributors}
          contributorTypes={referenceData.contributorTypes}
          contributorNameTypes={referenceData.contributorNameTypes}
          source={instance.source}
          segment={searchParams.get('segment')}
        />

        <InstanceDescriptiveView
          id={accordions.descriptiveData}
          instance={instance}
          resourceTypes={referenceData.instanceTypes}
          resourceFormats={referenceData.instanceFormats}
          natureOfContentTerms={referenceData.natureOfContentTerms}
          instanceDateTypes={referenceData.instanceDateTypes}
        />

        <InstanceNotesView
          id={accordions.notes}
          instance={instance}
          noteTypes={referenceData.instanceNoteTypes}
        />

        <InstanceElecAccessView
          id={accordions.electronicAccess}
          electronicAccessLines={instance.electronicAccess}
          electronicAccessRelationships={referenceData.electronicAccessRelationships}
        />

        <InstanceSubjectView
          id={accordions.subjects}
          subjects={instance.subjects}
          subjectSources={referenceData.subjectSources}
          subjectTypes={referenceData.subjectTypes}
          source={instance.source}
          segment={searchParams.get('segment')}
        />

        <InstanceClassificationView
          id={accordions.classifications}
          classifications={instance?.classifications}
          classificationTypes={referenceData.classificationTypes}
        />

        <InstanceAcquisition
          accordionId={accordions.acquisition}
          instanceId={instance.id}
        />

        <InstanceRelationshipView
          id={accordions.relationship}
          parentInstances={instance.parentInstances}
          childInstances={instance.childInstances}
        />
      </AccordionSet>
    </AccordionStatus>
  );
};

InstanceDetailsContent.propTypes = {
  instance: PropTypes.object.isRequired,
  tenantId: PropTypes.string,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
  holdingsSection: PropTypes.node,
};

export default InstanceDetailsContent;
