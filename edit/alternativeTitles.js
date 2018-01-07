import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

// const renderAlternativeTitles = ({ fields, meta: { touched, error, submitFailed } }) => (
//   <div>
//     <Row>
//       <Col sm={2} smOffset={4}>
//         <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-alt-title" onClick={() => fields.push()}>Add Alternative Title</Button>
//         {(touched || submitFailed) && error && <span>{error}</span>}
//       </Col>
//     </Row>
//     {fields.map((alternativeTitle, index) =>
//       <Row key={index}>
//         <Col sm={2} smOffset={1}>
//           <Field
//             name={alternativeTitle}
//             type="text"
//             component={TextField}
//             label={index === 0 ? 'Alternative Title' : null}
//           />
//         </Col>
//         <Col sm={1}>
//           { index === 0 ? <br /> : null }
//           <Button
//             buttonStyle="fullWidth secondary"
//             type="button"
//             title={`Remove Alternative Title ${index + 1}`}
//             onClick={() => fields.remove(index)}
//           >Remove</Button>
//         </Col>
//       </Row>,
//         // /
//      )}
//   </div>
// );
// renderAlternativeTitles.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

//export default renderAlternativeTitles;

class AlternativeTitles extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={8} smOffset={1}>
          <RepeatableField
            name="alternativeTitles"
            label="Alternative titles"
            addLabel="+ Add title"
            addId="clickable-add-alt-title"
            template={[{
              name: "text",
              component: TextField
            }]}
            newItemTemplate={{text:''}}
          />
        </Col>
      </Row>
    );
  }
}

export default AlternativeTitles;