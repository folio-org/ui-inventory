import React, {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';

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

const rowMetadata = ['classificationTypeId'];
const visibleColumns = ['Classification identifier type', 'Classification'];
const columnWidths = {
  'Classification identifier type': '25%',
  'Classification': '75%',
};
const getColumnMapping = intl => ({
  'Classification identifier type': intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
  'Classification': intl.formatMessage({ id: 'ui-inventory.classification' }),
});
const classificationsRowFormatter = {
  'Classification identifier type': item => item?.classificationType || noValue,
  'Classification': item => item?.classificationNumber || noValue,
};


const InstanceClassificationView = ({
  id,
  classifications,
  classificationTypes,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => getColumnMapping(intl), []);
  const contentData = useMemo(() => {
    const formattedClassifications = classifications.map(classification => ({
      classificationType: classificationTypes
        .find(({ id: typeId }) => typeId === classification?.classificationTypeId)
        ?.name,
      classificationNumber: classification?.classificationNumber,
    }));

    const orderedClassifications = orderBy(
      formattedClassifications,
      [
        ({ classificationType }) => classificationType?.toLowerCase(),
        ({ classificationNumber }) => classificationNumber?.toLowerCase(),
      ],
      ['asc'],
    );

    return checkIfArrayIsEmpty(orderedClassifications);
  }, [classifications, classificationTypes]);

  return (
    <Accordion
      id={id}
      label={intl.formatMessage({ id: 'ui-inventory.classification' })}
    >
      <MultiColumnList
        id="list-classifications"
        contentData={contentData}
        rowMetadata={rowMetadata}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={classificationsRowFormatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.classification' })}
        interactive={false}
      />
    </Accordion>
  );
};

InstanceClassificationView.propTypes = {
  id: PropTypes.string.isRequired,
  classifications: PropTypes.arrayOf(PropTypes.object),
  classificationTypes: PropTypes.arrayOf(PropTypes.object),
};

InstanceClassificationView.defaultProps = {
  classifications: [],
  classificationTypes: [],
};

export default InstanceClassificationView;
