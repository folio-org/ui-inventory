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
} from '../../../utils';

const noValue = <NoValue />;

const rowMetadata = ['classificationTypeId'];
const visibleColumns = ['type', 'classification'];
const columnWidths = {
  type: '25%',
  classification: '75%',
};
const getColumnMapping = intl => ({
  type: intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
  classification: intl.formatMessage({ id: 'ui-inventory.classification' }),
});
const classificationsRowFormatter = {
  type: item => item?.classificationType || noValue,
  classification: item => item?.classificationNumber || noValue,
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
