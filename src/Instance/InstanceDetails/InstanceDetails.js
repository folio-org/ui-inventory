import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  AppIcon,
  TitleManager,
} from '@folio/stripes/core';
import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import { InstanceTitle } from './InstanceTitle';
import { InstanceAdministrativeView } from './InstanceAdministrativeView';
import { InstanceTitleData } from './InstanceTitleData';
import { InstanceIdentifiersView } from './InstanceIdentifiersView';
import { InstanceContributorsView } from './InstanceContributorsView';
import { InstanceDescriptiveView } from './InstanceDescriptiveView';
import { InstanceNotesView } from './InstanceNotesView';
import { InstanceElecAccessView } from './InstanceElecAccessView';
import { InstanceSubjectView } from './InstanceSubjectView';
import { InstanceClassificationView } from './InstanceClassificationView';
import { InstanceRelationshipView } from './InstanceRelationshipView';
import { InstanceNewHolding } from './InstanceNewHolding';
import HelperApp from '../../components/HelperApp';

import {
  getAccordionState,
  getPublishingInfo,
} from './utils';

const accordions = {
  administrative: 'acc01',
  title: 'acc02',
  identifiers: 'acc03',
  contributors: 'acc04',
  descriptiveData: 'acc05',
  notes: 'acc06',
  electronicAccess: 'acc07',
  subjects: 'acc08',
  classifications: 'acc09',
  relationship: 'acc10',
};

const InstanceDetails = ({
  children,
  instance,
  onClose,
  actionMenu,
  referenceData,
  tagsEnabled,
  ...rest
}) => {
  const intl = useIntl();

  const publicationInfo = useMemo(() => getPublishingInfo(instance), [instance]);

  const title = useMemo(() => {
    return (
      <span data-test-instance-header-title>
        {
          intl.formatMessage({
            id: 'ui-inventory.instanceRecordTitle',
          }, {
            title: instance.title,
            publisherAndDate: publicationInfo ?? '',
          })
        }
      </span>
    );
  }, [instance, publicationInfo]);

  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);
  const [helperApp, setHelperApp] = useState();

  const showTagsHelperApp = useCallback(() => {
    setHelperApp('tags');
  }, []);

  const tags = instance?.tags?.tagList;

  const detailsLastMenu = useMemo(() => {
    return (
      <PaneMenu>
        {
          tagsEnabled && (
            <IconButton
              icon="tag"
              id="clickable-show-tags"
              onClick={showTagsHelperApp}
              badgeCount={tags?.length}
              ariaLabel={intl.formatMessage({ id: 'ui-inventory.showTags' })}
            />
          )
        }
      </PaneMenu>
    );
  }, [showTagsHelperApp, tagsEnabled, tags]);

  return (
    <>
      <Pane
        {...rest}
        data-test-instance-details
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={title}
        paneSub={publicationInfo}
        dismissible
        onClose={onClose}
        actionMenu={actionMenu}
        defaultWidth="fill"
        lastMenu={detailsLastMenu}
      >
        <TitleManager record={instance.title} />

        <AccordionStatus>
          <Row end="xs">
            <Col
              data-test-expand-all
              xs
            >
              <ExpandAllButton />
            </Col>
          </Row>

          <InstanceTitle
            instance={instance}
            instanceTypes={referenceData.instanceTypes}
          />

          <AccordionSet initialStatus={accordionState}>
            {children}

            <InstanceNewHolding instance={instance} />

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
            />

            <InstanceDescriptiveView
              id={accordions.descriptiveData}
              instance={instance}
              resourceTypes={referenceData.instanceTypes}
              resourceFormats={referenceData.instanceFormats}
              natureOfContentTerms={referenceData.natureOfContentTerms}
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
            />

            <InstanceClassificationView
              id={accordions.classifications}
              classifications={instance?.classifications}
              classificationTypes={referenceData.classificationTypes}
            />

            <InstanceRelationshipView
              id={accordions.relationship}
              instance={instance}
              relationTypes={referenceData.instanceRelationshipTypes}
            />
          </AccordionSet>
        </AccordionStatus>
      </Pane>
      { helperApp && <HelperApp appName={helperApp} onClose={setHelperApp} />}
    </>
  );
};

InstanceDetails.propTypes = {
  children: PropTypes.node,
  actionMenu: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  instance: PropTypes.object,
  referenceData: PropTypes.object,
  tagsToggle: PropTypes.func,
};

InstanceDetails.defaultProps = {
  instance: {},
  referenceData: {},
};

export default InstanceDetails;
