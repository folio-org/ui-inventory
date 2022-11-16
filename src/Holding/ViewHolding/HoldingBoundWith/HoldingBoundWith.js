import PropTypes from 'prop-types';
import { get, keyBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';

import { IntlConsumer } from '@folio/stripes/core';
import { noValue } from '../../../constants';
import { checkIfArrayIsEmpty } from '../../../utils';
import useBoundWithHoldings from './useBoundWithHoldings';

const HoldingBoundWith = ({ boundWithItems }) => {
  const { isLoading, boundWithHoldings } = useBoundWithHoldings(boundWithItems);
  const boundWithHoldingsMapById = keyBy(boundWithHoldings, 'id');
  const data = boundWithItems?.map(boundWithItem => ({
    item: boundWithItem,
    holdingsRecord: boundWithHoldingsMapById[boundWithItem.holdingsRecordId],
  }));

  if (isLoading) {
    return (
      <Accordion
        id="acc08"
        label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
      />
    );
  }

  return (
    <IntlConsumer>
      {intl => (

        <Accordion
          id="acc08"
          label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
        >
          <MultiColumnList
            id="holdings-list-bound-with-items"
            contentData={checkIfArrayIsEmpty(data)}
            visibleColumns={['hrid']}
            columnMapping={{
              'hrid': intl.formatMessage({ id: 'ui-inventory.itemHrid' }),
            }}
            formatter={{
              'hrid': x => (get(x.item, ['hrid'])
                ? (
                  <Link
                    to={
                      '/inventory/view' +
                      `/${get(x.holdingsRecord, ['instanceId'])}` +
                      `/${get(x.holdingsRecord, ['id'])}` +
                      `/${get(x.item, ['id'])}`}
                    className="itemHrid"
                  >
                    {get(x.item, ['hrid'])}
                  </Link>)
                : noValue),
            }}
          />
        </Accordion>
      )}
    </IntlConsumer>
  );
};

HoldingBoundWith.propTypes = {
  boundWithItems: PropTypes.arrayOf(PropTypes.object),
};

export default HoldingBoundWith;
