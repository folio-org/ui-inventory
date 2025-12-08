import React, {
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import queryString from 'query-string';

import {
  CalloutContext,
  AppIcon,
  useStripes,
} from '@folio/stripes/core';
import {
  Highlighter,
  IconButton,
  TextLink,
} from '@folio/stripes/components';
import css from '../../View.css';
import { QUERY_INDEXES } from '../../constants';
import { useLocalStorageItems } from '../../hooks';
import {
  switchAffiliation,
  sendCalloutOnAffiliationChange,
} from '../../utils';

const ItemBarcode = ({
  location,
  item,
  holdingId,
  instanceId,
  isBarcodeAsHotlink,
  tenantId,
}) => {
  const history = useHistory();
  const stripes = useStripes();
  const callout = useContext(CalloutContext);
  const {
    addItem,
    getItem,
  } = useLocalStorageItems(holdingId);
  const { search } = location;
  const queryBarcode = queryString.parse(search)?.query;
  const isQueryByBarcode = queryString.parse(search)?.qindex === QUERY_INDEXES.BARCODE;

  const onViewItem = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}/${holdingId}/${item.id}`,
      search,
      state: {
        tenantTo: tenantId,
        tenantFrom: stripes.okapi.tenant,
        initialTenantId: stripes.okapi.tenant,
      },
    });

    sendCalloutOnAffiliationChange(stripes, tenantId, callout);
  }, [instanceId, holdingId, item.id, search]);

  const onCopyToClipbaord = useCallback(() => {
    callout.sendCallout({
      type: 'success',
      message: (
        <FormattedMessage
          id="ui-inventory.items.successfullyCopiedMessage"
          values={{ barcode: item.barcode }}
        />)
    });
  }, [item.barcode, callout]);

  const highlightableBarcode = isQueryByBarcode ? <Highlighter searchWords={[queryBarcode]} text={String(item.barcode)} /> : item.barcode;

  const itemBarcode = (
    <span data-test-items-app-icon>
      <AppIcon app="inventory" iconKey="item" size="small">
        {item.barcode ? highlightableBarcode : <FormattedMessage id="ui-inventory.noBarcode" />}
      </AppIcon>
    </span>
  );

  return (
    <>
      {isBarcodeAsHotlink ? (
        <TextLink
          to={`/inventory/view/${instanceId}/${holdingId}/${item.id}?tenantTo=${tenantId}`}
          onClick={async (e) => {
            e.preventDefault();
            addItem(item.id);
            await switchAffiliation(stripes, tenantId, onViewItem);
          }}
          className={getItem(item.id) && css.visited}
        >
          {itemBarcode}
        </TextLink>
      ) : itemBarcode
      }
      {item.barcode &&
        <CopyToClipboard
          text={item.barcode}
          onCopy={onCopyToClipbaord}
        >
          <div data-test-items-copy-icon>
            <IconButton icon="clipboard" />
          </div>
        </CopyToClipboard>
      }
      {(item.isBoundWith) &&
        <AppIcon
          size="small"
          app="@folio/inventory"
          iconKey="bound-with"
          iconClassName={css.boundWithIcon}
        />
      }
    </>
  );
};

ItemBarcode.propTypes = {
  location: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  holdingId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
  isBarcodeAsHotlink: PropTypes.bool,
};

export default withRouter(ItemBarcode);
