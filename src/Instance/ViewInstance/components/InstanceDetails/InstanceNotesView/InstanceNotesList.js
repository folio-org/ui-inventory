import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  staffOnlyFormatter,
  checkIfArrayIsEmpty,
} from '../../../../../utils';

const noValue = <NoValue />;

const visibleColumns = ['isStaffOnly', 'note'];
const getColumnMapping = (intl, notesType) => ({
  isStaffOnly: intl.formatMessage({ id: 'ui-inventory.staffOnly' }),
  note: notesType,
});
const columnWidths = {
  isStaffOnly: '25%',
  note: '75%',
};
const formatter = {
  isStaffOnly: item => (item.staffOnly === undefined ? noValue : staffOnlyFormatter(item)),
  note: item => item.note || noValue,
};

const InstanceNotesList = ({
  id,
  notesType,
  notes = [],
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl, notesType), [notesType]);
  const contentData = useMemo(() => {
    return checkIfArrayIsEmpty(notes);
  }, [notes]);

  return (
    <MultiColumnList
      id={id}
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      columnWidths={columnWidths}
      interactive={false}
    />
  );
};

InstanceNotesList.propTypes = {
  id: PropTypes.string.isRequired,
  notesType: PropTypes.node.isRequired,
  notes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceNotesList;
