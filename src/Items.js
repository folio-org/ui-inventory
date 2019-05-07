import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { IntlConsumer, AppIcon } from '@folio/stripes/core';

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
      path: 'inventory/items?query=(holdingsRecordId==!{holdingsRecord.id})&limit=5000',
      resourceShouldRefresh: true,
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
    } = this.props;

    if (!items || !items.hasLoaded) return null;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => (
        <span data-test-items-app-icon>
          <AppIcon app="inventory" iconKey="item" size="small">
            {get(x, ['barcode'])}
          </AppIcon>
        </span>
      ),
      'status': x => get(x, ['status', 'name']) || '--',
      'Material Type': x => get(x, ['materialType', 'name']),
    };

    return (
      <div data-test-items>
        <IntlConsumer>
          {intl => (
            <FormattedMessage id="ui-inventory.items">
              {ariaLabel => (
                <MultiColumnList
                  id="list-items"
                  contentData={itemRecords}
                  rowMetadata={['id', 'holdingsRecordId']}
                  formatter={itemsFormatter}
                  visibleColumns={['Item: barcode', 'status', 'Material Type']}
                  columnMapping={{
                    'Item: barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
                    'status': intl.formatMessage({ id: 'ui-inventory.status' }),
                    'Material Type': intl.formatMessage({ id: 'ui-inventory.materialType' }),
                  }}
                  ariaLabel={ariaLabel}
                  containerRef={(ref) => { this.resultsList = ref; }}
                  rowFormatter={this.anchoredRowFormatter}
                />
              )}
            </FormattedMessage>
          )}
        </IntlConsumer>
      </div>);
  }
}

Items.propTypes = {
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

export default Items;
