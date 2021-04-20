import React, { useMemo, useState, useContext } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
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
  MessageBanner,
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
import { DataContext } from '../../contexts';

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
  tagsEnabled,
  ...rest
}) => {
  const intl = useIntl();

  const referenceData = useContext(DataContext);

  const publicationInfo = useMemo(() => getPublishingInfo(instance), [instance]);
  const instanceTitle = instance?.title;

  const title = useMemo(() => {
    return (
      <span data-test-instance-header-title>
        {
          intl.formatMessage({
            id: 'ui-inventory.instanceRecordTitle',
          }, {
            title: instanceTitle,
            publisherAndDate: publicationInfo ?? '',
          })
        }
      </span>
    );
  }, [instanceTitle, intl, publicationInfo]);

  const accordionState = useMemo(() => getAccordionState(instance, accordions), [instance]);
  const [helperApp, setHelperApp] = useState();
  const tags = instance?.tags?.tagList;

  const detailsLastMenu = useMemo(() => {
    return (
      <PaneMenu>
        {
          tagsEnabled && (
            <IconButton
              icon="tag"
              id="clickable-show-tags"
              onClick={() => setHelperApp('tags')}
              badgeCount={tags?.length}
              ariaLabel={intl.formatMessage({ id: 'ui-inventory.showTags' })}
            />
          )
        }
      </PaneMenu>
    );
  }, [tagsEnabled, tags, intl]);

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
          <Row>
            <Col xs={10}>
              <MessageBanner show={Boolean(instance.staffSuppress && !instance.discoverySuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.staffSuppressed" />
              </MessageBanner>
              <MessageBanner show={Boolean(instance.discoverySuppress && !instance.staffSuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.suppressedFromDiscovery" />
              </MessageBanner>
              <MessageBanner show={Boolean(instance.discoverySuppress && instance.staffSuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.instance.suppressedFromDiscoveryAndStaffSuppressed" />
              </MessageBanner>
            </Col>
            <Col data-test-expand-all xs={2}>
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
  tagsToggle: PropTypes.func,
  tagsEnabled: PropTypes.bool,
};

InstanceDetails.defaultProps = {
  instance: {},
  tagsEnabled: false,
};

export default InstanceDetails;
