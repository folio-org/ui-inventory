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
} from '../../../constants';

const visibleColumns = ['Subject headings'];
const getColumnMapping = intl => ({
  'Subject headings': intl.formatMessage({ id: 'ui-inventory.subjectHeadings' })
});
const classificationsRowFormatter = {
  'Subject headings': item => item?.value || noValue
};

const InstanceSubjectView = ({
  id,
  subjects,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => checkIfArrayIsEmpty(
    subjects.map(subject => ({ value: subject }))
  ), [subjects]);

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.subject' })}
    >
      <MultiColumnList
        id="list-subject"
        contentData={contentData}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={classificationsRowFormatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.subject' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceSubjectView.propTypes = {
  id: PropTypes.string.isRequired,
  subjects: PropTypes.arrayOf(PropTypes.object),
};

InstanceSubjectView.defaultProps = {
  subjects: [],
};

export default InstanceSubjectView;
