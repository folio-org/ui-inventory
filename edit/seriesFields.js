import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

// const renderSeries = ({ fields, meta: { touched, error, submitFailed } }) => (
//   <div>
//     <Row>
//       <Col sm={2} smOffset={4}>
//         <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-series" onClick={() => fields.push()}>Add Series Statement</Button>
//         {(touched || submitFailed) && error && <span>{error}</span>}
//       </Col>
//     </Row>
//     {fields.map((seriesStatement, index) =>
//       <Row key={index}>
//         <Col sm={2} smOffset={1}>
//           <Field
//             name={seriesStatement}
//             type="text"
//             component={TextField}
//             label={index === 0 ? 'Series Statement' : null}
//           />
//         </Col>
//         <Col sm={1} smOffset={1}>
//           {index === 0 ? <br /> : null}
//           <Button
//             buttonStyle="fullWidth secondary"
//             type="button"
//             title={`Remove Series ${index + 1}`}
//             onClick={() => fields.remove(index)}
//           >Delete Series</Button>
//         </Col>
//       </Row>,
//         // /
//      )}
//   </div>
// );
// renderSeries.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

// export default renderSeries;

class SeriesFields extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={8} smOffset={1}>
          <RepeatableField
            name="series"
            label="Series statement"
            addLabel="+ Add series"
            addId="clickable-add-series"
            template={[{
              name: "series",
              component: TextField
            }]}
            newItemTemplate={{text:''}}
          />
        </Col>
      </Row>
    );
  }
}

export default SeriesFields;
