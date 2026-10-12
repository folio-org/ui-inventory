import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import TitleCell from './TitleCell';

import { getIdentifiers } from '../../utils';
import { indentifierTypeNames } from '../../constants';

const TitlesViews = ({
  titles,
  id,
  titleKey,
  label,
  identifierTypesById,
}) => {
  const {
    ISSN,
    ISBN,
  } = indentifierTypeNames;

  const formatter = {
    title: row => (
      <TitleCell
        rowData={row}
        titleKey={titleKey}
        identifierTypesById={identifierTypesById}
      />
    ),
    hrid: row => row.hrid || <NoValue />,
    issn: row => getIdentifiers(row.identifiers, ISSN, identifierTypesById) || <NoValue />,
    isbn: row => getIdentifiers(row.identifiers, ISBN, identifierTypesById) || <NoValue />,
  };

  const visibleColumns = [
    'title',
    'hrid',
    'isbn',
    'issn',
  ];

  const columnMapping = {
    title: <FormattedMessage id="ui-inventory.instances.columns.title" />,
    hrid: <FormattedMessage id="ui-inventory.instanceHrid" />,
    issn: <FormattedMessage id="ui-inventory.issn" />,
    isbn: <FormattedMessage id="ui-inventory.isbn" />,
  };

  const columnWidths = {
    title: '40%',
    hrid: '25%',
  };

  return (
    <KeyValue label={label}>
      <MultiColumnList
        id={id}
        columnIdPrefix={id}
        contentData={titles}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        ariaLabel={label}
        interactive={false}
      />
    </KeyValue>
  );
};

TitlesViews.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  titles: PropTypes.arrayOf(PropTypes.object).isRequired,
  titleKey: PropTypes.string.isRequired,
  identifierTypesById: PropTypes.object,
};

export default TitlesViews;
