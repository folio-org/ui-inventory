import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import KeyValue from '@folio/stripes-components/lib/KeyValue';

import ItemCreator from './ItemCreator';

class Holdings extends React.Component {

  static manifest = Object.freeze({
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings?query=(instanceId=:{instanceid})',
    },
  });

  constructor(props) {
    super(props);
    this.cItemCreator = this.props.stripes.connect(ItemCreator);
  }


  render() {
    const { resources: { holdings } } = this.props;

    if (!holdings || !holdings.hasLoaded) return <div />;

    const holdingsRecords = holdings.records;
    const that = this;

    return (
      <div>
        {holdingsRecords.map(record =>
          <div key={record.id}>
            <Row>
              <Col sm={3}>
                <KeyValue label="Callnumber" value={record.callNumber} />
              </Col>
              <Col sm={7}>
                <KeyValue label="Permanent location" value={record.permanentLocationId} />
              </Col>
            </Row>
            <Row>
              <Col sm={1}>
                <KeyValue label="Items" value="" />
              </Col>
              <Col sm={9} >
                <that.cItemCreator key={record.id} id={record.id} holdingsRecordId={record.id} {...that.props} />
              </Col>
            </Row>
            <br />
          </div>)}
      </div>
    );
  }
}

Holdings.propTypes = {
  resources: PropTypes.shape({
    holdings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }).isRequired
};

export default Holdings;
