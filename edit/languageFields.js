import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import { Field } from 'redux-form';

import languages from '../data/languages';


const renderLanguages = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div>
    <Row>
      <Col sm={2} smOffset={4}>
        <Button type="button" buttonStyle="fullWidth secondary" id="clickable-add-identifier" onClick={() => fields.push({})}>Add Language</Button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </Col>
    </Row>
    {fields.map((language, index) => {
      const languageOptions = languages.selectOptions(language);
      return (
        <Row key={index}>
          <Col sm={2} smOffset={1}>
            <Field
              name={`${language}`}
              type="text"
              component={Select}
              label={index === 0 ? 'Language' : null}
              dataOptions={[{ label: 'Select language', value: '' }, ...languageOptions]}
            />
          </Col>
          <Col sm={1} smOffset={2}>
            { index === 0 ? <br /> : null }
            <Button
              buttonStyle="fullWidth secondary"
              type="button"
              title={`Remove language ${index + 1}`}
              onClick={() => fields.remove(index)}
            >Delete language</Button>
          </Col>
        </Row>
      // /
      );
    })}
  </div>
);
renderLanguages.propTypes = { fields: PropTypes.object, meta: PropTypes.object };

export default renderLanguages;
