import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  KeyValue,
  Layout,
  MessageBanner,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { effectiveCallNumber } from '@folio/stripes/util';
import { TagsAccordion } from '@folio/stripes/smart-components';

import ItemViewSubheader from '../ItemViewSubheader';
import AdministrativeData from '../../sections/AdministrativeData';
import BoundPiecesData from '../../sections/BoundPiecesData';
import BoundWithAndAnalytics from '../../sections/BoundWithAndAnalytics';
import CirculationHistory from '../../sections/CirculationHistory';
import Condition from '../../sections/Condition';
import ElectronicAccess from '../../sections/ElectronicAccess';
import EnumerationData from '../../sections/EnumerationData';
import ItemAcquisition from '../../sections/ItemAcquisition';
import ItemData from '../../sections/ItemData';
import ItemNotesSection from '../../sections/ItemNotes';
import LoanAndAvailability from '../../sections/LoanAndAvailability';
import Location from '../../sections/Location';

import useItemDetailsData from '../../../hooks/useItemDetailsData';

const ItemDetailsContent = ({
  item,
  instance,
  holdings,
  referenceTables,
  accordionStatusRef,
  refLookup,
  isTagsEnabled,
  requestCount,
  requestsUrl,
}) => {
  const holdingLocation = useMemo(() => {
    const { locationsById } = referenceTables;

    const permanentHoldingsLocation = locationsById[holdings.permanentLocationId];
    const temporaryHoldingsLocation = locationsById[holdings.temporaryLocationId];

    return {
      permanentLocation: {
        name: get(permanentHoldingsLocation, 'name', <NoValue />),
        isActive: permanentHoldingsLocation?.isActive,
      },
      temporaryLocation: {
        name: get(temporaryHoldingsLocation, 'name', <NoValue />),
        isActive: temporaryHoldingsLocation?.isActive,
      },
    };
  }, [holdings]);

  const {
    itemLocation,
    administrativeData,
    itemData,
    enumerationData,
    condition,
    itemNotes,
    loanAndAvailability,
    electronicAccess,
    circulationHistory,
    boundWithTitles,
    initialAccordionsState,
  } = useItemDetailsData({
    item,
    instance,
    refLookup,
    referenceTables,
    requestCount,
    requestsUrl,
    holdingLocation,
  });

  // getEntity needs to return an object from a closure so that Tags can compare old and new entity versions
  const getEntity = () => item;
  const getEntityTags = () => item.tags?.tagList || [];

  return (
    <>
      <ItemViewSubheader
        item={item}
        instance={instance}
        holdingsRecord={holdings}
        holdingLocation={holdingLocation}
      />
      <br />
      <AccordionStatus ref={accordionStatusRef}>
        <Row>
          <Col xs={2}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
              value={itemLocation.effectiveLocation?.name}
              subValue={itemLocation.effectiveLocation?.isActive === false &&
                <FormattedMessage id="ui-inventory.inactive" />
              }
              data-testid="item-effective-location"
            />
          </Col>
          <Col xs={2}>
            <Layout className="display-flex flex-align-items-start">
              <KeyValue
                label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                value={effectiveCallNumber(item)}
              />
            </Layout>
          </Col>
          <Col xs={7}>
            <Row middle="xs">
              <MessageBanner show={Boolean(item.discoverySuppress)} type="warning">
                <FormattedMessage id="ui-inventory.warning.item.suppressedFromDiscovery" />
              </MessageBanner>
            </Row>
          </Col>
          <Col xs={1}>
            <Row end="xs">
              <Col>
                <ExpandAllButton />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <AccordionSet initialStatus={initialAccordionsState}>
          <AdministrativeData
            item={item}
            administrativeData={administrativeData}
            referenceTables={referenceTables}
            refLookup={refLookup}
          />
          <ItemData itemData={itemData} refLookup={refLookup} referenceTables={referenceTables} />
          <EnumerationData enumerationData={enumerationData} />
          <Condition condition={condition} />
          {isTagsEnabled && (
            <TagsAccordion
              link={`inventory/items/${item.id}`}
              getEntity={getEntity}
              getEntityTags={getEntityTags}
              entityTagsPath="tags"
              hasOptimisticLocking
            />
          )}
          <ItemNotesSection
            referenceTables={referenceTables}
            item={item}
            itemNotes={itemNotes}
          />
          <LoanAndAvailability
            loanAndAvailability={loanAndAvailability}
            item={item}
          />
          <Location
            holdingLocation={holdingLocation}
            itemLocation={itemLocation}
          />
          {
            item.purchaseOrderLineIdentifier && (
              <ItemAcquisition
                itemId={item.id}
                accordionId="itemAcquisitionAccordion"
              />
            )
          }
          <ElectronicAccess
            electronicAccess={electronicAccess.electronicAccess}
            refLookup={refLookup}
            electronicAccessRelationships={referenceTables.electronicAccessRelationships}
          />
          <CirculationHistory circulationHistory={circulationHistory} />
          <BoundWithAndAnalytics boundWithTitles={boundWithTitles} />
          <BoundPiecesData
            itemId={item.id}
            instanceId={instance.id}
          />
        </AccordionSet>
      </AccordionStatus>
    </>
  );
};

ItemDetailsContent.propTypes = {
  item: PropTypes.object.isRequired,
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.object.isRequired,
  referenceTables: PropTypes.object.isRequired,
  accordionStatusRef: PropTypes.object,
  refLookup: PropTypes.func,
  isTagsEnabled: PropTypes.bool,
  requestCount: PropTypes.number,
  requestsUrl: PropTypes.string,
};

export default ItemDetailsContent;
