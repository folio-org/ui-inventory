import React, {
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Link,
} from 'react-router-dom';
import {
  FormattedMessage,
} from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import queryString from 'query-string';

import {
  CalloutContext,
  AppIcon,
} from '@folio/stripes/core';
import {
  Highlighter,
  IconButton,
} from '@folio/stripes/components';

const ItemBarcode = ({ location, item, holdingId, instanceId }) => {
  const { search } = location;
  const queryBarcode = queryString.parse(search)?.query;

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

  const highlightableBarcode = <Highlighter searchWords={[queryBarcode]} text={String(item.barcode)} />;
  return (
    <>
      <Link
        to={`/inventory/view/${instanceId}/${holdingId}/${item.id}${search}`}
        data-test-item-link
      >
        <span data-test-items-app-icon>
          <AppIcon app="inventory" iconKey="item" size="small">
            {highlightableBarcode || <FormattedMessage id="ui-inventory.noBarcode" />}
          </AppIcon>
        </span>
      </Link>
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
    </>
  );
};

ItemBarcode.propTypes = {
  location: PropTypes.object.isRequired,

  item: PropTypes.object.isRequired,
  holdingId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default withRouter(ItemBarcode);
