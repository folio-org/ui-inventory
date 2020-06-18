import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  checkIfArrayIsEmpty,
} from '../../../utils';
import {
  noValue,
  wrappingCell,
} from '../../../constants';

const visibleColumns = ['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note'];
const columnWidths = {
  'URL relationship': '25%',
  'URI': '25%',
  'Link text': '25%',
  'Materials specified': '25%',
  'URL public note': '25%',
};
const getColumnMapping = intl => ({
  'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
  'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
  'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
  'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
  'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
});
const getFormatter = (elAccessRelationshipsMap) => ({
  'URL relationship': item => elAccessRelationshipsMap[item?.relationshipId] || noValue,
  'URI': item => {
    const uri = item?.uri;

    return uri
      ? (
        <a
          href={uri}
          rel="noreferrer noopener"
          target="_blank"
          style={wrappingCell}
        >
          {uri}
        </a>
      )
      : noValue;
  },
  'Link text': item => item?.linkText || noValue,
  'Materials specified': item => item?.materialsSpecification || noValue,
  'URL public note': item => item?.publicNote || noValue,
});

const InstanceElecAccessView = ({
  id,
  electronicAccessLines,
  electronicAccessRelationships,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => checkIfArrayIsEmpty(electronicAccessLines), [electronicAccessLines]);
  const formatter = useMemo(() => {
    const elAccessRelationshipsMap = electronicAccessRelationships.reduce((acc, rel) => {
      acc[rel.id] = rel.name;

      return acc;
    }, {});

    return getFormatter(elAccessRelationshipsMap);
  }, [electronicAccessRelationships]);

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
    >
      <MultiColumnList
        id="list-electronic-access"
        contentData={contentData}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceElecAccessView.propTypes = {
  id: PropTypes.string.isRequired,
  electronicAccessLines: PropTypes.arrayOf(PropTypes.object),
  electronicAccessRelationships: PropTypes.arrayOf(PropTypes.object),
};

InstanceElecAccessView.defaultProps = {
  electronicAccessLines: [],
  electronicAccessRelationships: [],
};

export default InstanceElecAccessView;
