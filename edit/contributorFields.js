import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
import { Field } from 'redux-form';

// const renderContributors = ({ fields, meta: { touched, error, submitFailed }, contributorNameTypes }) => (
//   <div>
//     <Row>
//       <Col sm={2} smOffset={4}>
//         <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-contributor" onClick={() => fields.push()}>Add Contributor</Button>
//         {(touched || submitFailed) && error && <span>{error}</span>}
//       </Col>
//     </Row>
//     {fields.map((contributor, index) => {
//       const contributorNameTypeOptions = contributorNameTypes.map(
//                                         it => ({
//                                           label: it.name,
//                                           value: it.id,
//                                           selected: it.id === contributor.contributorNameTypeId,
//                                         }));
//       return (
//         <Row key={index}>
//           <Col sm={2} smOffset={1}>
//             <Field
//               name={`${contributor}.name`}
//               type="text"
//               component={TextField}
//               label={index === 0 ? 'Contributor' : null}
//             />
//           </Col>
//           <Col sm={1}>
//             <Field
//               name={`${contributor}.contributorNameTypeId`}
//               type="text"
//               component={Select}
//               label={index === 0 ? 'Type' : null}
//               dataOptions={[{ label: 'Select name type', value: '' }, ...contributorNameTypeOptions]}
//             />
//           </Col>
//           <Col sm={1} smOffset={1}>
//             { index === 0 ? <br /> : null }
//             <Button
//               buttonStyle="fullWidth secondary"
//               type="button"
//               title={`Remove Contributor ${index + 1}`}
//               onClick={() => fields.remove(index)}
//             >Delete contributor</Button>
//           </Col>
//         </Row>
//       );
//     })}
//   </div>
// );
// renderContributors.propTypes = { fields: PropTypes.object, meta: PropTypes.object, contributorNameTypes: PropTypes.arrayOf(PropTypes.object) };

// export default renderContributors;

class ContributorFields extends React.Component {
  render() {

    const contributorNameTypeOptions = this.props.contributorNameTypes.map(
                                              it => ({
                                                label: it.name,
                                                value: it.id,
                                              }));
    return (

      <RepeatableField
        name="contributors"
        label="Contributors"
        addLabel="+ Add contributor"
        addId="clickable-add-contributor"
        template={
          [ {
              label:'Name',
              name:'name',
              component: TextField
            },
            {
              label: 'Type',
              name: 'contributorNameTypeId',
              component: Select,
              dataOptions: [{ label: 'Select name type', value: '' }, ...contributorNameTypeOptions],
            },
          ]}
        newItemTemplate={{name:'', contributorNameTypeId:''}}
      />
    );
  }
}

ContributorFields.PropTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ContributorFields;
