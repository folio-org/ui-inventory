import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { MarcAuthorityLink } from '../MarcAuthorityLink';
import { checkIfArrayIsEmpty } from '../../../utils';
import { segments } from '../../../constants';

const noValue = <NoValue />;

const rowMetadata = ['alternativeTitleTypeId'];
const visibleColumns = ['type', 'title'];
const getColumnMapping = intl => ({
  type: intl.formatMessage({ id: 'ui-inventory.alternativeTitleType' }),
  title: intl.formatMessage({ id: 'ui-inventory.alternativeTitle' }),
});
const columnWidths = {
  type: '25%',
  title: '75%',
};

const getTitleItem = (item, segment, source) => {
  const _segment = segment ?? segments.instances;

  if (_segment === segments.instances && source === 'MARC' && item.authorityId) {
    return (
      <MarcAuthorityLink authorityId={item.authorityId}>
        {item.alternativeTitle}
      </MarcAuthorityLink>
    );
  }

  return item.alternativeTitle || noValue;
};

const AlternativeTitlesList = ({
  titles,
  titleTypes,
  source,
  segment,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    const titleTypesMap = titleTypes.reduce((acc, type) => {
      acc[type.id] = type.name;

      return acc;
    }, {});

    return checkIfArrayIsEmpty(
      titles.map(title => ({
        ...title,
        type: titleTypesMap[title.alternativeTitleTypeId],
      }))
    );
  }, [titles, titleTypes]);

  const formatter = {
    type: item => item.type || noValue,
    title: item => getTitleItem(item, segment, source),
  };

  return (
    <MultiColumnList
      id="list-alternative-titles"
      columnIdPrefix="alternative-titles"
      rowMetadata={rowMetadata}
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.alternativeTitles' })}
      interactive={false}
    />
  );
};

AlternativeTitlesList.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.object),
  titleTypes: PropTypes.arrayOf(PropTypes.object),
  segment: PropTypes.oneOf([Object.values(segments)]).isRequired,
  source: PropTypes.string.isRequired,
};

AlternativeTitlesList.defaultProps = {
  titles: [],
  titleTypes: [],
};

export default AlternativeTitlesList;
