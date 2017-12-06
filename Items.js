import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';

class Items extends React.Component {

  static manifest = Object.freeze({
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(holdingsRecordId=!{holdingsRecord.id})',
    },
  });

  render() {
    const { resources: { items } } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;

    return (
      <div>
        {itemRecords.map((item, index) =>
          <div key={item.id}>
            <Row>
              <Col sm={2}>
                <KeyValue label="Barcode" value={item.barcode} />
              </Col>
              <Col sm={2}>
                <KeyValue label="Material Type" value={_.get(item, ['materialType', 'name'])} />
              </Col>
              <Col sm={3}>
                <KeyValue label="Permanent Loan Type" value={_.get(item, ['permanentLoanType', 'name'])} />
              </Col>
              <Col sm={2}>
                <KeyValue label="Status" value={_.get(item, ['status', 'name'])} />
              </Col>
              <Col sm={1}>
                <Button id={`clickable-update-item-${index}`} title="Edit">Edit</Button>
              </Col>
            </Row>
            <Row>
              <Col sm={2} smOffset={1}>
                <KeyValue label="Enumeration" value={item.enumeration} />
              </Col>
              <Col sm={2}>
                <KeyValue label="Chronology" value={item.chronology} />
              </Col>
              <Col sm={2}>
                <KeyValue label="Number of pieces" value={item.numberOfPieces} />
              </Col>
            </Row>
            <Row>
              <Col sm={2} smOffset={1}>
                <KeyValue label="Piece identifier" value="" />
              </Col>
            </Row>
            {item.pieceIdentifiers.map((pi, iindex) =>
              <Row key={`pi-${iindex}`}>
                <Col sm={8} smOffset={1}>
                  {pi}
                </Col>
              </Row>,
            )}
            <Row>
              <Col sm={2} smOffset={1}>
                <br />
                <KeyValue label="Item note" value="" />
              </Col>
            </Row>
            {item.notes.map((note, iindex) =>
              <Row key={`note-${iindex}`}>
                <Col sm={8} smOffset={1}>
                  {note}
                </Col>
              </Row>,
            )}
          </div>,
        )}
      </div>);
  }
}

Items.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

export default Items;
