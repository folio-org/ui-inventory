import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  get,
  orderBy,
} from 'lodash';

import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  IconButton,
  Callout,
} from '@folio/stripes/components';

import {
  IntlConsumer,
  AppIcon,
} from '@folio/stripes/core';

import withLocation from './withLocation';

import { noValue } from './constants';
import { checkIfArrayIsEmpty } from './utils';

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
    this.calloutRef = createRef();
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.state = {
      sortedColumn: 'barcode',
      sortOrder: 'desc',
    };
  }

  componentDidUpdate() {
    const {
      resources: { items },
      getRecords,
    } = this.props;

    console.log('items', items);

    if (items.records !== null) {
      getRecords(items.records);
    }
  }

  showCallout(barcode) {
    this.calloutRef.current.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage
          id="ui-inventory.items.successfullyCopiedMessage"
          values={{ barcode }}
        />)
    });
  }

  onHeaderClick(e, { name: columnName }) {
    if (this.state.sortedColumn !== columnName) {
      this.setState({ sortedColumn: columnName });
      this.setState({ sortOrder: 'desc' });
    } else {
      this.setState(state => (
        { sortOrder: state.sortOrder === 'desc' ? 'asc' : 'desc' }
      ));
    }
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
    const sorters = {
      'barcode': ({ barcode }) => barcode,
      'status': ({ status }) => status.name.toLowerCase(),
      'materialType': ({ materialType }) => materialType.name.toLowerCase(),
      'enumeration': ({ enumeration }) => enumeration,
      'chronology': ({ chronology }) => chronology,
    };
    const sortedRecords = orderBy(itemRecords, sorters[this.state.sortedColumn], this.state.sortOrder.slice());
    const itemsFormatter = {
      'barcode': item => {
        return (item.id &&
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
              <CopyToClipboard
                text={item.barcode}
                onCopy={() => this.showCallout(item.barcode)}
              >
                <div data-test-items-copy-icon>
                  <IconButton icon="clipboard" />
                </div>
              </CopyToClipboard>
            }
          </React.Fragment>
        ) || noValue;
      },
      'status': x => get(x, ['status', 'name']) || noValue,
      'materialType': x => get(x, ['materialType', 'name']) || noValue,
      'enumeration': x => x.enumeration || noValue,
      'chronology': x => x.chronology || noValue,
    };

    return (
      <div data-test-items>
        <IntlConsumer>
          {intl => (
            <FormattedMessage id="ui-inventory.items">
              {ariaLabel => (
                <MultiColumnList
                  id="list-items"
                  contentData={checkIfArrayIsEmpty(sortedRecords)}
                  rowMetadata={['id', 'holdingsRecordId']}
                  formatter={itemsFormatter}
                  visibleColumns={['barcode', 'status', 'materialType', 'enumeration', 'chronology']}
                  columnMapping={{
                    'barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
                    'status': intl.formatMessage({ id: 'ui-inventory.status' }),
                    'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
                    'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
                    'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
                  }}
                  columnWidths={{
                    'barcode': '25%',
                    'status': '25%',
                    'materialType': '25%',
                    'enumeration': '25%',
                    'chronology': '25%',
                  }}
                  ariaLabel={ariaLabel}
                  containerRef={ref => { this.resultsList = ref; }}
                  interactive={false}
                  onHeaderClick={this.onHeaderClick}
                  sortDirection={this.state.sortOrder === 'desc' ? 'descending' : 'ascending'}
                  sortedColumn={this.state.sortedColumn}
                />
              )}
            </FormattedMessage>
          )}
        </IntlConsumer>
        <Callout ref={this.calloutRef} />
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
  getRecords: PropTypes.func.isRequired,
};

export default withLocation(Items);
