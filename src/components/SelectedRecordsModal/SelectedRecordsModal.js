import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import {
  Modal,
  ModalFooter,
  Button,
  MultiColumnList
} from '@folio/stripes/components';

const SelectedRecordsModal = ({
  isOpen,
  selectedRecords,
  columnMapping,
  formatter,
  onCancel,
}) => {
  const renderFooter = () => (
    <ModalFooter>
      <Button
        data-test-selected-records-save
        buttonStyle="primary"
        disabled
        onClick={noop}
      >
        <FormattedMessage id="ui-inventory.saveAndClose" />
      </Button>
      <Button
        data-test-selected-records-cancel
        onClick={onCancel}
      >
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      data-test-selected-records-modal
      open={isOpen}
      label={<FormattedMessage id="ui-inventory.instances.selectedRecords" />}
      dismissible
      size="large"
      footer={renderFooter()}
      onClose={onCancel}
    >
      <MultiColumnList
        id="selected-records-list"
        contentData={Object.values(selectedRecords)}
        visibleColumns={['title', 'contributors', 'publishers']}
        columnMapping={columnMapping}
        formatter={formatter}
        columnWidths={{
          title: '40%',
          contributors: '30%',
          publishers: '30%',
        }}
      />
    </Modal>
  );
};

SelectedRecordsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedRecords: PropTypes.object.isRequired,
  columnMapping: PropTypes.object.isRequired,
  formatter: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SelectedRecordsModal;
