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
} from '../../../utils';

const noValue = <NoValue />;

const visibleColumns = ['subject'];
const getColumnMapping = intl => ({
  subject: intl.formatMessage({ id: 'ui-inventory.subjectHeadings' })
});
const formatter = {
  subject: item => item?.value || noValue,
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
};

InstanceSubjectView.defaultProps = {
  subjects: [],
};

export default InstanceSubjectView;
