import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';
import { segments } from '@folio/stripes-inventory-components';

import { ControllableDetail } from '../ControllableDetail';

const visibleColumns = ['subject'];
const getColumnMapping = intl => ({
  subject: intl.formatMessage({ id: 'ui-inventory.subjectHeadings' }),
});

const InstanceSubjectView = ({
  id,
  subjects,
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
  segment: PropTypes.oneOf(Object.values(segments)).isRequired,
  source: PropTypes.string.isRequired,
};

InstanceSubjectView.defaultProps = {
  subjects: [],
};

export default InstanceSubjectView;
