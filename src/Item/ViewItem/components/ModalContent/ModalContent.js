import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Button,
  Layout,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

const ModalContent = ({
  stripes,
  item,
  status,
  itemRequestCount,
  requestsUrl,
  onCancel,
  onConfirm,
}) => {
  const openRequestValue = <Link to={requestsUrl}>{`${itemRequestCount} open request${itemRequestCount === 1 ? '' : 's'}`}</Link>;

  // The countIndex variable is used here for:
  //  - either to determine the content of the message about open requests
  //  - or whether to show this message at all.
  const countIndex = stripes.hasPerm('ui-users.requests.all') ? itemRequestCount : -1;

  return (
    <>
      <FormattedMessage
        id="ui-inventory.confirmModal.message"
        values={{
          title: item.title,
          barcode: item.barcode,
          materialType: item.materialType?.name,
          status,
        }}
      />
      <FormattedMessage
        id="ui-inventory.confirmModal.requestMessage"
        values={{
          countIndex,
          openRequestValue,
        }}
      />
      <Layout className="textRight">
        <Button
          data-test-confirm-modal-cancel-button
          onClick={onCancel}
        >
          <FormattedMessage id="ui-inventory.cancel" />
        </Button>
        <Button
          data-test-confirm-modal-confirm-button
          buttonStyle="primary"
          onClick={onConfirm}
        >
          <FormattedMessage id="ui-inventory.confirm" />
        </Button>
      </Layout>
    </>
  );
};

ModalContent.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  item: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  requestsUrl: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemRequestCount: PropTypes.number.isRequired,
};

export default stripesConnect(ModalContent);
