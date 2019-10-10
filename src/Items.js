import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  IconButton,
} from '@folio/stripes/components';
import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import withLocation from './withLocation';

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
      path: 'inventory/items',
      params: {
        query: 'holdingsRecordId==!{holdingsRecord.id}',
        limit: '5000',
      },
      resourceShouldRefresh: true,
    },
  });

  constructor(props) {
    super(props);
    this.editItemModeThisLayer = false;
  }

  render() {
    const {
      resources: { items },
      instance,
      holdingsRecord,
      getSearchParams,
    } = this.props;

    if (!items || !items.hasLoaded) return null;
    const noBarcode = <FormattedMessage id="ui-inventory.noBarcode" />;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': (item) => {
        return (
          <React.Fragment>
            <Link
              to={`/inventory/view/${instance.id}/${holdingsRecord.id}/${item.id}?${getSearchParams()}`}
              data-test-item-link
            >
              <span data-test-items-app-icon>
                <AppIcon app="inventory" iconKey="item" size="small">
                  {get(item, 'barcode', noBarcode)}
                </AppIcon>
              </span>
            </Link>
            {item.barcode &&
              <CopyToClipboard text={item.barcode}>
                <IconButton icon="clipboard" />
              </CopyToClipboard>
            }
          </React.Fragment>
        );
      },
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
                  interactive={false}
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
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
  getSearchParams: PropTypes.func.isRequired,
};

export default withLocation(Items);
