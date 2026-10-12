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
import { segments } from '@folio/stripes-inventory-components';

import { ControllableDetail } from '../ControllableDetail';

const visibleColumns = ['subject', 'subjectSource', 'subjectType'];
const getColumnMapping = intl => ({
  subject: intl.formatMessage({ id: 'ui-inventory.subjectHeadings' }),
  subjectSource: intl.formatMessage({ id: 'ui-inventory.subjectSource' }),
  subjectType: intl.formatMessage({ id: 'ui-inventory.subjectType' }),
});

const InstanceSubjectView = ({
  id,
  subjects = [],
  subjectSources = [],
  subjectTypes = [],
  segment,
  source,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);

  const formatter = {
    subject: item => (
      <ControllableDetail
        authorityId={item.authorityId}
        value={item.value}
        segment={segment}
        source={source}
      />
    ),
    subjectSource: item => subjectSources.find(src => src.id === item.sourceId)?.name || <NoValue />,
    subjectType: item => subjectTypes.find(type => type.id === item.typeId)?.name || <NoValue />,
  };

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.subject' })}
    >
      <MultiColumnList
        id="list-subject"
        contentData={subjects}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={formatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.subject' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceSubjectView.propTypes = {
  id: PropTypes.string.isRequired,
  segment: PropTypes.oneOf(Object.values(segments)).isRequired,
  source: PropTypes.string.isRequired,
  subjects: PropTypes.arrayOf(PropTypes.object),
  subjectSources: PropTypes.arrayOf(PropTypes.object),
  subjectTypes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceSubjectView;
