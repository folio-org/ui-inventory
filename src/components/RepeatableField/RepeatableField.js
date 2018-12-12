import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { FieldArray } from 'redux-form';
import FieldRow from './FieldRow';

const RepeatableFieldPropTypes = {
  addButtonId: PropTypes.string,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  name: PropTypes.string.isRequired,
  newItemTemplate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  template: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

const contextTypes = {
  _reduxForm: PropTypes.object,
};

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
  }

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
    return (
      <FieldArray
        name={this.props.name}
        component={FieldRow}
        onAddField={this.handleAddField}
        formatter={this.buildComponentFromTemplate}
        template={this.props.template}
        containerRef={(ref) => { this.container = ref; }}
        label={this.props.label}
        newItemTemplate={this.props.newItemTemplate}
        addDefault={this.addDefaultField}
        addDefaultItem={this.props.addDefaultItem}
        addLabel={this.props.addLabel}
        addButtonId={this.props.addButtonId}
        lastRowRef={(ref) => { this.lastRow = ref; }}
      />
    );
  }
}

RepeatableField.propTypes = RepeatableFieldPropTypes;
RepeatableField.contextTypes = contextTypes;

export default RepeatableField;
