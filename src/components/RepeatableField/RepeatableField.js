import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray } from 'redux-form';
import FieldRow from './FieldRow';

class RepeatableField extends React.Component {
  constructor(props) {
    super(props);

    this.lastField = null;

    this._added = false;
    this._arrayId = `${this.props.label}-fields`;
    this.buildComponentFromTemplate = this.buildComponentFromTemplate.bind(this);
    this.addDefaultField = this.addDefaultField.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
  }

  componentDidUpdate() {
    if (this._added && this.lastRow) {
      const firstInput = this.lastRow.querySelector('input, select');
      if (firstInput) {
        firstInput.focus();
        this._added = false;
      }
    }
  }

  buildComponentFromTemplate = ({ templateIndex, input, meta, ...rest }) => {
    const Component = this.props.template[templateIndex].component;
    return (
      <Component input={input} meta={meta} {...rest} />
    );
  };

  addDefaultField(fields) {
    if (this.props.newItemTemplate) {
      fields.push(cloneDeep(this.props.newItemTemplate));
    } else {
      fields.push();
    }
  }

  handleAddField(fields) {
    if (this.props.newItemTemplate) {
      fields.push(cloneDeep(this.props.newItemTemplate));
    } else {
      fields.push();
    }
    this._added = true;
  }

  render() {
    const {
      name,
      template,
      label,
      newItemTemplate,
      addDefaultItem,
      addLabel,
      addButtonId,
      canAdd,
      canEdit,
      canDelete,
    } = this.props;

    return (
      <FieldArray
        name={name}
        component={FieldRow}
        onAddField={this.handleAddField}
        formatter={this.buildComponentFromTemplate}
        template={template}
        containerRef={(ref) => { this.container = ref; }}
        label={label}
        newItemTemplate={newItemTemplate}
        addDefault={this.addDefaultField}
        addDefaultItem={addDefaultItem}
        addLabel={addLabel}
        addButtonId={addButtonId}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        lastRowRef={(ref) => { this.lastRow = ref; }}
      />
    );
  }
}

RepeatableField.propTypes = {
  addButtonId: PropTypes.string,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  name: PropTypes.string.isRequired,
  newItemTemplate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
  ]),
  canAdd: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};
RepeatableField.contextTypes = {
  _reduxForm: PropTypes.object,
};
RepeatableField.defaultProps = {
  canAdd: true,
  canEdit: true,
  canDelete: true,
};

export default RepeatableField;
