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
  checkIfArrayIsEmpty,
} from '../../../utils';

const noValue = <NoValue />;
const visibleColumns = ['administrativeNote'];
const getColumnMapping = intl => ({
  administrativeNote: intl.formatMessage({ id: 'ui-inventory.administrativeNote' })
});
const formatter = {
  administrativeNote: item => item?.value || noValue,
};

const AdministrativeNoteList = ({
  administrativeNotes,
}) => {
  const intl = useIntl();
  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => checkIfArrayIsEmpty(
    administrativeNotes.map(value => ({ value }))
  ), [administrativeNotes]);

  return (
    <MultiColumnList
      id="administrative-note-list"
      contentData={contentData}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
      ariaLabel={intl.formatMessage({ id: 'ui-inventory.administrativeNotes' })}
      interactive={false}
    />
  );
};

AdministrativeNoteList.propTypes = {
  administrativeNotes: PropTypes.arrayOf(PropTypes.string),
};

AdministrativeNoteList.defaultProps = {
  administrativeNotes: [],
};

export default AdministrativeNoteList;
