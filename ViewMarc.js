import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Layer from '@folio/stripes-components/lib/Layer';
import Pane from '@folio/stripes-components/lib/Pane';

class ViewMarc extends React.Component {
  static manifest = Object.freeze({
    marcRecord: {
      type: 'okapi',
      path: 'instance-storage/instances/:{id}/source-record/marc-json',
    }
  });

  render() {
    const { resources: { marcRecord }, instance } = this.props;

    if (!marcRecord || !marcRecord.hasLoaded) return <div>Fetching MARC record</div>;
    const marcJSON = marcRecord.records[0];

    const leader = `LEADER ${marcJSON.leader}`;
    const fields001to009 = marcJSON.fields.filter((field) => (Object.keys(field)[0]).startsWith('00'));
    const fields010andUp = marcJSON.fields.filter((field) => !(Object.keys(field)[0]).startsWith('00'));
    const formattedFields001to009 = fields001to009.map((field) => {
      const key = Object.keys(field)[0];
      return <tr key={'00field' + key} id={'00field' + key}>
        <td key={'cell' + key} id={'cell' + key} colSpan="3">
          {key}
          {' '}
          {field[key].replace(/\\/g, ' ')}
        </td>
      </tr>;
    });
    const formattedFields010andUp = fields010andUp.map((field, index) => {
      const key = Object.keys(field)[0];
      const subFields = (field[key].subfields).map((subField) => {
        const subKey = Object.keys(subField)[0];
        return [<span key={'span' + subKey}>&#8225;</span>, subKey, ' ', subField[subKey], ' '];
      });
      return (
        <tr key={'field-' + key + '-' + index}>
          <td key={'cell1-' + key + '-' + index} style={{ 'verticalAlign': 'top' }}>
            {key}
            {' '}
            {field[key].ind1.replace(/\\/g, ' ')}
            {' '}
            {field[key].ind2.replace(/\\/g, ' ')}
          </td>
          <td key={'cell2-' + key + '-' + index} style={{ 'whiteSpace': 'pre-wrap' }}><div>{subFields}</div></td>
        </tr>
      );
    });

    return (
      <div>
        <Layer isOpen label="View MARC source">
          <Pane
            paneTitle={
              <div style={{ textAlign: 'center' }}>
                {_.get(instance, ['title'], '')}
              </div>
            }
            defaultWidth={this.props.paneWidth}
            dismissible
            onClose={this.props.onClose}
          >
            <div style={{ 'marginLeft': '20px' }}>
              <h3>MARC source record</h3>
              <div style={{ 'whiteSpace': 'pre', 'fontFamily': 'courier' }}>
                <table border="0" style={{ 'tableLayout': 'fixed' }}>
                  <tbody>
                    <tr key="leader" id="tr-leader">
                      <td key="leader" id="td-leader" colSpan="4">{leader}</td>
                    </tr>
                    {formattedFields001to009}
                    {formattedFields010andUp}
                  </tbody>
                </table>
              </div>
            </div>
          </Pane>
        </Layer>
      </div>
    );
  }
}

ViewMarc.propTypes = {
  instance: PropTypes.object,
  paneWidth: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    marcRecord: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

export default ViewMarc;
