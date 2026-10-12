import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';

import {
  Accordion,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  checkIfArrayIsEmpty,
} from '../../../../../utils';

const noValue = <NoValue />;

const rowMetadata = ['identifierTypeId'];
const visibleColumns = ['type', 'identifier'];
const columnWidths = {
  type: '25%',
  identifier: '75%',
};
const getColumnMapping = intl => ({
  type: intl.formatMessage({ id: 'ui-inventory.resourceIdentifierType' }),
  identifier: intl.formatMessage({ id: 'ui-inventory.resourceIdentifier' }),
});
const formatter = {
  type: item => item?.type || noValue,
  identifier: item => item?.identifier || noValue,
};

const InstanceIdentifiersView = ({
  id,
  identifiers = [],
  identifierTypes = [],
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    const formattedIdentifiers = identifiers.map(identifier => ({
      type: identifierTypes
        .find(({ id: typeId }) => typeId === identifier?.identifierTypeId)
        ?.name,
      identifier: identifier?.value,
    }));

    const orderedIdentifiers = orderBy(
      formattedIdentifiers,
      [
        ({ type }) => type?.toLowerCase(),
        ({ identifier }) => identifier?.toLowerCase(),
      ],
      ['asc'],
    );

    return checkIfArrayIsEmpty(orderedIdentifiers);
  }, [identifiers, identifierTypes]);

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.identifiers' })}
    >
      <MultiColumnList
        id="list-identifiers"
        columnIdPrefix="identifiers"
        contentData={contentData}
        rowMetadata={rowMetadata}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.identifiers' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceIdentifiersView.propTypes = {
  id: PropTypes.string.isRequired,
  identifiers: PropTypes.arrayOf(PropTypes.object),
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default InstanceIdentifiersView;
