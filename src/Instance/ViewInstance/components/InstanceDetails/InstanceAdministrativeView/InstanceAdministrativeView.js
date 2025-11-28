import React, {
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
  Highlighter,
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  ClipCopy,
} from '@folio/stripes/smart-components';

import {
  getDateWithTime,
  checkIfElementIsEmpty,
} from '../../../../../utils';
import {
  WarningMessage,
  AdministrativeNoteList,
} from '../../../../../components';

import {
  QUERY_INDEXES,
  SOURCE_VALUES,
} from '../../../../../constants';

import StatisticalCodesList from './StatisticalCodesList';

const InstanceAdministrativeView = ({
  id,
  instance = {},
  instanceStatuses = [],
  issuanceModes = [],
  statisticalCodes = [],
  statisticalCodeTypes = [],
}) => {
  const { search } = useLocation();

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

  const getSourceValue = (source) => {
    if (!source || source === '-') {
      return <NoValue />;
    }

    return SOURCE_VALUES[source] ?? source;
  };

  const queryHRID = queryString.parse(search)?.query;
  const isQueryByHRID = queryString.parse(search)?.qindex === QUERY_INDEXES.INSTANCE_HRID;

  const highlightableInstanceHRID = isQueryByHRID ? <Highlighter searchWords={[queryHRID]} text={String(instance.hrid)} /> : instance.hrid;

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.instanceData" />}
    >
      {instance.metadata && <ViewMetaData metadata={instance.metadata} />}
      <Row>
        {
          instance.deleted &&
          <Col xs={3}>
            <WarningMessage id="ui-inventory.setForDeletion" />
          </Col>
        }
        {
          instance.discoverySuppress &&
          <Col xs={3}>
            <WarningMessage id="ui-inventory.discoverySuppressed" />
          </Col>
        }
        {
          instance.staffSuppress &&
          <Col xs={3}>
            <WarningMessage id="ui-inventory.staffSuppressed" />
          </Col>
        }
        {
          instance.previouslyHeld &&
          <Col xs={3}>
            <WarningMessage id="ui-inventory.previouslyHeld" />
          </Col>
        }
      </Row>

      {(instance.deleted || instance.discoverySuppress || instance.staffSuppress || instance.previouslyHeld) && <br />}

      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-inventory.instanceHrid" />}>
            {
              Boolean(instance.hrid) && (
                <>
                  {highlightableInstanceHRID}
                  <ClipCopy text={instance.hrid} />
                </>
              )
            }
          </KeyValue>
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.metadataSource" />}
            value={getSourceValue(instance.source)}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.sourceUri" />}
          >
            <TextLink href={instance.sourceUri} target="_blank" rel="noreferrer">
              {instance.sourceUri || <NoValue />}
            </TextLink>
          </KeyValue>
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

      <Row>
        <Col xs={12}>
          <StatisticalCodesList statisticalCodes={formattedStatisticalCodes} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <AdministrativeNoteList administrativeNotes={instance.administrativeNotes} />
        </Col>
      </Row>
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

export default InstanceAdministrativeView;
