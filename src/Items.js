import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Link from 'react-router-dom/Link';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

/**
 * List items for display in the Holdings accordion in the main
 * instance-details pane.
 *
 */
class Items extends React.Component {
  static manifest = Object.freeze({
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(holdingsRecordId==!{holdingsRecord.id})',
    },
  });

  constructor(props) {
    super(props);
    this.editItemModeThisLayer = false;
  }

  anchoredRowFormatter = (row) => (
    <div role="listitem" key={`row-${row.rowIndex}`}>
      <Link
        to={`/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}/${row.rowData.id}`}
        aria-label={row.labelStrings && row.labelStrings.join('...')}
        className={row.rowClass}
        {...row.rowProps}
      >
        {row.cells}
      </Link>
    </div>
  );

  render() {
    const {
      resources: { items },
      intl: { formatMessage },
    } = this.props;

    if (!items || !items.hasLoaded) return null;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => _.get(x, ['barcode']),
      'status': x => _.get(x, ['status', 'name']) || '--',
      'Material Type': x => _.get(x, ['materialType', 'name']),
    };

    return (
      <div>
        <FormattedMessage id="ui-inventory.items">
          {ariaLabel => (
            <MultiColumnList
              id="list-items"
              contentData={itemRecords}
              rowMetadata={['id', 'holdingsRecordId']}
              formatter={itemsFormatter}
              visibleColumns={['Item: barcode', 'status', 'Material Type']}
              columnMapping={{
                'Item: barcode': formatMessage({ id: 'ui-inventory.item.barcode' }),
                'status': formatMessage({ id: 'ui-inventory.status' }),
                'Material Type': formatMessage({ id: 'ui-inventory.materialType' }),
              }}
              ariaLabel={ariaLabel}
              containerRef={(ref) => { this.resultsList = ref; }}
              rowFormatter={this.anchoredRowFormatter}
            />
          )}
        </FormattedMessage>
      </div>);
  }
}

Items.propTypes = {
  intl: intlShape.isRequired,
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    query: PropTypes.object,
  }),
  parentMutator: PropTypes.object.isRequired,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
};

export default injectIntl(Items);
