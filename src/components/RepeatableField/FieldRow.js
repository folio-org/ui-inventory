import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Layout,
  Icon,
  Row,
  Col,
  omitProps,
  SRStatus,
} from '@folio/stripes/components';

import css from './RepeatableField.css';

const FieldRowPropTypes = {
  addButtonId: PropTypes.string,
  addDefault: PropTypes.func,
  addDefaultItem: PropTypes.bool,
  addLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  containerRef: PropTypes.func,
  fields: PropTypes.object,
  formatter: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  lastRowRef: PropTypes.func,
  newItemTemplate: PropTypes.object,
  onAddField: PropTypes.func,
  template: PropTypes.arrayOf(PropTypes.object),
};

class FieldRow extends React.Component {
  constructor(props) {
    super(props);

    this.refIfLastRow = this.refIfLastRow.bind(this);
    this.renderControl = this.renderControl.bind(this);
    this.addButton = null;
    this.srstatus = null;
    this.action = null;

    this.addButtonId = this.props.addButtonId || uniqueId(`${this.props.label}AddButton`);
  }

  componentDidMount() {
    if (this.props.fields.length === 0 && this.props.addDefaultItem) {
      setTimeout(() => { this.props.addDefault(this.props.fields); }, 5);
    }
  }

  componentDidUpdate() {
    const {
      fields,
      label,
    } = this.props;

    if (this.action) {
      if (this.action.type === 'add') {
        this.srstatus.sendMessage(
          `added new ${label} field. ${fields.length} ${label} total`
        );
        this.action = null;
      }
      if (this.action.type === 'remove') {
        const { item } = this.action;
        let contextualSpeech;
        if (typeof item === 'string') {
          contextualSpeech = this.action.item;
        } else if (typeof item === 'object') {
          const valueArray = [];
          for (const key in item) {
            if (typeof item[key] === 'string' && item[key].length < 25) {
              valueArray.push(item[key]);
            }
          }
          if (valueArray.length > 0) {
            contextualSpeech = valueArray.join(' ');
          } else {
            contextualSpeech = this.action.index;
          }
        }
        this.srstatus.sendMessage(
          `${label} ${contextualSpeech} has been removed. ${fields.length} ${label} total`
        );
        this.action = null;
        document.getElementById(this.addButtonId).focus();
      }
    }
  }

  handleRemove(index, item) {
    this.action = { type: 'remove', item, index };
    this.props.fields.remove(index);
  }

  handleAdd() {
    this.action = { type: 'add' };
  }

  refIfLastRow(ref, index) {
    const { fields } = this.props;
    if (index === fields.length - 1) {
      this.lastRow = ref;
      this.props.lastRowRef(ref);
    }
  }

  renderControl(fields, field, fieldIndex, template, templateIndex) {
    if (template.render) {
      return template.render({ fields, field, fieldIndex, templateIndex });
    }

    const { name, label, ...rest } = omitProps(template, ['component', 'render']);
    const labelProps = {};
    if (fieldIndex === 0) {
      labelProps.label = label;
    } else {
      labelProps['aria-label'] = `${label} ${fieldIndex}`;
    }
    return (
      <Field
        name={name ? `${fields.name}[${fieldIndex}].${name}` : `${fields.name}[${fieldIndex}]`}
        component={this.props.formatter}
        templateIndex={templateIndex}
        id={uniqueId(field)}
        fullWidth
        {...labelProps}
        data-key={fieldIndex}
        {...rest}
      />
    );
  }

  render() {
    const {
      addDefaultItem,
      addLabel,
      containerRef,
      fields,
      label,
      onAddField,
      template,
    } = this.props;

    const legend = (
      <legend
        id={this._arrayId}
        className={css.RFLegend}
      >
        {label}
      </legend>
    );

    const handleButtonClick = () => { onAddField(fields); };

    if (fields.length === 0 && !addDefaultItem) {
      return (
        <div ref={containerRef}>
          <SRStatus ref={(ref) => { this.srstatus = ref; }} />
          <fieldset className={css.RFFieldset}>
            {legend}
            <Button
              style={{ marginBottom: '12px' }}
              onClick={handleButtonClick}
              id={this.addButtonId}
            >
              {addLabel || (
                <Icon icon="plus-sign">
                  <FormattedMessage
                    id="ui-inventory.addLabel"
                    values={{ label }}
                  />
                </Icon>
              )}
            </Button>
          </fieldset>
        </div>
      );
    }
    return (
      <div ref={containerRef}>
        <SRStatus ref={(ref) => { this.srstatus = ref; }} />
        <fieldset className={css.RFFieldset}>
          {legend}

          {fields.map((f, fieldIndex) => (
            <div
              key={`${label}-${fieldIndex}`}
              style={{ width: '100%' }}
              ref={(ref) => { this.refIfLastRow(ref, fieldIndex); }}
            >
              <Row>
                <Col xs={10}>
                  <Row>
                    {template.map((t, i) => (
                      <Col xs key={`field-${i}`}>
                        {this.renderControl(fields, f, fieldIndex, t, i)}
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col xs={2}>
                  <Layout className={fieldIndex === 0 ? 'marginTopLabelSpacer' : ''}>
                    <FormattedMessage
                      id="stripes-components.removeFields"
                      values={{ item: label, num: fieldIndex + 1 }}
                    >
                      {ariaLabel => (
                        <Button
                          buttonStyle="link"
                          style={{ padding: 0, marginBottom: '12px' }}
                          onClick={() => { this.handleRemove(fieldIndex, f); }}
                          ariaLabel={ariaLabel}
                        >
                          <Icon icon="trash" />
                        </Button>
                      )}
                    </FormattedMessage>
                  </Layout>
                </Col>
              </Row>

              {fieldIndex === fields.length - 1 &&
                <Button
                  onClick={handleButtonClick}
                  id={this.addButtonId}
                >
                  {addLabel || (
                    <FormattedMessage
                      id="stripes-components.addNewField"
                      values={{ item: label }}
                    />)}
                </Button>
              }
            </div>
          ))}
        </fieldset>
      </div>
    );
  }
}

FieldRow.propTypes = FieldRowPropTypes;

export default FieldRow;
