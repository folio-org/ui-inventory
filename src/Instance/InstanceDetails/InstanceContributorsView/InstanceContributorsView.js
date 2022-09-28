import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import {
  Link,
} from 'react-router-dom';

import { AppIcon } from '@folio/stripes/core';
import {
  Accordion,
  MultiColumnList,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';

import {
  segments,
} from '../../../constants';
import {
  checkIfArrayIsEmpty,
} from '../../../utils';

import css from './InstanceContributorsView.css';

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
  contributors,
  contributorTypes,
  contributorNameTypes,
  source,
  segment,
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

  const getName = (item) => {
    const _segment = segment ?? segments.instances;

    if (_segment === segments.instances && source === 'MARC' && item.authorityId) {
      return (
        <>
          <Tooltip
            id="marc-authority-tooltip"
            text={intl.formatMessage({ id: 'ui-inventory.linkedToMarcAuthority' })}
          >
            {({ ref, ariaIds }) => (
              <Link
                to={`/marc-authorities/authorities/${item.authorityId}?segment=search`}
                target="_blank"
                ref={ref}
                aria-labelledby={ariaIds.text}
                data-testid="authority-app-link"
              >
                <AppIcon
                  size="small"
                  app="marc-authorities"
                  iconClassName={css.authorityIcon}
                />
              </Link>
            )}
          </Tooltip>
          {item.name || noValue}
        </>
      );
    }

    return item.name || noValue;
  };

  const formatter = {
    nameType: item => item.nameType || noValue,
    name: item => getName(item),
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
  contributors: PropTypes.arrayOf(PropTypes.object),
  contributorTypes: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  source: PropTypes.string.isRequired,
  segment: PropTypes.string,
};

InstanceContributorsView.defaultProps = {
  contributors: [],
  contributorTypes: [],
  contributorNameTypes: [],
};

export default InstanceContributorsView;
