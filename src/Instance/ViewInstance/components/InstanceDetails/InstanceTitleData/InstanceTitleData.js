import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';

import {
  TitlesView,
} from '../../../../../components';
import {
  checkIfElementIsEmpty,
  checkIfArrayIsEmpty,
} from '../../../../../utils';

import AlternativeTitlesList from './AlternativeTitlesList';
import TitleSeriesStatements from './TitleSeriesStatements';

const InstanceTitleData = ({
  id,
  segment,
  instance = {},
  titleTypes = [],
  identifierTypesById = {},
}) => {
  const precedingTitles = useMemo(() => {
    return checkIfArrayIsEmpty(instance.precedingTitles);
  }, [instance.precedingTitles]);
  const succeedingTitles = useMemo(() => {
    return checkIfArrayIsEmpty(instance.succeedingTitles);
  }, [instance.succeedingTitles]);
  const seriesStatements = useMemo(() => {
    return checkIfArrayIsEmpty(instance.series);
  }, [instance.series]);

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-inventory.titleData" />}
    >
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.resourceTitle" />}
            value={checkIfElementIsEmpty(instance.title)}
          />
        </Col>
      </Row>

      <AlternativeTitlesList
        titles={instance.alternativeTitles}
        titleTypes={titleTypes}
        source={instance.source}
        segment={segment}
      />

      <br />

      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.indexTitle" />}
            value={checkIfElementIsEmpty(instance.indexTitle)}
          />
        </Col>
      </Row>

      <TitleSeriesStatements
        seriesStatements={seriesStatements}
        source={instance.source}
        segment={segment}
      />

      <br />

      <TitlesView
        id="precedingTitles"
        titleKey="precedingInstanceId"
        label={<FormattedMessage id="ui-inventory.precedingTitles" />}
        titles={precedingTitles}
        identifierTypesById={identifierTypesById}
      />

      <br />

      <TitlesView
        id="succeedingTitles"
        titleKey="succeedingInstanceId"
        label={<FormattedMessage id="ui-inventory.succeedingTitles" />}
        titles={succeedingTitles}
        identifierTypesById={identifierTypesById}
      />
    </Accordion>
  );
};

InstanceTitleData.propTypes = {
  id: PropTypes.string.isRequired,
  segment: PropTypes.string.isRequired,
  instance: PropTypes.object,
  titleTypes: PropTypes.arrayOf(PropTypes.object),
  identifierTypesById: PropTypes.object,
};

export default InstanceTitleData;
