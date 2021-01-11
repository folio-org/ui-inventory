import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';

import {
  Modal,
  ModalFooter,
  Button,
  Checkbox,
  MultiColumnList
} from '@folio/stripes/components';
import CheckboxColumn from '../InstancesList/CheckboxColumn';

const SelectedRecordsModal = ({
  isOpen,
  records,
  columnMapping,
  formatter,
  onSave,
  onCancel,
}) => {
  const intl = useIntl();
  const [selectedRecords, setSelectedRecords] = useState(records);

  useEffect(() => {
    if (isOpen) {
      setSelectedRecords(records);
    }
  }, [records, isOpen]);

  const toggleRowSelection = rowData => {
    setSelectedRecords(state => {
      const isRowSelected = Boolean(selectedRecords[rowData.id]);
      const newSelectedRows = { ...state };

      if (isRowSelected) {
        delete newSelectedRows[rowData.id];
      } else {
        newSelectedRows[rowData.id] = rowData;
      }

      return newSelectedRows;
    });
  };

  const resultsFormatter = {
    ...formatter,
    'select': rowData => ( // eslint-disable-line react/prop-types
      <CheckboxColumn>
        <Checkbox
          checked={Boolean(selectedRecords[rowData.id])}
          aria-label={intl.formatMessage({ id: 'ui-inventory.instances.rows.select' })}
          onChange={() => toggleRowSelection(rowData)}
        />
      </CheckboxColumn>
    )
  };

  const renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={() => onSave(selectedRecords)}
      >
        <FormattedMessage id="ui-inventory.saveAndClose" />
      </Button>
      <Button onClick={onCancel}>
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={isOpen}
      label={intl.formatMessage({ id: 'ui-inventory.instances.selectedRecords' })}
      dismissible
      size="large"
      footer={renderFooter()}
      onClose={onCancel}
    >
      <MultiColumnList
        id="selected-records-list"
        contentData={Object.values(records)}
        visibleColumns={['select', 'title', 'contributors', 'publishers']}
        columnMapping={columnMapping}
        formatter={resultsFormatter}
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
  records: PropTypes.object.isRequired,
  columnMapping: PropTypes.object.isRequired,
  formatter: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SelectedRecordsModal;
