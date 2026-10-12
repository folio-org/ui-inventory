import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Accordion,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { checkIfArrayIsEmpty } from '../../../../utils';

const visibleColumns = ['Instance HRID', 'Instance title', 'Holdings HRID'];

const BoundWithAndAnalytics = ({ boundWithTitles = [] }) => {
  const intl = useIntl();

  const boundWithTitleFormatter = {
    'Instance HRID': x => (
      x.briefInstance?.id ? (
        <Link
          to={`/inventory/view/${x.briefInstance?.id}`}
          className="instanceHrid"
        >
          <span>{x.briefInstance?.hrid}</span>
        </Link>
      ) : <NoValue />
    ),
    'Instance title': x => x.briefInstance?.title || <NoValue />,
    'Holdings HRID': x => (
      (x.briefInstance?.id && x.briefHoldingsRecord?.id) ? (
        <Link
          to={`/inventory/view/${x.briefInstance?.id}/${x.briefHoldingsRecord?.id}`}
          className="holdingsRecordHrid"
        >
          <span>{x.briefHoldingsRecord?.hrid}</span>
        </Link>
      ) : <NoValue />
    ),
  };

  return (
    <Accordion
      id="acc10"
      label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
    >
      <MultiColumnList
        id="item-list-bound-with-titles"
        contentData={checkIfArrayIsEmpty(boundWithTitles)}
        visibleColumns={visibleColumns}
        columnMapping={{
          'Instance HRID': intl.formatMessage({ id: 'ui-inventory.instanceHrid' }),
          'Instance title': intl.formatMessage({ id: 'ui-inventory.instanceTitleLabel' }),
          'Holdings HRID': intl.formatMessage({ id: 'ui-inventory.holdingsHrid' }),
        }}
        formatter={boundWithTitleFormatter}
        ariaLabel={intl.formatMessage({ id: 'ui-inventory.boundWithTitles' })}
      />
    </Accordion>
  );
};

BoundWithAndAnalytics.propTypes = {
  boundWithTitles: PropTypes.arrayOf(PropTypes.object),
};

export default BoundWithAndAnalytics;
