import React, {
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import queryString from 'query-string';

import {
  CalloutContext,
  AppIcon,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  Highlighter,
  IconButton,
} from '@folio/stripes/components';
import css from '../../View.css';
import { QUERY_INDEXES } from '../../constants';
import { updateAffiliation } from '../../utils';

const ItemBarcode = ({
  location,
  item,
  holdingId,
  instanceId,
  isBarcodeAsHotlink,
  tenantId,
}) => {
  const stripes = useStripes();
  const { search } = location;
  const queryBarcode = queryString.parse(search)?.query;
  const isQueryByBarcode = queryString.parse(search)?.qindex === QUERY_INDEXES.BARCODE;

  const onViewItem = useCallback(() => {
    window.location.href = `/inventory/view/${instanceId}/${holdingId}/${item.id}${search}`;
  }, [instanceId, holdingId, item.id, search]);

  const callout = useContext(CalloutContext);
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
        <Button
          buttonStyle="link"
          buttonClass={css.linkWithoutBorder}
          onClick={() => updateAffiliation(stripes.okapi, tenantId, onViewItem)}
          data-test-item-link
        >
          {itemBarcode}
        </Button>
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
