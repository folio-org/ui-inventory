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

import { MarcAuthorityLink } from '../MarcAuthorityLink';
import { segments } from '../../../constants';

const noValue = <NoValue />;

const visibleColumns = ['subject'];
const getColumnMapping = intl => ({
  subject: intl.formatMessage({ id: 'ui-inventory.subjectHeadings' }),
});

const getSubjectItem = (item, segment, source) => {
  const _segment = segment ?? segments.instances;

  if (_segment === segments.instances && source === 'MARC' && item.authorityId) {
    return (
      <MarcAuthorityLink authorityId={item.authorityId}>
        {item.value}
      </MarcAuthorityLink>
    );
  }

  return item.value || noValue;
};

const InstanceSubjectView = ({
  id,
  subjects,
  segment,
  source,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);

  const formatter = {
    subject: item => getSubjectItem(item, segment, source),
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
  subjects: PropTypes.arrayOf(PropTypes.string),
  segment: PropTypes.oneOf([Object.values(segments)]).isRequired,
  source: PropTypes.string.isRequired,
};

InstanceSubjectView.defaultProps = {
  subjects: [],
};

export default InstanceSubjectView;
