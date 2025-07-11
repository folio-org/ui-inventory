import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { ControllableDetail } from '../ControllableDetail';
import { checkIfArrayIsEmpty } from '../../../../../utils';

const noValue = <NoValue />;

const visibleColumns = ['nameType', 'name', 'type', 'freeText', 'primary'];
const getColumnMapping = intl => ({
  nameType: intl.formatMessage({ id: 'ui-inventory.nameType' }),
  name: intl.formatMessage({ id: 'ui-inventory.name' }),
  type: intl.formatMessage({ id: 'ui-inventory.type' }),
  freeText: intl.formatMessage({ id: 'ui-inventory.freeText' }),
  primary: intl.formatMessage({ id: 'ui-inventory.primary' }),
});
const columnWidths = {
  nameType: '25%',
  name: '25%',
  type: '12%',
  freeText: '13%',
};

const InstanceContributorsView = ({
  id,
  source,
  contributors = [],
  contributorTypes = [],
  contributorNameTypes = [],
  segment = '',
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    const contributorNameTypesMap = contributorNameTypes.reduce((acc, nameType) => {
      acc[nameType.id] = nameType.name;

      return acc;
    }, {});

    const contributorTypesMap = contributorTypes.reduce((acc, type) => {
      acc[type.id] = type.name;

      return acc;
    }, {});

    return checkIfArrayIsEmpty(
      contributors.map(contributor => ({
        ...contributor,
        nameType: contributorNameTypesMap[contributor.contributorNameTypeId],
        type: contributorTypesMap[contributor.contributorTypeId],
      }))
    );
  }, [contributors, contributorTypes, contributorNameTypes]);

  const formatter = {
    nameType: item => item.nameType || noValue,
    name: item => (
      <ControllableDetail
        authorityId={item.authorityId}
        value={item.name}
        segment={segment}
        source={source}
      />
    ),
    type: item => item.type || noValue,
    freeText: item => item.contributorTypeText || noValue,
    primary: item => (item.primary ? <FormattedMessage id="ui-inventory.primary" /> : noValue),
  };

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.contributor' })}
    >
      <MultiColumnList
        id="list-contributors"
        columnIdPrefix="contributors"
        contentData={contentData}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.contributor' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceContributorsView.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  segment: PropTypes.string,
};

export default InstanceContributorsView;
