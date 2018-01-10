import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

// const renderIdentifiers = ({ fields, meta: { touched, error, submitFailed }, identifierTypes }) => (
//   <div>
//     <Row>
//       <Col sm={2} smOffset={4}>
//         <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-identifier" onClick={() => fields.push()}>Add Identifier</Button>
//         {(touched || submitFailed) && error && <span>{error}</span>}
//       </Col>
//     </Row>
//     {fields.map((identifier, index) => {
//       const identifierTypeOptions = identifierTypes.map(
//                                         it => ({
//                                           label: it.name,
//                                           value: it.id,
//                                           selected: it.id === identifier.identifierTypeId,
//                                         }));
//       return (
//         <Row key={index}>
//           <Col sm={2} smOffset={1}>
//             <Field
//               name={`${identifier}.value`}
//               type="text"
//               component={TextField}
//               label={index === 0 ? 'Identifier *' : null}
//             />
//           </Col>
//           <Col sm={2}>
//             <Field
//               name={`${identifier}.identifierTypeId`}
//               type="text"
//               component={Select}
//               label={index === 0 ? 'Type *' : null}
//               dataOptions={[{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions]}
//             />
//           </Col>
//           <Col sm={1}>
//             { index === 0 ? <br /> : null }
//             <Button
//               buttonStyle="fullWidth secondary"
//               type="button"
//               title={`Remove Identifier ${index + 1}`}
//               onClick={() => fields.remove(index)}
//             >Remove</Button>
//           </Col>
//         </Row>
//       );
//     })}
//   </div>
// );
// renderIdentifiers.propTypes = { fields: PropTypes.object, meta: PropTypes.object, identifierTypes: PropTypes.arrayOf(PropTypes.object) };

// export default renderIdentifiers;

class IdentifierFields extends React.Component {
  render() {

    const identifierTypeOptions = this.props.identifierTypes.map(
                                              it => ({
                                                label: it.name,
                                                value: it.id,
                                              }));
    return (
      <RepeatableField
        name="identifiers"
        label="Identifiers"
        addLabel="+ Add identifier"
        addId="clickable-add-identifier"
        template={
          [ {
              name: "value",
              label: "Identifier *",
              component: TextField,
              required: true,
            },
            {
              name: "identifierTypeId",
              label: "Type *",
              component: Select,
              dataOptions: [{ label: 'Select identifier type', value: '' }, ...identifierTypeOptions],
              required: true,
            },
          ]}
        newItemTemplate={{name:'', identifierNameTypeId:''}}
      />
    );
  }
}

IdentifierFields.PropTypes = {
  identifierNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default IdentifierFields;

