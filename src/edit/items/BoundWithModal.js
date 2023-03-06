import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  Modal,
  ModalFooter,
  Button,
  TextField,
  Headline,
  Row,
  Col,
  Layout,
} from '@folio/stripes/components';

import css from './BoundWithModal.css';

const FIELD_COUNT = 7;

const BoundWithModal = ({
  item,
  open,
  onClose,
  onOk,
}) => {
  const intl = useIntl();

  const initHrids = () => Array(FIELD_COUNT).fill('');
  const [hrids, setHrids] = useState(initHrids());

  const handleChange = (event) => {
    const index = event.target.getAttribute('data-index');
    const value = event.target.value;
    const newHrids = hrids.slice();
    newHrids[index] = value;
    setHrids(newHrids);
  };

  const addNewHrids = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newHrids = hrids.filter(hrid => hrid?.length > 0);
    onOk(newHrids);

    // Clear values
    setHrids(initHrids());
  };

  return (
    <Modal
      data-testid="bound-with-modal"
      open={open}
      dismissible
      label={<FormattedMessage id="ui-inventory.boundWithTitles.add" />}
      onClose={onClose}
      footer={(
        <ModalFooter>
          <Button
            data-testid="bound-with-modal-save-button"
            buttonStyle="primary"
            type="submit"
            onClick={addNewHrids}
          >
            <FormattedMessage id="ui-inventory.saveAndClose" />
          </Button>
          <Button
            data-testid="bound-with-modal-cancel-button"
            onClick={onClose}
          >
            <FormattedMessage id="ui-inventory.cancel" />
          </Button>
        </ModalFooter>
      )}
    >
      <Row>
        <Col xs={12}>
          <Layout className={`${css.itemData} flex centerContent`}>
            <Layout className="padding-start-gutter padding-end-gutter">
              <Layout element="span" className="margin-end-gutter">
                <FormattedMessage id="ui-inventory.itemHrid" />
                :
              </Layout>
              {item.hrid}
            </Layout>
            <Layout className="padding-start-gutter padding-end-gutter">
              <Layout element="span" className="margin-end-gutter">
                <FormattedMessage id="ui-inventory.barcode" />
                :
              </Layout>
              {item.barcode}
            </Layout>
          </Layout>
        </Col>
      </Row>
      <Headline>
        <FormattedMessage id="ui-inventory.boundWithTitles.add" />
      </Headline>
      <form name="addNewHrids" onSubmit={addNewHrids}>
        {
          Array(FIELD_COUNT).fill(0).map((f, i) => {
            return (
              <Row key={`new_hrid_${i}`}>
                <Col xs={6}>
                  <TextField
                    data-testid="bound-with-modal-input"
                    placeholder={intl.formatMessage({ id: 'ui-inventory.boundWithTitles.enterHoldingsHrid' })}
                    value={hrids[i]}
                    onChange={handleChange}
                    data-index={i}
                  />
                </Col>
              </Row>
            );
          })
        }
      </form>
    </Modal>
  );
};

BoundWithModal.propTypes = {
  item: PropTypes.object,
  open: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onClose: PropTypes.func,
  onOk: PropTypes.func,
};

export default BoundWithModal;
