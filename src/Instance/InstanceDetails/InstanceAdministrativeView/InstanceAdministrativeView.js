import React, {
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
  MessageBanner,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  ClipCopy,
} from '@folio/stripes/smart-components';

import {
  getDateWithTime,
  checkIfElementIsEmpty,
} from '../../../utils';

import StatisticalCodesList from './StatisticalCodesList';

const InstanceAdministrativeView = ({
  id,
  instance,
  instanceStatuses,
  issuanceModes,
  statisticalCodes,
  statisticalCodeTypes,
}) => {
  const instanceStatus = useMemo(() => {
    return instanceStatuses.find(status => status.id === instance.statusId) || {};
  }, [instance, instanceStatuses]);

  const issuanceMode = useMemo(() => {
    return issuanceModes.find(mode => mode.id === instance.modeOfIssuanceId) || {};
  }, [instance, issuanceModes]);

  const formattedStatisticalCodes = useMemo(() => {
    const statisticalCodeTypesMap = statisticalCodeTypes.reduce((acc, type) => {
      acc[type.id] = type.name;

      return acc;
    }, {});

    const statisticalCodesMap = statisticalCodes.reduce((acc, code) => {
      acc[code.id] = {
        ...code,
        type: statisticalCodeTypesMap[code.statisticalCodeTypeId],
      };

      return acc;
    }, {});

    return (instance.statisticalCodeIds || []).map(codeId => statisticalCodesMap[codeId]);
  }, [instance, statisticalCodeTypes, statisticalCodes]);

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceData" />}
    >
      {instance.metadata && <ViewMetaData metadata={instance.metadata} />}
      <Row>
        {
          instance.discoverySuppress &&
          <Col xs={5}>
            <MessageBanner type="warning">
              <FormattedMessage id="ui-inventory.warning.discoverySuppressed" />
            </MessageBanner>
          </Col>
        }
        {
          instance.staffSuppress &&
          <Col xs={4}>
            <MessageBanner type="warning">
              <FormattedMessage id="ui-inventory.warning.staffSuppressed" />
            </MessageBanner>
          </Col>
        }
        {
          instance.previouslyHeld &&
          <Col xs={3}>
            <MessageBanner type="warning">
              <FormattedMessage id="ui-inventory.warning.previouslyHeld" />
            </MessageBanner>
          </Col>
        }
      </Row>

      {(instance.discoverySuppress || instance.staffSuppress || instance.previouslyHeld) && <br />}

      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-inventory.instanceHrid" />}>
            {
              Boolean(instance.hrid) && (
                <>
                  {instance.hrid}
                  <ClipCopy text={instance.hrid} />
                </>
              )
            }
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.metadataSource" />}
            value={checkIfElementIsEmpty(instance.source)}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.catalogedDate" />}
            value={checkIfElementIsEmpty(instance.catalogedDate)}
          />
        </Col>
      </Row>
      {(instance.matchKey) &&
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.instanceMatchKey" />}
              value={instance.matchKey}
            />
          </Col>
        </Row>
      }
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.instanceStatusTerm" />}
            value={checkIfElementIsEmpty(instanceStatus.name)}
            subValue={
              <FormattedMessage
                id="ui-inventory.item.status.statusUpdatedLabel"
                values={{ statusDate: getDateWithTime(instance.statusUpdatedDate) }}
              />
            }
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.instanceStatusCode" />}
            value={checkIfElementIsEmpty(instanceStatus.code)}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.instanceStatusSource" />}
            value={checkIfElementIsEmpty(instanceStatus.source)}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
            value={checkIfElementIsEmpty(issuanceMode.name)}
          />
        </Col>
      </Row>

      <StatisticalCodesList statisticalCodes={formattedStatisticalCodes} />
    </Accordion>
  );
};

InstanceAdministrativeView.propTypes = {
  id: PropTypes.string.isRequired,
  instance: PropTypes.object,
  instanceStatuses: PropTypes.arrayOf(PropTypes.object),
  issuanceModes: PropTypes.arrayOf(PropTypes.object),
  statisticalCodes: PropTypes.arrayOf(PropTypes.object),
  statisticalCodeTypes: PropTypes.arrayOf(PropTypes.object),
};

InstanceAdministrativeView.defaultProps = {
  instance: {},
  instanceStatuses: [],
  issuanceModes: [],
  statisticalCodes: [],
  statisticalCodeTypes: [],
};

export default InstanceAdministrativeView;
