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
} from '../../../components';
import {
  checkIfElementIsEmpty,
  checkIfArrayIsEmpty,
} from '../../../utils';

import AlternativeTitlesList from './AlternativeTitlesList';
import TitleSeriesStatements from './TitleSeriesStatements';

const InstanceTitleData = ({
  id,
  instance,
  titleTypes,
  identifierTypesById,
}) => {
  const precedingTitles = useMemo(() => {
    return checkIfArrayIsEmpty(instance.precedingTitles);
  }, [instance]);
  const succeedingTitles = useMemo(() => {
    return checkIfArrayIsEmpty(instance.succeedingTitles);
  }, [instance]);

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
        seriesStatements={instance.series}
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
  instance: PropTypes.object,
  titleTypes: PropTypes.arrayOf(PropTypes.object),
  identifierTypesById: PropTypes.func,
};

InstanceTitleData.defaultProps = {
  instance: {},
  titleTypes: [],
};

export default InstanceTitleData;
