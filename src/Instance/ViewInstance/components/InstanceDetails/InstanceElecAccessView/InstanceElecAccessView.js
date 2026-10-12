import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  checkIfArrayIsEmpty,
} from '../../../../../utils';
import {
  wrappingCell,
} from '../../../../../constants';

const noValue = <NoValue />;

const visibleColumns = ['urlRelationship', 'uri', 'linkText', 'materialsSpecification', 'urlPublicNote'];
const columnWidths = {
  urlRelationship: '25%',
  uri: '25%',
  linkText: '25%',
  materialsSpecification: '25%',
  urlPublicNote: '25%',
};
const getColumnMapping = intl => ({
  urlRelationship: intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
  uri: intl.formatMessage({ id: 'ui-inventory.uri' }),
  linkText: intl.formatMessage({ id: 'ui-inventory.linkText' }),
  materialsSpecification: intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
  urlPublicNote: intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
});
const getFormatter = (elAccessRelationshipsMap) => ({
  urlRelationship: item => elAccessRelationshipsMap[item?.relationshipId] || noValue,
  uri: item => {
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
  linkText: item => item?.linkText || noValue,
  materialsSpecification: item => item?.materialsSpecification || noValue,
  urlPublicNote: item => item?.publicNote || noValue,
});

const InstanceElecAccessView = ({
  id,
  electronicAccessLines = [],
  electronicAccessRelationships = [],
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

export default InstanceElecAccessView;
